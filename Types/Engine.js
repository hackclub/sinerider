const EngineRenderMode = Object.freeze({
  // Do our best to run the game without UI/canvas, never perform actual draw calls
  HEADLESS: 'HEADLESS',

  // Render one frame per tick, and only that
  FRAME_EVERY_TICK: 'FRAME_EVERY_TICK',

  // Uncapped performance, splits tick rate from render rate completely.  NOTE: I have tested this in Chrome and observed
  // that it does result in higher FPS, but is limited to the refresh rate of your display due to use of requestAnimationFrame
  // Note that turning this on has no real effect right now
  HIGH_PERFORMANCE: 'HIGH_PERFORMANCE',
})

// The game engine!  Behold its awesome glory
function Engine(ticksPerSecond = 60, tickDelta = 1.0 / 30.0, debugStepping = false, debugLevel = null, renderMode = EngineRenderMode.HIGH_PERFORMANCE, fpsLogging = false, tickTimeLogging = false) {
  this.fpsLogging = fpsLogging
  this.ticksPerSecond = ticksPerSecond
  this.tickTimeLogging = tickTimeLogging
  this.tickDelta = tickDelta
  this.debugStepping = debugStepping
  this.debugLevel = debugLevel
  this.renderMode = renderMode
  this.tickCount = 0
  this.canvasIsDirty = true
  this.canvas = ui.canvas
  this.screen = Screen({ canvas: ui.canvas, })
  this.world = null  

  this.resetFpsCounter()
  this.injectDebugLevelIfNeeded()
}

/**
 * Start the engine
 */
Engine.prototype.start = function () {
  const me = this

  this.world = World({
    ui: ui,
    screen: me.screen,
    requestDraw: me.requestDraw.bind(me),
    tickDelta: me.tickDelta,
    drawOrder: NINF,
    ...worldData[0]
  })

  this.tick()
  this.draw()

  if (!this.debugStepping) {
    setInterval(this.tick.bind(this), 1000 / ticksPerSecond)
  }

  this.initUserInterface(this.canvas, this.world)

  // Do not schedule draw timer if in headless mode, or relying on frame drawing every tick
  if (this.renderMode !== EngineRenderMode.HEADLESS && this.renderMode !== EngineRenderMode.FRAME_EVERY_TICK) {
    // Draw as fast as we possibly can
    setInterval(this.requestDraw.bind(this), 0)
  }
}

/**
 * Main world tick handler.  Dispatches tick events to all subentities
 */
Engine.prototype.tick = function () {
  const me = this

  // Performs an actual tick.  Returns elapsed time spent ticking in milliseconds
  function tickInternal() {
    const startTime = Date.now()
    me.tickCount++
    me.world.awake()
    me.world.start()
    me.world.sendEvent('tick')
  
    // Draw every tick if the render mode suggests to do so
    if (me.renderMode === EngineRenderMode.FRAME_EVERY_TICK) {
      me.requestDraw()
    }
  
    if (me.fpsLogging && (me.tickCount % 100 == 0)) {
      me.logFps()
      me.resetFpsCounter()
    }
    return Date.now() - startTime
  }

  // Do the tick
  const tickTimeMs = tickInternal();

  if (this.tickTimeLogging) {
    console.log(`tick took ${tickTimeMs} ms`)
  }
}

/**
 * Main world draw handler.  Only draws if the canvas is dirty.  Sorts all drawable world entities
 * by layer and calls their draw methods back-to-front
 */
Engine.prototype.draw = function () {
  if (!this.canvasIsDirty || this.renderMode === EngineRenderMode.HEADLESS) return
  this.canvasIsDirty = false

  // Draw order bug where Shader entity isn't actually
  // sorted in World draw array and needs another sort call
  // in order to work? Temp fix (TODO: Fix this)
  this.world.sortDrawArray()

  let entity
  for (let i = 0; i < this.world.activeDrawArray.length; i++) {
    entity = this.world.activeDrawArray[i]
    if (entity.draw) {
      this.screen.ctx.save()
      if (entity.predraw) entity.predraw()
      entity.draw()
      this.screen.ctx.restore()
    }
  }

  if (this.fpsLogging) {
    this.fpsStats.frameCount++
  }
}

