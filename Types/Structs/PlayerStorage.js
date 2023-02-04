function PlayerStorage() {
  let levels = localStorage.getItem('levels')
  levels = levels ? JSON.parse(levels) : {}

  function getLevel(name) {
    return levels[name]
  }

  function setLevel(name, data) {
    levels[name] = data
    localStorage.setItem('levels', JSON.stringify(data))
  }

  return {
    getLevel,
    setLevel,
  }
}
