function World(spec) {
  const self = Entity(spec, 'World')
  
  const {
    ui,
    screen,
    levelData,
    requestDraw,
    tickDelta,
    version,
  } = spec

  let running = false
  let runTime = 0
  
  const globalScope = {
    get t() {return runTime},
    dt: tickDelta,
    
    get running() {return running},
  }
  
  let navigating = false
  let editing = false
  
  const assets = Assets({
    paths: spec.assets,
    callbacks: {
      complete: assetsComplete,
      progress: assetsProgress,
    }
  })
  
  const clickableContext = ClickableContext({
    entity: self,
  })
  
  let navigator
  
  let level
  let levelDatum
  let levelBubble
  
  function start() {
  }
  
  function tick() {
    if (window.innerHeight != screen.height || window.innerWidth != screen.width)
      screen.resize()
      
    if (running) runTime += tickDelta
  }
  
  function draw() {
  }
  
  function loadingVeilClicked() {
    console.log(`Loading veil clicked`)
    
    ui.loadingVeil.setAttribute('hide', true)
    
    navigator = Navigator({
      ui,
      screen,
      assets,
      levelData,
      getEditing,
      setLevel,
      active: false,
      parent: self,
    })
  
    setLevel(levelData[0].nick)
  }
  
  function assetsComplete() {
    console.log(`All World assets loaded`)
    
    ui.loadingVeilString.innerHTML = 'click to begin'
    ui.loadingVeil.addEventListener('click', loadingVeilClicked)
  }
  
  function assetsProgress(progress, total) {
    console.log(`Loaded ${progress} of ${total} assets`)
    
    ui.loadingVeilString.innerHTML = `loading…<br>${Math.round(100*progress/total)}%`
  }
  
  function setLevel(nick) {
    if (level) level.destroy()
    
    levelDatum = _.find(levelData, v => v.nick == nick)
    levelBubble = navigator.getBubbleByNick(nick)
    
    level = Level({
      screen,
      assets,
      parent: self,
      name: levelDatum.nick,
      datum: levelDatum,
      globalScope,
      active: !navigating,
      levelCompleted,
      tickDelta,
    })
    
    level.playOpenMusic()
    
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
    // ui.topBar.setAttribute('hide', navigating)
    
    if (navigating) {
      navigator.revealHighlightedLevels(levelDatum.nick)
      navigator.refreshBubbles()
    }
    else {
      // ui.variablesBar.setAttribute('hide', true)
      
      navigator.showAll = false
      if (navigator.showAllUsed)
        ui.showAllButton.setAttribute('hide', false)
    }
  }
  
  function levelCompleted() {
    console.log(`Level ${levelDatum.nick} completed`)
    
    ui.victoryBar.setAttribute('hide', false)
    ui.controlBar.setAttribute('hide', true)
    
    // ui.variablesBar.setAttribute('hide', true)
    ui.showAllButton.setAttribute('hide', true)
    
    levelBubble.complete()
  }
  
  function transitionNavigating(_navigating, duration=1, cb) {
    ui.veil.setAttribute('hide', false)
    setTimeout(() => {
      // HACK: to fix camera flicker
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
    
    ui.expressionText.blur()
    ui.expressionText.disabled = true
    ui.menuBar.setAttribute('hide', true)
    // ui.variablesBar.setAttribute('hide', false)
    
    ui.runButton.setAttribute('hide', true)
    ui.stopButton.setAttribute('hide', false)
    ui.topBar.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', true)
    
    self.sendEvent('startRunning', [])
    self.sendEvent('startRunningLate', [])
    
    requestDraw()
  }
  
  function stopRunning() {
    runTime = 0
    running = false
    
    ui.expressionText.blur()
    ui.expressionText.disabled = false
    ui.menuBar.setAttribute('hide', false)
    ui.victoryBar.setAttribute('hide', true)
    // ui.variablesBar.setAttribute('hide', true)
    
    ui.controlBar.setAttribute('hide', navigating)
    ui.topBar.setAttribute('hide', false)
    ui.runButton.setAttribute('hide', false)
    ui.stopButton.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', false)
    
    if (!navigating) {
      // HACK: Timed to avoid bug in Safari (at least) that causes whole page to be permanently offset when off-screen text input is focused
      setTimeout(() => ui.expressionText.focus(), 250)
    }
    
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
    
    get navigator() {return navigator},
    
    get editing() {return editing},
    set editing(v) {setEditing(v)},
    
    get level() {return level},
    
    get navigating() {return navigating},
    set navigating(v) {setNavigating(v)},
  })
}