/**
 * Forces the drawing of a frame by setting the canvas to dirty, and scheduling a draw
 */
Engine.prototype.requestDraw = function () {
  if (!this.canvasIsDirty && this.renderMode !== EngineRenderMode.HEADLESS) {
    this.canvasIsDirty = true
    requestAnimationFrame(this.draw.bind(this))
  }
}

/**
 * Initialize the formula input field with MathQuill helpers
 */
Engine.prototype.initInputField = function (world) {
  let me = this
  // MathQuill
  ui.mathFieldStatic = MQ.StaticMath(ui.mathFieldStatic)

  function createMathField(field, eventNameOnEdit) {
    field = MQ.MathField(field, {
      handlers: {
        edit: function () {
          const text = field.getPlainExpression()
          const latex = field.latex()
          world.level.sendEvent(eventNameOnEdit, [text, latex])
        },
      },
    })

    field.getPlainExpression = function () {
      var tex = field.latex()
      return mathquillToMathJS(tex)
    }

    return field
  }

  ui.mathField = createMathField(ui.mathField, 'setGraphExpression')
  ui.mathField.focused = () => ui._mathField.classList.contains('mq-focused')

  ui.dottedMathFieldStatic = MQ.StaticMath(ui.dottedMathFieldStatic)

  function onMathFieldFocus(event) {
    world.onMathFieldFocus()
  }

  ui.expressionEnvelope.addEventListener('focusin', onMathFieldFocus)

  function onMathFieldBlur(event) {
    world.onMathFieldBlur()
  }

  ui.expressionEnvelope.addEventListener('blurout', onMathFieldBlur)
}

/**
 * Initialize the user interface, adding key handlers and the like
 */
