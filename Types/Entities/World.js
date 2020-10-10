function World(spec) {
  const self = Entity({
    name: 'World'
  })
  
  const {
    ui,
    screen,
    levelData,
    requestDraw,
    tickDelta,
  } = spec

  let running = false
  let runTime = 0
  
  const globalScope = {
    get t() {return runTime},
    dt: tickDelta,
    
    get running() {
      return running
    }
  }
  
  let navigating = false
  let editing = false
  
  const navigator = Navigator({
    ui,
    screen,
    levelData,
    getEditing,
    setLevel,
    active: false,
  })
  
  self.addChild(navigator)
  
  let level
  let levelDatum
  
  setLevel(levelData[0])
  
  function tick() {
    if (running) runTime += tickDelta
  }
  
  function draw() {
  }
  
  function setLevel(_levelDatum) {
    if (level) level.destroy()
    
    levelDatum = _levelDatum
    level = Level({
      datum: levelDatum,
      globalScope,
      screen,
      parent: self,
      active: !navigating,
      levelCompleted,
    })
    
    ui.levelText.value = levelDatum.name
    ui.levelButtonString.innerHTML = levelDatum.name
    ui.expressionText.value = levelDatum.defaultExpression
    
    setNavigating(false)
  }
  
  function setNavigating(_navigating) {
    navigating = _navigating
    
    level.active = !navigating
    navigator.active = navigating
    
    ui.controlBar.setAttribute('hide', navigating)
  }
  
  function levelCompleted() {
    console.log('Level completed')
    ui.victoryBar.setAttribute('hide', false)
  }
  
  function nextLevel() {
    stopRunning()
    // setNavigating(true)
    
    let i = _.indexOf(levelData, levelDatum)
    i = (i+1)%levelData.length
    
    setLevel(levelData[i])
  }
  
  function getEditing() {
    return editing
  }
  
  function setEditing(_editing) {
    editing = _editing
  }
  
  function startRunning() {
    running = true
    
    ui.expressionText.disabled = true
    ui.menuBar.setAttribute('hide', true)
    
    self.sendEvent('startRunning', [])
    
    requestDraw()
  }
  
  function stopRunning() {
    runTime = 0
    running = false
    
    ui.expressionText.disabled = false
    ui.menuBar.setAttribute('hide', false)
    ui.victoryBar.setAttribute('hide', true)
    
    self.sendEvent('stopRunning', [])
    
    requestDraw()
  }
  
  function toggleRunning() {
    if (running) stopRunning()
    else startRunning()
  }
  
  return self.mix({
    tick,
    draw,
    
    toggleRunning,
    
    nextLevel,
    setLevel,
    
    get editing() {return editing},
    set editing(v) {setEditing(v)},
    
    get level() {return level},
    
    get navigating() {return navigating},
    set navigating(v) {setNavigating(v)},
  })
}