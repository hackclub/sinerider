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

  load(self)

  if (callbacks.progress) callbacks.progress(0, loadTotal)

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
      asset.loading = 'eager'
      asset.src = path
      asset.onload = () => assetLoaded(path)
      asset.onerror = (error) => handleFailure(error, path)
    } else if (isSound) {
      ;(assetSpec.src = path),
        (asset = new Howl({
          ...assetSpec,
          onload: () => assetLoaded(path),
          onloaderror: (error) => handleFailure(error, path)
        }))
    } else if (isShader) {
      fetch(path)
        .then((raw) => raw.text())
        .then((text) => {
          object[key] = text
          assetLoaded(path)
        }).catch((error) => handleFailure(error, path))
    } else {
      return
    }

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
      alert("Something failed to load. Try refreshing the page.")
      failed = true
    }
  }

  return _.mixIn(self, {
    get loaded() {
      return loaded
    },
  })
}
