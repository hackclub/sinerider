function Engine(ticksPerSecond = 60, tickDelta = 1.0 / 30.0, debugStepping = false, debugLevel = null) {
  var me = this
  this.ticksPerSecond = ticksPerSecond
  this.tickDelta = tickDelta
  this.debugStepping = debugStepping
  this.debugLevel = debugLevel
  this.canvasIsDirty = true
  this.canvas = ui.canvas
  this.screen = Screen({ canvas: ui.canvas, })
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
    ...worldData[0]
  })

  this.tick()
  this.draw()

  if (!this.debugStepping) {
    setInterval(this.tick.bind(this), 1000 / ticksPerSecond)
  }

  this.initUserInterface()

  // Draw as fast as we possibly can
  setInterval(this.requestDraw.bind(this), 0)
}

/**
 * Main world tick handler.  Dispatches tick events to all subentities
 */
Engine.prototype.tick = function () {
  this.world.awake.bind(this.world)
  this.world.start.bind(this.world)
  this.world.tick.bind(this.world)
}

/**
 * Main world draw handler.  Only draws if the canvas is dirty.  Sorts all drawable world entities
 * by layer and calls their draw methods back-to-front
 */
Engine.prototype.draw = function () {
  if (!this.canvasIsDirty) return
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
}

/**
 * Forces the drawing of a frame by setting the canvas to dirty.
 */
Engine.prototype.requestDraw = function () {
  if (!this.canvasIsDirty) {
    this.canvasIsDirty = true
    requestAnimationFrame(this.draw.bind(this))
  }
}

/**
 * Initialize the formula input field with MathQuill helpers
 */
Engine.prototype.initInputField = function () {
  let me = this
  // MathQuill
  ui.mathFieldStatic = MQ.StaticMath(ui.mathFieldStatic)

  function createMathField(field, eventNameOnEdit) {
    field = MQ.MathField(field, {
      handlers: {
        edit: function () {
          const text = field.getPlainExpression()
          const latex = field.latex()
          me.world.level.sendEvent(eventNameOnEdit, [text, latex])
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
    me.world.onMathFieldFocus()
  }

  ui.expressionEnvelope.addEventListener('focusin', onMathFieldFocus)

  function onMathFieldBlur(event) {
    me.world.onMathFieldBlur()
  }

  ui.expressionEnvelope.addEventListener('blurout', onMathFieldBlur)
}

/**
 * Initialize the user interface, adding key handlers and the like
 */
Engine.prototype.initUserInterface = function () {
  let me = this
  me.initInputField()

  // HTML events
  function onKeyUp(event) {
    if (event.keyCode === 13) {
      if (!me.world.navigating) me.world.toggleRunning()
    }
  }

  window.addEventListener('keydown', (event) => {
    if (ui.mathField.focused()) return
    me.world.level.sendEvent('keydown', [event.key])
  })

  window.addEventListener('keyup', onKeyUp)

  function onExpressionTextChanged(event) {
    me.world.level.sendEvent('setGraphExpression', [ui.expressionText.value])
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
    me.world.onClickMapButton()
    me.requestDraw()
  }

  ui.levelButton.addEventListener('click', onClickMapButton)
  ui.navigatorButton.addEventListener('click', onClickMapButton)

  function onClickNextButton(event) {
    me.world.onClickNextButton()
  }

  ui.nextButton.addEventListener('click', onClickNextButton)

  function onClickRunButton(event) {
    if (!me.world.level?.isRunningAsCutscene && !world.navigating)
    me.world.toggleRunning()

    return true
  }

  // TODO: Encapsulate run/stop/victory button behavior (Entity?)
  ui.runButton.addEventListener('click', onClickRunButton)
  ui.stopButton.addEventListener('click', onClickRunButton)
  ui.tryAgainButton.addEventListener('click', onClickRunButton)
  ui.victoryStopButton.addEventListener('click', onClickRunButton)

  function onClickShowAllButton(event) {
    me.world.navigator.showAll = !me.world.navigator.showAll
  }

  ui.showAllButton.addEventListener('click', onClickShowAllButton)

  function onClickEditButton(event) {
    me.world.editing = !me.world.editing
  }

  ui.editButton.addEventListener('click', onClickEditButton)

  function onClickResetButton(event) {
    me.world.onClickResetButton()
  }

  ui.resetButton.addEventListener('click', onClickResetButton)

  function onResizeWindow(event) {
    me.world.sendEvent('resize', [window.innerWidth, window.innerHeight])
    me.screen.resize()
    me.requestDraw()
  }

  window.addEventListener('resize', onResizeWindow)

  function onClickCanvas() {
    if (me.debugStepping) {
      me.tick()
    }
  }

  me.canvas.addEventListener('click', onClickCanvas)
  ui.veil.addEventListener('click', onClickCanvas)

  function onMouseMoveCanvas(event) {
    me.world.clickableContext.processEvent(event, 'mouseMove')
    event.preventDefault()
  }

  me.canvas.addEventListener('mousemove', onMouseMoveCanvas)
  me.canvas.addEventListener('pointermove', onMouseMoveCanvas)

  function onMouseDownCanvas(event) {
    me.world.clickableContext.processEvent(event, 'mouseDown')
    event.preventDefault()
    ui.mathField.blur()
  }

  canvas.addEventListener('mousedown', onMouseDownCanvas)
  canvas.addEventListener('pointerdown', onMouseDownCanvas)

  function onMouseUpCanvas(event) {
    me.world.clickableContext.processEvent(event, 'mouseUp')
    event.preventDefault()
  }

  canvas.addEventListener('mouseup', onMouseUpCanvas)
  canvas.addEventListener('pointerup', onMouseUpCanvas)

  ui.levelInfoDiv.addEventListener('mouseover', function () {
    console.log('mouseover')
    ui.hideLevelInfoButton.setAttribute('hide', false)
  })

  ui.levelInfoDiv.addEventListener('mouseleave', function () {
    console.log('mouseleave')
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
