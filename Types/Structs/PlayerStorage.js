function PlayerStorage() {
  let levels = localStorage.getItem('levels')
  levels = levels ? JSON.parse(levels) : {}

  let activeLevel = localStorage.getItem('activeLevel')

  function getLevel(name) {
    return levels[name]
  }

  function getCompletedLevels() {
    return _.filter(
      levels,
      (v, k) => v?.completed && !k.toLowerCase().startsWith('puzzle_'),
    )
  }

  function save() {
    // TODO: Fix
    if (activeLevel === 'CUSTOM_LEVEL') return
    localStorage.setItem('levels', JSON.stringify(levels))
    localStorage.setItem('activeLevel', activeLevel)
  }

  function setLevel(name, data, activate = true) {
    if (!data) return

    levels[name] = data
    if (activate && !name.startsWith('puzzle_')) activeLevel = name
    save()
  }

  function clear() {
    levels = {}
    activeLevel = null
    save()
  }

  return {
    get levels() {
      return levels
    },
    clear,
    getCompletedLevels,
    getLevel,
    setLevel,

    get activeLevel() {
      return activeLevel
    },
    set activeLevel(v) {
      activeLevel = v
      save()
    },
  }
}
