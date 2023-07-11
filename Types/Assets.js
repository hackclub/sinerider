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
  let predictedNetworkSpeedBps = 100 * 1024

  const assetTimeouts = []

  let checkAssetTimeoutsInterval = null

  const assetRequests = {}

  const assetsLoaded = {}

  let totalBytesLoaded = 0

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
    console.log(
      `Took ${loadTimeMs}ms (${loadTimeMs / 1000}s) to load ${bytes} bytes`,
    )
    // Average
    const bps = bytes / (loadTimeMs / 1000)
    const initialBytes = 0
    const total = totalBytesLoaded + initialBytes + bytes
    predictedNetworkSpeedBps =
      ((totalBytesLoaded + initialBytes) / total) * predictedNetworkSpeedBps +
      (bytes / total) * bps
  }

  function loadAssetFromPath(object, key, path, assetFromBlob, assetSpec) {
    const request = new XMLHttpRequest()
    request.responseType = 'blob'

    const requests = assetRequests[path] || (assetRequests[path] = [])

    requests.push(request)

    // When request was dispatched
    let start

    const _start = performance.now()

    request.onloadstart = () => {
      start = performance.now()
      console.log(`Took ${start - _start}ms for request to be dispatched`)
    }

    request.onprogress = (event) => {
      console.log(`Loaded ${event.loaded}`)
    }

    request.onload = () => {
      const blob = request.response

      // Incorporate blob load time + size to reestimate network speed
      const now = performance.now()
      correctNetworkSpeedPrediction(blob.size, now - start)

      assetFromBlob(blob, assetSpec)
        .then((asset) => {
          // Abort other asset fetch attempts, if they exist
          for (const r of requests) {
            if (r != request) r.abort()
          }

          // Load asset
          object[key] = asset
          assetLoaded()
        })
        .catch((error) => {
          // Throw if assetFromBlob fails
          handleFailure(error, path)
        })
    }

    request.open('GET', path)
    request.send()
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

    // Pass extension to Howler.js if it's a sound
    if (isSound) assetSpec.format = extension

    loadAssetFromPath(object, key, path, assetFromBlob, assetSpec)

    const assetTimeout = (timeoutMs) => {
      if (!assetsLoaded[key]) {
        if (totalRetryAttempts < maxRetryAttempts) {
          console.log(
            `Failed to load ${path} after ${timeoutMs}ms, retrying...`,
          )
          totalRetryAttempts += 1
          loadAssetFromPath(path, assetFromBlob)
        } else {
          handleFailure(error, path)
        }
      }
    }

    const now = performance.now()

    assetTimeouts.push([assetTimeout, now])

    loadCount++
    loadTotal++
  }

  function checkAssetTimeouts() {
    // Max time it could reasonably take
    // (estimate of how long it'd take to load 10 MB)
    // Constant for time being, could change w/ file
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
    console.log('Loaded asset', path)
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
