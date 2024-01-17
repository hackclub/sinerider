function Assets() {
  const self = {}

  let loadTotal = 0
  let loadCount = 0
  let loaded = false
  let failed = false

  const imageExtensions = ['svg', 'png', 'jpg', 'jpeg', 'webp']
  const soundExtensions = ['m4a', 'mp3', 'ogg', 'wav']
  const shaderExtensions = ['glsl', 'frag', 'vert']

  const maxRetryAttempts = 5

  let totalRetryAttemptsMade = 0

  // Start with 100 kbps for (low) initial guess
  let predictedNetworkSpeedBps = 100 * 1024

  const assetTimeouts = []

  let checkAssetTimeoutsInterval = null

  const assetAbortControllers = {}

  const assetsLoaded = {}

  let bytesLoaded = 0

  let onComplete

  function soundFromBlob(blob, assetSpec) {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(blob)
      assetSpec.src = blobUrl
      // For some reason loading howl before page
      // is clicked (loading veil) angers Chrome? TODO: Fix
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
    loadTimeMs = Math.max(loadTimeMs, 1)
    const bps = bytes / (loadTimeMs / 1000)

    const total = bytesLoaded + bytes

    predictedNetworkSpeedBps =
      (bytesLoaded / total) * predictedNetworkSpeedBps + (bytes / total) * bps

    if (predictedNetworkSpeedBps == Infinity) debugger

    bytesLoaded = total
  }

  function loadAssetFromPath(
    object,
    key,
    path,
    assetFromBlob,
    assetSpec,
    onStartFetchCb,
  ) {
    const controller = new AbortController()

    const controllers =
      assetAbortControllers[key] || (assetAbortControllers[key] = [])

    controllers.push(controller)

    let start

    fetch(path, {
      signal: controller.signal,
    })
      .then((response) => {
        start = performance.now()
        onStartFetchCb()
        return response.blob()
      })
      .then((blob) => {
        // Incorporate blob load time + size to reestimate network speed
        const now = performance.now()
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

        _.set(object, key, asset)

        assetLoaded()
      })
  }

  function loadAsset(folders, key, file, assetSpec = {}) {
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

    const objectPath = folders.join('.') + '.' + key

    if (_.has(self, objectPath)) {
      // If already loaded asset, return
      return
    }

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

    const attemptLoad = () =>
      loadAssetFromPath(self, objectPath, path, assetFromBlob, assetSpec, () =>
        assetTimeouts.push([assetTimeout, performance.now()]),
      )

    const assetTimeout = (timeoutMs) => {
      if (!assetsLoaded[key]) {
        // TODO: Network speed prediction is terrible and calculated timeout
        // needs to be more conservative
        return
        if (totalRetryAttemptsMade < maxRetryAttempts) {
          console.log(
            `Failed to load ${path} after ${timeoutMs}ms, retrying...`,
          )
          totalRetryAttemptsMade += 1
          attemptLoad()
        } else {
          if (!failed) {
            // TODO: Use modal instead?
            alert(
              "We couldn't communicate with our servers — please try reloading",
            )
            failed = true
          }
        }
      }
    }

    attemptLoad()

    loadCount++
    loadTotal++
  }

  function checkAssetTimeouts() {
    // Max time it could reasonably take
    // (estimate of how long it'd take to load 10 MB)
    // Constant for time being, could change w/ file
    let timeoutMs = ((10 * 1024 * 1024) / predictedNetworkSpeedBps) * 1000
    timeoutMs = Math.max(timeoutMs, 1000)

    const now = performance.now()

    for (const [timeout, start] of assetTimeouts) {
      const elapsedMs = now - start
      if (elapsedMs > timeoutMs) {
        timeout(timeoutMs)
      }
    }
  }

  function loadAssets(object, folders = []) {
    if (!checkAssetTimeoutsInterval) {
      checkAssetTimeoutsInterval = setInterval(checkAssetTimeouts, 1000)
    }

    _.each(object, (v, i) => {
      if (_.isObject(v)) {
        if (_.has(v, 'src')) loadAsset(folders, i, v.src, v)
        else loadAssets(v, [...folders, i])
      } else if (_.isString(v)) loadAsset(folders, i, v)
    })
  }

  function loadingBarProgress(progress, total) {
    const percent = Math.round((100 * progress) / total)
    ui.loadingProgressBar.style.width = `${percent}%`
  }
  const levelLoadingTransitionLength = 1
  function playLeveLLoadingScreenFadeOut() {
    ui.levelLoadingVeil.setAttribute(
      'style',
      `animation: fadeOut ${levelLoadingTransitionLength}s ease-in-out forwards;`,
    )
    ui.levelLoadingVeil.addEventListener('animationend', () => {
      ui.levelLoadingVeil.setAttribute('hide', true)
      ui.levelLoadingVeil.removeAttribute('style')
    })
  }
  let levelLoadingScreenEnabled = true
  function hideLoadingScreen() {
    ui.loadingProgressBarContainer.setAttribute('hide', true)
    ui.loadingVeil.setAttribute('hide', true)

    if (levelLoadingScreenEnabled) playLeveLLoadingScreenFadeOut()
    levelLoadingScreenEnabled = false
  }

  function showLoadingScreen(loadingLevel = false) {
    if (!loadingLevel) {
      ui.loadingProgressBarContainer.setAttribute('hide', false)
      ui.loadingVeil.setAttribute('hide', false)
    } else {
      ui.levelLoadingVeil.setAttribute('style', `opacity: 1;`)
      ui.levelLoadingVeil.setAttribute('hide', false)
      levelLoadingScreenEnabled = true
    }
  }

  function load(paths, _onComplete, loadingLevel = false) {
    loaded = false

    onComplete = _onComplete

    loadAssets(paths)

    // If all assets happen to be already loaded,
    // invoke callback and clean up
    if (loadCount == 0) {
      onFinishLoading()
    } else {
      showLoadingScreen(loadingLevel)
    }
  }

  function onFinishLoading() {
    if (IS_DEVELOPMENT) {
      // For Puppeteer
      console.log('FINISHED_LOADING_ASSETS')
    }

    clearInterval(checkAssetTimeoutsInterval)
    checkAssetTimeoutsInterval = null

    //hideLoadingScreen()

    onComplete()
  }

  function assetLoaded(path) {
    assetsLoaded[path] = true
    loadCount--
    if (loadCount == 0) {
      onFinishLoading()
    }

    const progress = loadTotal - loadCount
    loadingBarProgress(progress, loadTotal)
  }

  function handleFailure(error, path) {
    console.error('Asset request failed', error, path)
    if (!failed) {
      alert(`Something failed to load: ${path}. Try refreshing the page.`)
      failed = true
    }
  }

  return _.mixIn(self, {
    load,
    hideLoadingScreen,

    get loaded() {
      return loaded
    },
  })
}
