let _assets, darkenBuffer, darkenBufferScreen, water, hg

function Level(spec) {
  const {
    self,
    assets,
    screen,
    ui,
  } = Entity(spec, 'Level')

  _assets = assets

  const {
    globalScope,
    levelCompleted,
    datum,
    isBubbleLevel,
    sunsetQuad,
    waterQuad,
    storage,
    savedLatex,
    world,
  } = spec

  let {
    colors = Colors.biomes.alps,
    defaultExpression,
    hint = '',
    openMusic,
    runMusic,
    flashMathField = false,
    flashRunButton = false,
    camera: cameraSpec = {}
  } = datum

  const sledders = []
  const walkers = []
  const goals = []
  const texts = []
  const sprites = []
  const speech = []
  const directors = []
  const bubbles = []
  const sounds = []
  
  let lowestOrder = 'A'
  let highestOrder = 'A'

  if (flashMathField)
    ui.expressionEnvelope.classList.add('flash-shadow')
  else
    ui.expressionEnvelope.classList.remove('flash-shadow')

  if (flashRunButton)
    ui.runButton.classList.add('flash-shadow')
  else
    ui.runButton.classList.remove('flash-shadow')

  let currentLatex

  const trackedEntities = [speech, sledders, walkers, goals]

  // TODO: Fix hint text. Mathquill broke it
  // ui.mathField.setAttribute('placeholder', hint)

  openMusic = _.get(assets, openMusic, null)
  runMusic = _.get(assets, runMusic, null)

  let hasBeenRun = false

  camera = Camera({
    globalScope,
    parent: self,
    ...cameraSpec,
  })

  let axes = null
  if (!datum.hasOwnProperty('axesEnabled') || datum.axesEnabled)
    axes = Axes({
      drawOrder: LAYERS.axes,
      camera,
      globalScope,
      parent: self,
    })

  trackedEntities.unshift(axes)

  let darkBufferOrScreen = screen
  let darkenBufferOpacity = 0.0

  if (isConstantLakeAndNotBubble()) {
    // Credit for screen buffer business logic to LevelBubble.js by @cwalker
    darkenBuffer = ScreenBuffer({
      parent: self,
      screen,
      drawOrder: LAYERS.lighting,
      postProcess: (ctx, width, height) => {
        // Darken screen
        ctx.globalCompositeOperation = 'source-atop'
        ctx.fillStyle = `rgba(1.0, 0.5, 0, ${darkenBufferOpacity})`
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'source-over'
      }
    })

    darkenBufferScreen = Screen({
      canvas: darkenBuffer.canvas,
    })

    darkBufferOrScreen = darkenBufferScreen
  }

  const startingExpression = (!isConstantLakeAndNotBubble() ? savedLatex : null) ?? defaultExpression
  console.log('Starting expression', startingExpression)

  const graph = Graph({
    camera,
    screen: darkBufferOrScreen,
    globalScope,
    expression: mathquillToMathJS(startingExpression),
    parent: self,
    drawOrder: LAYERS.graph,
    colors,
    sledders,
  })

  let shader = null // Only loaded for Constant Lake

  let completed = false

  let skyColors = colors.sky

  if (_.isString(skyColors))
    skyColors = [[0, skyColors]]

  let skyGradient = screen.ctx.createLinearGradient(0, 0, 0, 1)

  for (const color of skyColors)
    skyGradient.addColorStop(color[0], color[1])

  loadDatum(spec.datum)

  let defaultVectorExpression = '\\frac{(\\sin(x) - (y - 2) \\cdot i) \\cdot i}{2}'
  if (isConstantLakeAndNotBubble() && savedLatex) {
    walkerPositionX = VECTOR_FIELD_END_X
    defaultVectorExpression = savedLatex
  }

  function isEditor() {
    return datum.nick == 'LEVEL_EDITOR'
  }

  function awake() {
    refreshLowestOrder()

    // Add a variable to globalScope for player position
    globalScope.p = math.complex()
    assignPlayerPosition()

    editor.active = isEditor()
    
    if (isConstantLakeAndNotBubble()) {
      // HACK: Enable run button for Walker scene
      ui.runButton.setAttribute('hide', true)
      ui.stopButton.setAttribute('hide', false)

      // Hide reset until vector field
      ui.resetButton.setAttribute('hide', true)

      // Change editor to vector field and hide until
      // star field comes out
      ui.expressionEnvelope.classList.add('hidden')
      ui.mathFieldLabel.innerText = 'V='

      ui.mathField.latex(defaultVectorExpression)
      ui.mathFieldStatic.latex(defaultVectorExpression)
    } else {
      // Otherwise display editor normally as graph editor
      ui.expressionEnvelope.classList.remove('hidden')
      ui.mathFieldLabel.innerText = 'Y='

      ui.mathField.latex(startingExpression)
      ui.mathFieldStatic.latex(startingExpression)
    }
  }

  function start() {
  }

  function startLate() {
    // self.sendEvent('levelFullyStarted')
  }

  function tick() {
    let time = isConstantLake()
      ? walkers[0].transform.position.x.toFixed(1)
      : (Math.round(globalScope.t*10)/10).toString()

    if ((globalScope.running || isConstantLake()) && !_.includes(time, '.'))
      time += '.0'

    // ui.timeString.innerHTML = 'T='+time
    ui.runButtonString.innerHTML = 'T='+time
    ui.stopButtonString.innerHTML = 'T='+time

    assignPlayerPosition()
  }

  function draw() {
    if (isConstantLake() &&
        walkers[0] &&
        walkers[0].transform.position) {
      const x = walkers[0].transform.position.x

      drawConstantLakeEditor(x)
      darkenBufferOpacity = Math.min(0.9, Math.pow(x / 20, 2))

      const walkerDarkenOpacity = Math.pow(darkenBufferOpacity, 5)

      for (const walker of walkers) {
        walker.darkModeOpacity = walkerDarkenOpacity

        for (const w of walker.walkers) {
          if (w.hasDarkMode)
            w.darkModeOpacity = walkerDarkenOpacity
        }
      }
    }

    screen.ctx.save()
    screen.ctx.scale(1, screen.height)
    screen.ctx.fillStyle = skyGradient
    
    datum.sky ? 0 : screen.ctx.fillRect(0, 0, screen.width, screen.height)
    screen.ctx.restore()
  }

  function assignPlayerPosition() {
    const playerEntity = walkers.length > 0 ?
      walkers[0] : sledders.length > 0 ?
      sledders[0] : axes

    globalScope.p.re = playerEntity.transform.position.x
    globalScope.p.im = playerEntity.transform.position.y
  }

  function trackDescendants(entity, array=trackedEntities) {
    _.each(entity.children, v => {
      array.push(v)
      trackDescendants(v, array)
    })
  }

  function addGoal(goalDatum) {
    const generator = {
      'path': PathGoal,
      'fixed': FixedGoal,
      'dynamic': DynamicGoal,
    }[goalDatum.type || 'fixed']

    const goal = generator({
      name: 'Goal '+goals.length,
      parent: self,
      camera,
      graph,
      assets,
      sledders,
      globalScope,
      drawOrder: LAYERS.goals,
      goalCompleted,
      goalFailed,
      getLowestOrder: () => lowestOrder,
      world,
      ...goalDatum
    })

    goals.push(goal)
  }

  function addDirector(directorDatum) {
    const generator = {
      'tracking': TrackingDirector,
      'waypoint': WaypointDirector,
      'lerp': LerpDirector,
      // 'drag': DragDirector,
    }[directorDatum.type || 'tracking']

    const director = generator({
      parent: self,
      camera,
      graph,
      globalScope,
      trackedEntities,
      ...directorDatum
    })

    directors.push(director)
  }
  
  function addTextBubbles(bubbleDatum) {
    bubbles.push(
      TextBubble({
        parent:self,
        camera,
        graph,
        globalScope,
        visible: false,
        place: 'top-right',
        ...bubbleDatum
      })
    )
  }

  function addWalker(walkerDatum) {
    const walker = Walker({
      name: 'Walker ' + walkers.length,
      parent: self,
      camera,
      graph,
      globalScope,
      levelCompleted: () => {
        // for (sound of sounds)
          // sound.howl.volume(0)

        levelCompleted(true)
      },
      screen: darkBufferOrScreen,
      speechScreen: screen,
      drawOrder: LAYERS.walkers,
      hasDarkMode: isConstantLake(),
      ...walkerDatum
    })

    walkers.push(walker)

    trackDescendants(walker)
  }

  function addSledder(sledderDatum) {
    const sledder = Sledder({
      name: 'Sledder '+sledders.length,
      parent: self,
      camera,
      graph,
      globalScope,
      screen: darkBufferOrScreen,
      drawOrder: LAYERS.sledders,
      speechScreen: screen,
      ...sledderDatum,
    })

    sledders.push(sledder)

    trackDescendants(sledder, speech)
  }

  function addSound(soundDatum) {
    const sound = Sound({
      name: 'Sound ' + soundDatum.asset,
      parent: self,
      walkers,
      ...soundDatum,
    })

    sounds.push(sound)
  }

  function addSprite(spriteDatum) {
    const sprite = Sprite({
      name: 'Sprite '+sprites.length,
      parent: self,
      camera,
      graph,
      globalScope,
      drawOrder: LAYERS.backSprites,
      anchored: true,
      screen: darkBufferOrScreen,
      speechScreen: screen,
      ...spriteDatum,
    })

    sprites.push(sprite)
  }

  function addText(textDatum) {
    const text = Text({
      name: 'Text '+texts.length,
      parent: self,
      camera,
      globalScope,
      drawOrder: LAYERS.text,
      ...textDatum,
    })

    texts.push(text)
  }

  function goalCompleted(goal) {
    if (!completed) {
      refreshLowestOrder()

      let levelComplete = true

      for (goal of goals) {
        if (!goal.completed) {
          levelComplete = false
          break
        }
      }

      assets.sounds.goal_success.play()

      if (levelComplete) {
        completed = true
        levelCompleted()
        assets.sounds.level_success.play()
      }
    }
  }

  // Serialize to
  //  1. Store completed levels
  //  2. Share solutions
  //  3. Share custom levels

  function serialize() {
    return {
      v: 0.1, // TODO: change version handling to World?
      nick: datum.nick,
      savedLatex: currentLatex,
      goals: isEditor()
        ? goals.map(g => {
          s = {
            type: g.type,
            x: g.transform.x,
            y: g.transform.y,
            order: g.order,
          }
          return s
        })
        : null
    }
  }

  function goalFailed(goal) {
    if (goal.order) {
      for (g of goals) {
        if (g.order && !g.completed)
          g.fail()
      }
    }

    assets.sounds.goal_fail.play()
  }

  function playOpenMusic() {
    if (openMusic)
      openMusic.play()
  }

  function reset() {
    stopRunning()
  }

  function restart() {
    console.log('resetting level')

    const expression = isConstantLake() ? defaultVectorExpression : defaultExpression

    ui.mathField.latex(expression)

    self.sendEvent('setGraphExpression', [ mathquillToMathJS(expression), expression ])

    refreshLowestOrder()
  }

  function refreshLowestOrder() {
    lowestOrder = 'Z'
    for (goal of goals) {
      if (!goal.completed && goal.order < lowestOrder) {
        lowestOrder = goal.order
      }
    }

    _.invokeEach(goals, 'refresh')
  }

  function startRunning() {
    ui.runButton.classList.remove('flash-shadow')

    ui.mathFieldStatic.latex(currentLatex)

    if (!hasBeenRun) {
      if (runMusic)
        runMusic.play()

      hasBeenRun = true
    }
  }

  function stopRunning() {
    _.invokeEach(goals, 'reset')
    _.invokeEach(bubbles, 'toggleVisible')
    completed = false
    refreshLowestOrder()
  }

  function isConstantLake() {
    return datum.name === 'Constant Lake'
  }

  function isConstantLakeAndNotBubble() {
    return isConstantLake() && !isBubbleLevel
  }

  let isVectorEditorActive = false

  const showUIAnimation = {
    keyframes: [
      { transform: 'translateY(calc(100% + 20px))', opacity: '0' },
      { transform: 'translateY(0px)', opacity: '1' },
      // { opacity: '0' },
      // { opacity: '1' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
      fill: 'forwards',
    }
  }

  const hideUIAnimation = {
    keyframes: [
      { transform: 'translateY(0px)', opacity: '1' },
      { transform: 'translateY(calc(100% + 20px))', opacity: '0' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
    }
  }

  const VECTOR_FIELD_START_X = 13.5
  const VECTOR_FIELD_END_X = 17.5

  function drawConstantLakeEditor(walkerPositionX) {
    if (walkerPositionX > VECTOR_FIELD_END_X) {
      if (!isVectorEditorActive) {
        isVectorEditorActive = true

        ui.resetButton.setAttribute('hide', false)
        ui.expressionEnvelope.classList.remove('hidden')

        ui.expressionEnvelope.animate(showUIAnimation.keyframes, showUIAnimation.options)
        ui.resetButton.animate(showUIAnimation.keyframes, showUIAnimation.options)
      }
    } else if (walkerPositionX < VECTOR_FIELD_START_X && isVectorEditorActive) {
      isVectorEditorActive = false

      const resetButtonAnimation = ui.resetButton.animate(hideUIAnimation.keyframes, hideUIAnimation.options)
      const expressionEnvelopeAnimation = ui.expressionEnvelope.animate(hideUIAnimation.keyframes, hideUIAnimation.options)

      resetButtonAnimation.onfinish = () => ui.resetButton.setAttribute('hide', true)
      expressionEnvelopeAnimation.onfinish = () => ui.expressionEnvelope.classList.add('hidden')
    }
  }

  function loadDatum(datum) {
    if (!isBubbleLevel)
      _.each(datum.sounds, addSound)
    _.each(datum.sprites, addSprite)
    _.each(datum.walkers, addWalker)
    _.each(datum.sledders, addSledder)
    _.each(datum.goals, addGoal)
    _.each(datum.texts, addText)
    _.each(datum.directors || [{}], addDirector)
    isBubbleLevel || _.each(datum.textBubbles || [], addTextBubbles)

    if (isBubbleLevel && datum.bubble) {
      datum = _.merge(_.cloneDeep(datum), datum.bubble)
    }

    if (datum.clouds) 
      CloudRow({
        parent:self,
        camera,
        globalScope,
        velocity: datum.clouds.velocity,
        heights: datum.clouds.heights,
        drawOrder: LAYERS.clouds,
        screen: darkBufferOrScreen,
        ...datum.clouds,
      })
    // Constant Lake sunset scene
    if (isConstantLakeAndNotBubble()) {
      console.log('loading shader')
      shader = Shader({
        parent: self,
        screen,
        assets,
        sunsetQuad,
        drawOrder: LAYERS.sky,
        defaultExpression: '(sin(x)-(y-2)*i)*i/2',
        walkerPosition: walkers[0].transform.position,
      })
    } else {
      shader = null
    }
    if (datum.water && !isBubbleLevel) {
      water = Water({
        parent: self,
        camera,
        waterQuad,
        screen: darkBufferOrScreen,
        globalScope,
        drawOrder: LAYERS.backSprites,
        ...datum.water,
      })
    }
    if (datum.sky) {
      Sky({
        parent: self,
        camera,
        globalScope,
        asset: datum.sky.asset,
        margin: datum.sky.margin,
        screen: darkBufferOrScreen,
        drawOrder: LAYERS.background,
        ...datum.sky,
      })
    }
    if (datum.snow) 
      SnowFall({
        parent:self,
        camera,
        globalScope,
        screen,
        density: datum.snow.density,
        velocityX: datum.snow.velocity.x,
        velocityY: datum.snow.velocity.y,
        maxHeight: datum.snow.maxHeight,
        drawOrder: LAYERS.snow,
        screen: darkBufferOrScreen,
        ...datum.snow,
      })

    if (datum.slider && !isBubbleLevel) {
      hg = HintGraph({
        ui,
        parent: self,
        camera,
        screen,
        globalScope,
        drawOrder: LAYERS.hintGraph,
        slider: datum.slider,
      })
    }

    self.sortChildren()
  }
  
  function save() {
    // Save to player storage and to URI
    storage.setLevel(datum.nick, serialize())
    history.pushState(null, null, '?' + LZString.compressToBase64(JSON.stringify(serialize())))
  }

  function setGraphExpression(text, latex) {
    if (editor.editingPath) {
      console.log('returning')
      return
    }

    ui.mathFieldStatic.latex(latex)

    currentLatex = latex

    save()

    if (isConstantLakeAndNotBubble()) {
      shader.setVectorFieldExpression(text)
      return
    }

    graph.expression = text
    ui.expressionEnvelope.setAttribute('valid', graph.valid)

    _.invokeEach(sledders, 'reset')
    _.invokeEach(goals, 'reset')
  }

  function mathFieldFocused() {
    ui.expressionEnvelope.classList.remove('flash-shadow')
  }

  function destroy() {
    if (isConstantLake()) {
      // Undo run/stop button swap
      ui.runButton.setAttribute('hide', false)
      ui.stopButton.setAttribute('hide', true)
    }
    _.invokeEach(bubbles, 'destroy')
  }

  function resize() {
    darkBufferOrScreen.resize()
    graph.resize()
  }

  function removeGoal(type) {

  }

  // TODO: Refactor?
  let goalLookup = {}

  function goalAdded(type) {
    addGoal({
      type,
    })
    goalLookup[goals[goals.length - 1].id] = goals.length - 1
    console.log('goal lookup', goalLookup)
  }

  // Takes in entity -- refactor?
  function goalDeleted(goal) {
    goals.splice(goals.findIndex(g => g.id == goal.id), 1)
  }

  return self.mix({
    awake,
    start,
    destroy,
    
    tick,
    draw,

    resize,

    serialize,

    startRunning,
    stopRunning,

    setGraphExpression,

    camera,
    graph,
    
    restart,
    reset,

    playOpenMusic,

    mathFieldFocused,

    isConstantLake,

    goalAdded,
    goalDeleted,

    save,

    goals,

    get currentLatex() {return currentLatex},

    get datum() {return spec.datum},
    get completed() {return completed},
  })
}