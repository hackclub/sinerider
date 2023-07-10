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

  const ASSET_TIMEOUT = 5000

  const assetsLoaded = {}
  const attemptsTried = {}

  load(self)

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

    let asset

    // TODO: Add fault tolerance for assets which fail to resolve
    // (maybe add a timeout (w/ a max number of attempts?) for each asset type?)

    if (isImage) {
      asset = new Image()
      fetch(path)
        .then((res) => res.blob())
        .then((blob) => {
          asset.src = URL.createObjectURL(blob)
          assetLoaded(path)
        })
        .catch((error) => {
          handleFailure(error, path)
        })
    } else if (isSound) {
      ;(assetSpec.src = path),
        (asset = new Howl({
          ...assetSpec,
          onload: () => assetLoaded(path),
          onloaderror: (error) => handleFailure(error, path),
        }))
    } else if (isShader) {
      fetch(path)
        .then((raw) => raw.text())
        .then((text) => {
          object[key] = text
          assetLoaded(path)
        })
        .catch((error) => handleFailure(error, path))
    } else {
      throw `Unexpected file extension: .${extension}`
    }

    // TODO: Clean up
    setTimeout(() => {
      if (!assetsLoaded[path]) {
        const attempts = attemptsTried[path] || 1
        if (attempts < 5) {
          console.log(`Failed to load ${path} after 5000ms, retrying...`)
          attemptsTried[path] = attemptsTried + 1
          loadAsset(arguments)
        }
      }
    }, ASSET_TIMEOUT)

    object[key] = asset

    loadCount++
    loadTotal++
  }

  function load(object, folders = []) {
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
