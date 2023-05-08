function PlayerStorage() {
  let levels = localStorage.getItem('levels')
  levels = levels ? JSON.parse(levels) : {}

  let activeLevel = localStorage.getItem('activeLevel')

  function getLevel(name) {
    return levels[name]
  }

  function getCompletedLevels() {
    return _.filter(levels, (v) => v?.completed)
  }

  function save() {
    localStorage.setItem('levels', JSON.stringify(levels))
    localStorage.setItem('activeLevel', activeLevel)
  }

  function setLevel(name, data, activate = true) {
    if (!data) return

    levels[name] = data
    if (activate) activeLevel = name
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
