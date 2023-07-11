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

  let attemptsTried = 0

  // Start with 100 kbps for initial guess
  let predictedNetworkSpeedBps = 100 * 1024

  const assetTimeouts = []

  let checkAssetTimeoutsInterval = null

  const assetAbortControllers = {}

  const assetsLoaded = {}

  let bytesLoaded = 0

  load(self)

  function soundFromBlob(blob, assetSpec) {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(blob)
      assetSpec.src = blobUrl
      const howl = new Howl({
        ...assetSpec,
        onload: () => resolve(howl),
        onerror: (error) => reject(error),
      })
    })
  }

  function imageFromBlob(blob) {
    const blobUrl = URL.createObjectURL(blob)
    const img = new Image()
    img.src = blobUrl
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = (error) => reject(error)
    })
  }

  function shaderFromBlob(blob) {
    return blob.text()
  }

  function correctNetworkSpeedPrediction(bytes, loadTimeMs) {
    const bps = bytes / (loadTimeMs / 1000)

    const total = bytesLoaded + bytes

    predictedNetworkSpeedBps =
      (bytesLoaded / total) * predictedNetworkSpeedBps + (bytes / total) * bps

    bytesLoaded = total
  }

  function loadAssetFromPath(object, key, path, assetFromBlob, assetSpec) {
    const controller = new AbortController()

    const controllers =
      assetAbortControllers[key] || (assetAbortControllers[key] = [])

    controllers.push(controller)

    const _start = performance.now()

    let start

    fetch(path, {
      signal: controller.signal,
    })
      .then((response) => {
        start = performance.now()
        console.log(`Took ${start - _start}ms to dispatch request`)
        return response.blob()
      })
      .then((blob) => {
        // Incorporate blob load time + size to reestimate network speed
        const now = performance.now()
        console.log(`Took ${now - start} to get data`)
        correctNetworkSpeedPrediction(blob.size, now - start)
        return blob
      })
      .then((blob) => assetFromBlob(blob, assetSpec))
      .catch((error) => {
        // Throw if assetFromBlob fails (and not from abort)
        if (error.name === 'AbortError') return
        else handleFailure(error, path)
      })
      .then((asset) => {
        // Abort other asset fetch attempts, if they exist
        for (const c of controllers) {
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

    if (!assetFromBlob) throw `Unexpected file extension: .${extension}`

    if (isSound) assetSpec.format = extension

    loadAssetFromPath(object, key, path, assetFromBlob, assetSpec)

    // Max time it could reasonably take
    // (estimate of how long it'd take to load 10 MB)

    const assetTimeout = (timeoutMs) => {
      if (!assetsLoaded[path]) {
        if (attemptsTried < maxRetryAttempts) {
          console.log(
            `Failed to load ${path} after ${timeoutMs}ms, retrying...`,
          )
          attemptsTried += 1
          loadAssetFromPath(object, key, path, assetFromBlob, assetSpec)
        } else {
          // handleFailure(`Retried assets too many times, try restarting`, path)
          if (!failed) {
            alert(
              `We couldn't communicate with our servers—please try reloading`,
            )
            failed = true
          }
        }
      }
    }

    const now = performance.now()

    assetTimeouts.push([assetTimeout, now])

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
