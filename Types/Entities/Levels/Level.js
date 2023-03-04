function Level(spec, defaultName = 'Level') {
  const { self, assets, screen, ui } = Entity(spec, defaultName)

  const {
    globalScope,
    levelCompleted,
    defaultExpression,
    datum,
    world,
    requestDraw,
    isBubbleLevel,
  } = spec

  let {
    colors = Colors.biomes.alps,
    hint = '',
    openMusic,
    runMusic,
    camera: cameraSpec = {},
  } = datum

  const sledders = []
  const walkers = []
  const texts = []
  const sprites = []
  const speech = []
  const directors = []
  const bubbles = []
  const sounds = []

  const trackedEntities = [speech, sledders, walkers]

  function trackEntities(entities) {
    trackedEntities.unshift(entities)
  }

  const camera = Camera({
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

  if (axes) trackedEntities.unshift(axes)

  openMusic = _.get(assets, openMusic, null)
  runMusic = _.get(assets, runMusic, null)

  const graph = Graph({
    camera,
    screen,
    globalScope,
    expression: mathquillToMathJS(defaultExpression),
    parent: self,
    drawOrder: LAYERS.graph,
    colors,
    sledders,
  })

  let completed = false

  loadDatum(datum)

  function awake() {
    assignPlayerPosition()
  }

  function start() {}

  function tick() {
    assignPlayerPosition()
  }

  function draw() {}

  function trackDescendants(entity, array = trackedEntities) {
    _.each(entity.children, (v) => {
      array.push(v)
      trackDescendants(v, array)
    })
  }

  function addDirector(directorDatum) {
    const generator = {
      tracking: TrackingDirector,
      waypoint: WaypointDirector,
      lerp: LerpDirector,
      // 'drag': DragDirector,
    }[directorDatum.type || 'tracking']

    const director = generator({
      parent: self,
      camera,
      graph,
      globalScope,
      trackedEntities,
      ...directorDatum,
    })

    directors.push(director)
  }

  function addTextBubbles(bubbleDatum) {
    bubbles.push(
      TextBubble({
        parent: self,
        camera,
        graph,
        globalScope,
        visible: false,
        place: 'top-right',
        ...bubbleDatum,
      }),
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
      ...walkerDatum,
    })

    walkers.push(walker)

    trackDescendants(walker)
  }

  function addSledder(sledderDatum) {
    const sledder = Sledder({
      name: 'Sledder ' + sledders.length,
      parent: self,
      camera,
      graph,
      globalScope,
      screen: darkBufferOrScreen,
      drawOrder: LAYERS.sledders,
      speechScreen: screen,
      motionBlur: false,
      ...sledderDatum,
    })

    sledders.push(sledder)

    trackDescendants(sledder, speech)
  }

  function addSound(soundDatum) {
    const sound = Sound({
      name: 'Sound ' + soundDatum.asset,
      parent: self,
      level: self,
      walkers,
      sledders,
      ...soundDatum,
    })

    sounds.push(sound)
  }

  function addSprite(spriteDatum) {
    const sprite = Sprite({
      name: 'Sprite ' + sprites.length,
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
      name: 'Text ' + texts.length,
      parent: self,
      camera,
      globalScope,
      drawOrder: LAYERS.text,
      ...textDatum,
    })

    texts.push(text)
  }

  function assignPlayerPosition() {
    const playerEntity =
      walkers.length > 0 ? walkers[0] : sledders.length > 0 ? sledders[0] : axes

    globalScope.p.re = playerEntity.transform.position.x
    globalScope.p.im = playerEntity.transform.position.y
  }

  function serialize() {
    return {
      v: 0.1,
      nick: datum.nick,
    }
  }

  function playOpenMusic() {
    if (openMusic) openMusic.play()
  }

  function stopRunning(playSound = true, navigating = false) {
    running = false

    _.invokeEach(bubbles, 'toggleVisible')
    completed = false

    runTime = 0

    ui.mathField.blur()
    ui.expressionEnvelope.setAttribute('disabled', false)
    ui.menuBar.setAttribute('hide', false)
    ui.victoryBar.setAttribute('hide', true)

    ui.controlBar.setAttribute('hide', navigating)
    ui.navigatorButton.setAttribute('hide', false)
    ui.runButton.setAttribute('hide', false)
    ui.tryAgainButton.setAttribute('hide', true)
    ui.stopButton.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', false)

    if (!navigating) {
      // HACK: Timed to avoid bug in Safari (at least) that causes whole page to be permanently offset when off-screen text input is focused
      setTimeout(() => ui.expressionText.focus(), 250)
    }

    if (playSound) assets.sounds.stop_running.play()

    self.sendEvent('stopRunning', [])

    requestDraw()
  }

  function startRunning(playSound = true, hideNavigator = true) {
    running = true

    ui.runButton.classList.remove('flash-shadow')

    ui.mathFieldStatic.latex(currentLatex)

    if (!hasBeenRun) {
      if (runMusic) runMusic.play()

      hasBeenRun = true
    }

    ui.mathField.blur()
    ui.expressionEnvelope.setAttribute('disabled', true)
    ui.menuBar.setAttribute('hide', true)

    ui.runButton.setAttribute('hide', true)
    ui.stopButton.setAttribute('hide', false)
    if (hideNavigator) ui.navigatorButton.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', true)
    ui.tryAgainButton.setAttribute('hide', true)

    if (playSound) assets.sounds.start_running.play()

    self.sendEvent('startRunning', [])

    requestDraw()
  }

  function toggleRunning() {
    if (running) stopRunning()
    else stopRunning()
  }

  function loadDatum(datum) {
    if (!isBubbleLevel) _.each(datum.sounds, addSound)
    _.each(datum.sprites, addSprite)
    _.each(datum.sledders, addSledder)
    _.each(datum.walkers, addWalker)
    _.each(datum.texts, addText)
    _.each(datum.directors || [{}], addDirector)

    if (isBubbleLevel && datum.bubble) {
      datum = _.merge(_.cloneDeep(datum), datum.bubble)
    }

    if (datum.clouds) {
      Clouds({
        parent: self,
        camera,
        globalScope,
        assets,
        velocity: datum.clouds.velocity,
        heights: datum.clouds.heights,
        drawOrder: LAYERS.clouds,
        screen: darkBufferOrScreen,
        ...datum.clouds,
      })
    }

    if (datum.sky) {
      sky = Sky({
        parent: self,
        camera,
        globalScope,
        asset: datum.sky.asset,
        margin: datum.sky.margin,
        screen: darkBufferOrScreen,
        drawOrder: LAYERS.background,
        motionBlur: false,
        ...datum.sky,
      })
    }

    if (datum.snow) {
      Snow({
        parent: self,
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
    }

    if (datum.slider && !isBubbleLevel) {
      HintGraph({
        ui,
        parent: self,
        camera,
        screen,
        globalScope,
        drawOrder: LAYERS.hintGraph,
        slider: datum.slider,
      })
    }
  }

  function resize() {
    screen.resize()
    graph.resize()
  }

  function restart() {
    ui.mathField.latex(defaultExpression)

    self.sendEvent('setGraphExpression', [
      mathquillToMathJS(defaultExpression),
      defaultExpression,
    ])
  }

  return self.mix({
    awake,
    start,
    destroy,
    tick,
    draw,

    startRunning,
    stopRunning,
    toggleRunning,

    resize,
    serialize,
    restart,
    reset,
    playOpenMusic,
    mathFieldFocused,
    loadDatum,
    save,
    camera,
    get currentLatex() {},
    get completed() {},
    get sky() {
      return sky
    },

    trackEntities,

    playOpenMusic,
  })

  return self.mix({
    // Entity
    awake,
    start,
    destroy,
    tick,
    draw,

    // Level
    resize,
    serialize,
    deserialize,
    restart,
    reset,
    playOpenMusic,
    mathFieldFocused,
    loadDatum,
    save,
    camera,
    get currentLatex() {},
    get completed() {},

    // Puzzle
    goalAdded,
    goalDeleted,
    goals,
    startRunning,
    stopRunning,

    // Cutscene
    get progress() {}, // 0-1

    // Handled individually
    graph,
  })

  /*
    A level:
      - camera
      - completed 


  */
}