Engine.prototype.initUserInterface = function (canvas, world) {
  let me = this
  this.initInputField(world)

  // HTML events
  function onKeyUp(event) {
    if (event.keyCode === 13) {
      if (!world.navigating) {
        world.toggleRunning()
      }
    }
  }

  window.addEventListener('keydown', (event) => {
    if (ui.mathField.focused()) return
    world.level.sendEvent('keydown', [event.key])
  })

  window.addEventListener('keyup', onKeyUp)

  function onExpressionTextChanged(event) {
    world.level.sendEvent('setGraphExpression', [ui.expressionText.value])
  }

  function setGlobalVolumeLevel(i) {
    Howler.volume(i)
    window.localStorage.setItem('volume', i)
  }

  function onSetVolume(event) {
    let volume = event.target.value / 100
    setGlobalVolumeLevel(volume)
  }

  ui.volumeSlider.addEventListener('change', onSetVolume)
  ui.volumeSlider.addEventListener('mouseup', onSetVolume)
  ui.volumeSlider.addEventListener('input', onSetVolume)

  function onClickHint() {
    ui.dottedHintButton.style.display = 'none'

    ui.dottedSlider.hidden = false
    ui.dottedSlider.style.innerHeight = '200px'
    ui.dottedMathField.style.display = 'block'

    me.world.level.sendEvent('displayDottedGraph')
  }

  ui.dottedHintButton.addEventListener('click', onClickHint)

  // Initial page state
  {
    let volume = window.localStorage.getItem('volume')
    if (volume) {
      setGlobalVolumeLevel(window.localStorage)
      ui.volumeSlider.value = volume * 100
    }
  }
  setGlobalVolumeLevel(ui.volumeSlider.value / 100)

  function onClickMapButton(event) {
    world.onClickMapButton()
    me.requestDraw()
  }

  ui.levelButton.addEventListener('click', onClickMapButton)
  ui.navigatorButton.addEventListener('click', onClickMapButton)

  function onClickNextButton(event) {
    world.onClickNextButton()
  }

  ui.nextButton.addEventListener('click', onClickNextButton)

  function onClickRunButton(event) {
    if (!me.world.level?.isRunningAsCutscene && !world.navigating)
    world.toggleRunning()

    return true
  }

  // TODO: Encapsulate run/stop/victory button behavior (Entity?)
  ui.runButton.addEventListener('click', onClickRunButton)
  ui.stopButton.addEventListener('click', onClickRunButton)
  ui.tryAgainButton.addEventListener('click', onClickRunButton)

  if (ui.victoryStopButton)
    ui.victoryStopButton.addEventListener('click', onClickRunButton)

  function onClickShowAllButton(event) {
    world.navigator.showAll = !world.navigator.showAll
  }

  ui.showAllButton.addEventListener('click', onClickShowAllButton)

  function onClickEditButton(event) {
    world.editing = !world.editing
  }

  ui.editButton.addEventListener('click', onClickEditButton)

  function onClickResetButton(event) {
    world.onClickResetButton()
  }

  ui.resetButton.addEventListener('click', onClickResetButton)

  function onResizeWindow(event) {
    world.sendEvent('resize', [window.innerWidth, window.innerHeight])
    me.screen.resize()
    me.requestDraw()
  }

  window.addEventListener('resize', onResizeWindow)

  function onClickCanvas() {
    if (me.debugStepping) {
      me.tick()
    }
  }

  canvas.addEventListener('click', onClickCanvas)
  ui.veil.addEventListener('click', onClickCanvas)

  function onMouseMoveCanvas(event) {
    world.clickableContext.processEvent(event, 'mouseMove')
    event.preventDefault()
  }

  canvas.addEventListener('mousemove', onMouseMoveCanvas)
  canvas.addEventListener('pointermove', onMouseMoveCanvas)

  function onMouseDownCanvas(event) {
    world.clickableContext.processEvent(event, 'mouseDown')
    event.preventDefault()
    ui.mathField.blur()
  }

  canvas.addEventListener('mousedown', onMouseDownCanvas)
  canvas.addEventListener('pointerdown', onMouseDownCanvas)

  function onMouseUpCanvas(event) {
    world.clickableContext.processEvent(event, 'mouseUp')
    event.preventDefault()
  }

  canvas.addEventListener('mouseup', onMouseUpCanvas)
  canvas.addEventListener('pointerup', onMouseUpCanvas)

  ui.levelInfoDiv.addEventListener('mouseover', function () {
    ui.hideLevelInfoButton.setAttribute('hide', false)
  })

  ui.levelInfoDiv.addEventListener('mouseleave', function () {
    ui.hideLevelInfoButton.setAttribute('hide', true)
  })

  // Don't show debug info in production
  if (window.location.hostname === 'sinerider.com')
    ui.levelInfoDiv.setAttribute('hide', true)

  ui.levelText.setAttribute('hide', true)
  ui.veil.setAttribute('hide', true)
}

/**
 * Add debug level info if such configuration is enabled
 */
Engine.prototype.injectDebugLevelIfNeeded = function () {
  let w = worldData[0]

  if (debugLevel) {
    // make debug level first level for testing
    const debugLevelIndex = w.levelData.findIndex((l) => l.name === debugLevel)
    if (debugLevelIndex == -1)
      alert(`DEBUG: Unable to find level '${debugLevel}'`)
    const tmp = w.levelData[0]
    w.levelData[0] = w.levelData[debugLevelIndex]
    w.levelData[debugLevelIndex] = tmp
  }
}

Engine.prototype.getWorld = function() {
  return this.world
}

Engine.prototype.resetFpsCounter = function() {
  this.fpsStats = { frameCount: 0, lastResetTime: Date.now() }
}

Engine.prototype.logFps = function() {
  const elapsedTimeSeconds = (Date.now() - this.fpsStats.lastResetTime) / 1000.0
  console.log("FPS: " + this.fpsStats.frameCount / elapsedTimeSeconds)
}
