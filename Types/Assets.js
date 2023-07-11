function Assets(spec) {
  const { paths, callbacks } = spec

  const self = _.cloneDeep(paths)

  let loadTotal = 0
  let loadCount = 0
  let loaded = false
  let failed = false

  const imageExtensions = ['svg', 'png', 'jpg', 'jpeg', 'webp']
  const soundExtensions = ['m4a', 'mp3', 'ogg', 'wav']
  const shaderExtensions = ['glsl', 'frag', 'vert']

  if (callbacks.progress) callbacks.progress(0, loadTotal)

  const maxRetryAttempts = 5

  let totalRetryAttempts = 0

  // Start with 100 kbps for initial guess
  const predictedNetworkSpeedBps = 100 * 1024

  const assetTimeouts = []

  let checkAssetTimeoutsInterval = null

  load(self)

  function soundFromBlob(blob, assetSpec) {
    const blobType = blob.type
    const extension = blobType.substring(blobType.indexOf('/') + 1)
    return new Promise((resolve, reject) => {
      const blobUrl = Object.createObjectURL(blob)
      assetSpec.src = blobUrl
      const howl = new Howl({
        ...assetSpec,
        ext: extension,
        onload: () => resolve(howl),
        onerror: (error) => reject(error),
      })
    })
  }

  function imageFromBlob(blob, assetSpec) {
    const blobUrl = Object.createObjectURL(blob)
    const img = new Image()
    img.src = blobUrl
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = (error) => reject(error)
    })
  }

  function shaderFromBlob(blob, assetSpec) {
    return blob.text()
  }

  function correctNetworkSpeedPrediction(bytes, loadTimeMs) {
    const bps = bytes / loadTimeMs
    predictedNetworkSpeedBps = 0.8 * predictedNetworkSpeedBps + 0.2 * bps
  }

  function loadAssetFromPath(object, path, assetFromBlob, assetSpec) {
    const controller = new AbortController()

    const abortControllers = assetAbortControllers[key] || []

    abortControllers.push(controller)

    const start = performance.now()

    fetch(path, {
      signal: controller.signal,
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Incorporate blob load time + size to reestimate network speed
        const now = performance.now()
        correctNetworkSpeedPrediction(blob.size, now - start)
        return blob
      })
      .then((blob) => assetFromBlob(blob, assetSpec))
      .catch((error) => {
        // Throw if assetFromBlob fails
        handleFailure(error, path)
      })
      .then((asset) => {
        // Abort other asset fetch attempts, if they exist
        for (const c of abortControllers) {
          if (c != controller) c.abort()
        }

        // Load asset
        object[key] = asset
        assetLoaded(path)
      })
  }

  function loadAsset(object, folders, file, key, assetSpec = {}) {
    // console.log(`Loading asset '${file}' from folders `, folders)

    const extensions = _.tail(file.split('.'))
    const extension = extensions[0]
    const name = file.split('.')[0] || key
    const path =
      'Assets/' +
      folders
        .map((v) =>
          v
            .split('_')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join('_'),
        )
        .join('/') +
      '/' +
      name +
      '.' +
      extension

    const isImage = _.includes(imageExtensions, extension)
    const isSound = _.includes(soundExtensions, extension)
    const isShader = _.includes(shaderExtensions, extension)

    const assetFromBlob = isImage
      ? imageFromBlob
      : isSound
      ? soundFromBlob
      : isShader
      ? shaderFromBlob
      : null

    if (!produceAsset) throw `Unexpected file extension: .${extension}`

    loadAssetFromPath(object, path, assetFromBlob, assetSpec)

    // Max time it could reasonably take
    // (estimate of how long it'd take to load 10 MB)

    const assetTimeout = (timeoutMs) => {
      if (!assetsLoaded[path]) {
        if (attemptsTried < maxRetryAttempts) {
          console.log(
            `Failed to load ${path} after ${timeoutMs}ms, retrying...`,
          )
          attemptsTried += 1
          loadAssetFromPath(path, assetFromBlob)
        } else {
          handleFailure(error, path)
        }
      }
    }

    const now = performance.now()

    assetTimeouts.push(assetTimeout, now)

    loadCount++
    loadTotal++
  }

  function checkAssetTimeouts() {
    const timeoutMs = ((10 * 1024 * 1024) / predictedNetworkSpeedBps) * 1000

    const now = performance.now()

    for (const [timeout, start] of assetTimeouts) {
      const elapsedMs = now - start
      if (elapsedMs > timeoutMs) {
        timeout(timeoutMs)
      }
    }
  }

  function load(object, folders = []) {
    if (!checkAssetTimeoutsInterval) {
      checkAssetTimeoutsInterval = setInterval(checkAssetTimeouts, 1000)
    }

    _.each(object, (v, i) => {
      if (_.isObject(v)) {
        if (_.has(v, 'src')) loadAsset(object, folders, v.src, i, v)
        else load(v, [...folders, i])
      } else if (_.isString(v)) loadAsset(object, folders, v, i)
    })
  }

  function assetLoaded(path) {
    assetsLoaded[path] = true
    loadCount--
    if (loadCount == 0) {
      clearInterval(checkAssetTimeoutsInterval)
      checkAssetTimeoutsInterval = null

      callbacks.complete()
    } else if (callbacks.progress) {
      callbacks.progress(loadTotal - loadCount, loadTotal)
    }
  }

  function handleFailure(error, path) {
    console.error('Asset request failed', error, path)
    if (!failed) {
      alert(`Something failed to load: ${path}. Try refreshing the page.`)
      failed = true
    }
  }

  return _.mixIn(self, {
    get loaded() {
      return loaded
    },
  })
}
