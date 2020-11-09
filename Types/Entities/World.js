function World(spec) {
  const self = Entity(spec, 'World')
  
  const {
    ui,
    screen,
    levelData,
    requestDraw,
    tickDelta,
  } = spec
  
  let clickableContext = ClickableContext({
    entity: self,
  })

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
    parent: self,
  })
  
  let level
  let levelDatum
  let levelBubble
  
  function start() {
    setLevel(levelData[0].nick)
  }
  
  function tick() {
    if (running) runTime += tickDelta
  }
  
  function draw() {
  }
  
  function setLevel(nick) {
    if (level) level.destroy()
    
    levelDatum = _.find(levelData, v => v.nick == nick)
    levelBubble = navigator.getBubbleByNick(nick)
    
    level = Level({
      datum: levelDatum,
      globalScope,
      screen,
      parent: self,
      active: !navigating,
      levelCompleted,
      tickDelta,
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
    ui.navigatorFloatingBar.setAttribute('hide', !navigating)
    
    if (navigating) {
      navigator.revealHighlightedLevels(levelDatum.nick)
      navigator.refreshBubbles()
    }
    else {
      navigator.showAll = false
      if (navigator.showAllUsed)
        ui.showAllButton.setAttribute('hide', false)
    }
  }
  
  function levelCompleted() {
    console.log(`Level ${levelDatum.nick} completed`)
    ui.victoryBar.setAttribute('hide', false)
    levelBubble.complete()
    
    ui.showAllButton.setAttribute('hide', true)
  }
  
  function transitionNavigating(_navigating, duration=1, cb) {
    ui.veil.setAttribute('hide', false)
    setTimeout(() => {
      // Hack to fix camera flicker
      setTimeout(() => {
        ui.veil.setAttribute('hide', true)
      }, 100)
      setNavigating(_navigating)
      
      if (cb) cb()
    }, duration*1000)
  }
  
  function nextLevel() {
    transitionNavigating(true, 1, () => {
      stopRunning()
    })
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
    self.sendEvent('startRunningLate', [])
    
    requestDraw()
  }
  
  function stopRunning() {
    runTime = 0
    running = false
    
    ui.expressionText.disabled = false
    ui.menuBar.setAttribute('hide', false)
    ui.victoryBar.setAttribute('hide', true)
    
    self.sendEvent('stopRunning', [])
    self.sendEvent('stopRunningLate', [])
    
    requestDraw()
  }
  
  function toggleRunning() {
    if (running) stopRunning()
    else startRunning()
  }
  
  return self.mix({
    start,
    tick,
    draw,
    
    toggleRunning,
    
    nextLevel,
    setLevel,
    
    clickableContext,
    
    setNavigating,
    transitionNavigating,
    
    navigator,
    
    get editing() {return editing},
    set editing(v) {setEditing(v)},
    
    get level() {return level},
    
    get navigating() {return navigating},
    set navigating(v) {setNavigating(v)},
  })
}