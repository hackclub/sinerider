/**
 * Base class representing a level scene with
 * a graph, camera/director(s) and walkers/sledders/sprites/text.
 * Can be started, stopped, reset, serialized and takes in a levelCompleted
 * callback which is invoked whenever the level's completion condition is met.
 */
function Level(spec) {
  const { self, assets, screen, ui, world } = Entity(spec, spec.datum.nick)

  const {
    globalScope,
    isBubbleLevel,
    datum,
    storage,
    urlData,
    savedLatex,
    playBackgroundMusic,
  } = spec

  preprocessDatum(datum)

  let {
    colors = Colors.biomes.alps,
    defaultExpression,
    hint = '',
    openMusic,
    runMusic,
    flashMathField = false,
    flashRunButton = false,
    runAsCutscene = false,
    camera: cameraSpec = {},
    victoryX = null,
  } = datum

  let completed = false
  let hasBeenCompleted = spec.hasBeenCompleted ?? false

  const levelCompleted = (soft = false) => {
    hasBeenCompleted = true
    spec.levelCompleted(soft)
  }

  const quads = globalScope.quads

  const sledders = []
  const walkers = []
  const goals = []
  const texts = []
  const sprites = []
  const speech = []
  const directors = []
  const tips = []
  const sounds = []

  let lowestOrder = 'A'
  let highestOrder = 'A'

  let lava, volcanoSunset, sky
  let CoordinateBox1 = null

  let usingTInExpression = false

  assets.sounds.level_success.volume(0.5)
  assets.sounds.goal_success.volume(0.5)
  assets.sounds.goal_fail.volume(0.5)

  if (!isBubbleLevel) {
    if (flashMathField) ui.expressionEnvelope.classList.add('flash-shadow')
    else ui.expressionEnvelope.classList.remove('flash-shadow')

    if (flashRunButton) ui.runButton.classList.add('flash-shadow')
    else ui.runButton.classList.remove('flash-shadow')
  }

  let currentLatex

  const trackedEntities = [speech, sledders, walkers, goals]

  // TODO: Fix hint text. Mathquill broke it
  // ui.mathField.setAttribute('placeholder', hint)

  openMusic = _.get(assets, openMusic, null)
  runMusic = _.get(assets, runMusic, null)

  let hasBeenRun = false

  let camera = Camera({
    globalScope,
    parent: self,
    ...cameraSpec,
  })

  // axesEnabled can be specified in datum or overridden in spec (LevelBubbles)
  let axes = null
  let axesEnabled = spec.hasOwnProperty('axesEnabled')
    ? spec.axesEnabled
    : datum.hasOwnProperty('axesEnabled')
    ? datum.axesEnabled
    : true

  if (axesEnabled)
    axes = Axes({
      drawOrder: LAYERS.axes,
      camera,
      globalScope,
      parent: self,
    })

  if (axes) trackedEntities.unshift(axes)

  function setCoordinates(x, y) {
    Point = Vector2(x, y)
    NewPoint = Vector2(x, y)
    camera.screenToWorld(NewPoint)

    if (gridlines.getactive()) {
      gridlines.setActiveTrue(NewPoint.x, NewPoint.y)
      CoordinateBox1.visibletrue()
    }
    CoordinateBox1.refreshDOM(NewPoint.x, NewPoint.y, Point.x, Point.y)
  }

  let gridlines = null
  gridlines = Gridlines({
    drawOrder: LAYERS.gridlines,
    camera,
    globalScope,
    parent: self,
    domSelector: '#body',
  })
  CoordinateBox1 = CoordinateBox({
    drawOrder: LAYERS.gridlines,
    camera,
    globalScope,
    parent: self,
    content: '0, 0',
    domSelector: '#reset-button',
    place: 'top-right',
    style: { ...self.style, visibility: 'hidden' },
  })
  let darkBufferOrScreen = screen
  let darkenBufferOpacity = 0.0
  let darkenBuffer, darkenBufferScreen

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
      },
    })

    darkenBufferScreen = Screen({
      canvas: darkenBuffer.canvas,
    })

    darkBufferOrScreen = darkenBufferScreen
  }

  const startingExpression = getStartingExpression()

  const graph = Graph({
    camera,
    screen: darkBufferOrScreen,
    globalScope,
    expression: mathquillToMathJS(startingExpression),
    parent: self,
    drawOrder: LAYERS.graph,
    colors,
    sledders,
    useInterpolation: false,
  })

  let shader = null // Only loaded for Constant Lake

  let skyColors = colors.sky

  if (_.isString(skyColors)) skyColors = [[0, skyColors]]

  let skyGradient = screen.ctx.createLinearGradient(0, 0, 0, 1)

  for (const color of skyColors) skyGradient.addColorStop(color[0], color[1])

  loadDatum(spec.datum)

  let defaultVectorExpression =
    '\\frac{(\\sin (x)-(y-2)\\cdot i)\\cdot i}{2}+\\frac{x}{4}+\\frac{y\\cdot i}{5}'
  let vectorExpression = defaultVectorExpression

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
    },
  }

  const hideUIAnimation = {
    keyframes: [
      { transform: 'translateY(0px)', opacity: '1' },
      { transform: 'translateY(calc(100% + 20px))', opacity: '0' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
    },
  }

  const VECTOR_FIELD_START_X = 13.5
  const VECTOR_FIELD_END_X = 17.5

  if (isConstantLakeAndNotBubble() && savedLatex) {
    walkerPositionX = VECTOR_FIELD_END_X
    defaultVectorExpression = savedLatex
  }

  function preprocessDatum(datum) {
    // Reuse datum across levels/bubbles
    if (datum._preprocessed) return

    // Add biome defaults
    if (datum.biome) _.defaults(datum, BIOMES[datum.biome])

    // Expand `dialogue` array to individual speech objects
    const dialogue = datum.dialogue
    const walkers = datum.walkers ?? []
    const allWalkers = [
      ...walkers,
      ..._.flatten(
        walkers.map((v) =>
          _.isArray(v.walkers)
            ? v.walkers
            : _.isObject(v.walkers)
            ? [v.walkers]
            : [],
        ),
      ),
    ]

    if (dialogue) {
      for (const line of dialogue) {
        if (!line.speaker) {
          throw new Error(
            `Line of dialogue '${line.content}' has no speaker specified in level '${datum.name}'`,
          )
        }
        const speaker = allWalkers.find((walker) => walker.name == line.speaker)
        if (!speaker) {
          throw new Error(
            `Tried to add line of dialogue for unknown speaker '${line.speaker}' in level '${datum.name}'`,
          )
        }

        // Add default length and gap values
        if (_.isUndefined(line.domain)) {
          if (_.isUndefined(line.length)) line.length = 3
          if (_.isUndefined(line.gap)) line.gap = 2
        }

        // Add default positions
        if (line.speaker == 'Ada') {
          if (_.isUndefined(line.x)) line.x = 0
          if (_.isUndefined(line.y)) line.y = 0.7
        } else if (line.speaker == 'Jack') {
          if (_.isUndefined(line.x)) line.x = 0
          if (_.isUndefined(line.y)) line.y = 0.8
        }

        if (!speaker.speech) speaker.speech = []
        speaker.speech.push(line)
      }

      let previous = null

      for (const line of dialogue) {
        if (line.length) {
          if (line.domain) {
            throw new Error(
              `Tried to set length of line of dialogue in level '${datum.name}' with existing domain`,
            )
          }

          // Hard-coded assumption that the speaker we care about is the first one.
          // We only support a single top-level walker anyway…
          const speaker = walkers[0]

          // By default start at speaker x
          const endOfLastLine =
            (previous && previous.domain && previous.domain[1]) || speaker.x
          const start = endOfLastLine + line.gap
          const domain = [start, start + line.length]
          line.domain = domain
        }

        previous = line
      }
    }

    // Also split up processed speech bubbles with \n
    for (const walker of walkers) {
      if (!walker.speech) continue

      const newLines = []
      const removeIndices = []

      for (let i = 0; i < walker.speech.length; i++) {
        const speech = walker.speech[i]
        const content = speech.content
        if (!content) continue
        let lines = content.split('\n')
        if (lines.length > 0) {
          removeIndices.push(i)
          let previous = null
          for (let line of lines) {
            const newSpeech = _.cloneDeep(speech)
            newSpeech.content = line
            newSpeech.distance =
              ((previous && previous.distance) || lines.length * 0.4 + 1.1) -
              0.4
            if (!newSpeech.content)
              console.log(
                'adding new lines',
                newLines.filter((line) => line.content == null),
                newSpeech,
              )
            newLines.push(newSpeech)
            previous = newSpeech
          }
        }
      }

      for (let i = removeIndices.length; i--; i >= 0) {
        walker.speech.splice(removeIndices[i], 1)
      }

      walker.speech = walker.speech.concat(newLines)
    }

    datum._preprocessed = true
  }

  function isEditor() {
    return datum.nick == 'LEVEL_EDITOR'
  }

  function awake() {
    refreshLowestOrder()

    // Add a variable to globalScope for player position
    globalScope.p = math.complex()
    assignPlayerPosition()

    if (playBackgroundMusic) playBackgroundMusic(datum.backgroundMusic, self)

    if (runAsCutscene && !isBubbleLevel) {
      // Don't play sound, keep navigator
      world._startRunning(false, false, !isConstantLakeAndNotBubble()) // Keep editor enabled for Constant Lake

      // Hide math field by default
      ui.expressionEnvelope.classList.add('hidden')
    }

    editor.active = isEditor()

    // For constant lake, change math field to vector
    // field editor for later in the scene
    if (isConstantLakeAndNotBubble()) {
      ui.mathFieldLabel.innerText = 'V='

      ui.mathField.latex(defaultVectorExpression)
      ui.mathFieldStatic.latex(defaultVectorExpression)
    } else if (!runAsCutscene && !isBubbleLevel) {
      // Otherwise display editor normally as graph editor
      ui.expressionEnvelope.classList.remove('hidden')
      ui.mathFieldLabel.innerText = 'Y='

      ui.mathField.latex(startingExpression)
      ui.mathFieldStatic.latex(startingExpression)
    }
    if (runAsCutscene) {
      ui.stopButton.classList.add('disabled')
    }
    if (!runAsCutscene) {
      ui.stopButton.classList.remove('disabled')
    }
  }

  function start() {}

  function startLate() {
    // self.sendEvent('levelFullyStarted')
  }

  function checkTransition(entity) {
    if (!entity.activeInHierarchy) return

    const transition = entity.transition
    if (transition) {
      // If X values met then make transition
      if (transition.xRequirements.length == 0) {
        const target = self.children.find((s) => s.name === transition.name)

        if (!target)
          throw Error(
            `Unable to find transition target from '${entity.name}' to '${transition.name}' (check the manifest!)`,
          )
        target.active = true
        entity.active = false

        if (entity.walkers) entity.walkers.forEach((w) => (w.active = false))
        if (target.walkers) target.walkers.forEach((w) => (w.active = true))

        const x = entity.transform.x

        target.transform.x = x
      }
      // Otherwise check if current target met, if so then pop
      else {
        if (Math.abs(transition.xRequirements[0] - entity.transform.x) < 1) {
          transition.xRequirements.splice(0, 1)
        }
      }
    }
  }

  function getStartingExpression() {
    let isPuzzle = urlData?.isPuzzle ?? false
    if (isPuzzle) {
      return urlData?.expressionOverride
        ? urlData?.expressionOverride
        : defaultExpression
    }
    return (
      (!isConstantLakeAndNotBubble() ? savedLatex : null) ?? defaultExpression
    )
  }

  function getCutsceneDistanceParameter() {
    let playerEntity =
      walkers.find((s) => s.active) || sledders.find((w) => w.active)
    if (!playerEntity)
      throw "Couldn't find a player entity for cutscene distance parameter"
    return playerEntity?.transform.x
  }

  function tick() {
    // screen.ctx.filter = `blur(${Math.floor(world.level.sledders[0].rigidbody.velocity/40 * 4)}px)`
    let time = runAsCutscene
      ? getCutsceneDistanceParameter().toFixed(1)
      : (Math.round(globalScope.t * 10) / 10).toString()

    // LakeSunsetShader
    // VolcanoShader
    // VolcanoSunsetShader

    if ((globalScope.running || runAsCutscene) && !_.includes(time, '.'))
      time += '.0'

    // console.log('tracked entities', trackedEntities)

    for (const walker of walkers) {
      checkTransition(walker)
    }
    for (const sledder of sledders) {
      checkTransition(sledder)
    }

    if (victoryX != null && !completed) {
      if (getCutsceneDistanceParameter() > victoryX) {
        completed = true
        levelCompleted(true)
      }
    }

    // ui.timeString.innerHTML = 't='+time
    ui.runButtonString.innerHTML = 't=' + time
    ui.stopButtonString.innerHTML = 't=' + time

    assignPlayerPosition()

    if (isVolcano() && !isBubbleLevel) {
      let sunsetTime
      const x = sledders[0]?.transform.x
      sunsetTime = x ? Math.exp(-(((x - 205) / 100) ** 2)) : 0
      globalScope.timescale = 1 - sunsetTime * 0.7
      camera.shake = sunsetTime > 0.1 ? sunsetTime * 0.3 : 0
      const vel = sledders[0]?.velocity ?? 20
      const motionBlur = Math.min((vel / 40) * 4, 10)

      volcanoSunset.blur = motionBlur
      sky.blur = motionBlur
      graph.blur = motionBlur
      lava.blur = motionBlur
    }
  }

  function draw() {
    if (isConstantLake() && walkers[0] && walkers[0].transform.position) {
      const x = walkers[0].transform.position.x

      drawConstantLakeEditor(x)
      darkenBufferOpacity = Math.min(0.9, Math.pow(Math.max(0, x) / 20, 2))

      const walkerDarkenOpacity = Math.pow(darkenBufferOpacity, 5)

      for (const walker of walkers) {
        walker.darkModeOpacity = walkerDarkenOpacity

        for (const w of walker.walkers) {
          if (w.hasDarkMode) w.darkModeOpacity = walkerDarkenOpacity
        }
      }
    }
  }

  function assignPlayerPosition() {
    const playerEntity =
      walkers.length > 0 ? walkers[0] : sledders.length > 0 ? sledders[0] : axes

    globalScope.p.re = playerEntity.transform.position.x
    globalScope.p.im = playerEntity.transform.position.y
  }

  function trackDescendants(entity, array = trackedEntities) {
    _.each(entity.children, (v) => {
      array.push(v)
      trackDescendants(v, array)
    })
  }

  function addGoal(goalDatum) {
    const generator = {
      path: PathGoal,
      fixed: FixedGoal,
      dynamic: DynamicGoal,
    }[goalDatum.type || 'fixed']

    const goal = generator({
      name: 'Goal ' + goals.length,
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
      ...goalDatum,
    })

    goals.push(goal)
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

  function tipCompleted() {
    // Movves index of all tips down by one
    for (i = 0; i < tips.length; i++) {
      datum.tips[i].index -= 1
      tips[i].refreshDOM()
    }
  }

  function addTip(tipDatum) {
    tips.push(
      Tip({
        parent: self,
        camera,
        graph,
        tipCompleted,
        globalScope,
        visible: false,
        place: 'top-right',
        ...tipDatum,
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

    // trackDescendants(walker)
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

    // trackDescendants(sledder, speech)
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
      sky,
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
        save()
      }
    }
  }

  // Serialize to
  //  1. Store completed levels
  //  2. Share solutions
  //  3. Share custom levels

  function serialize() {
    if (urlData?.isPuzzle) {
      return serializePuzzle()
    }
    const json = {
      v: 0.1, // TODO: change version handling to World?
      nick: datum.nick,
      completed: hasBeenCompleted,
      savedLatex: isConstantLakeAndNotBubble()
        ? vectorExpression
        : currentLatex,
      goals: isEditor()
        ? goals.map((g) => {
            s = {
              type: g.type,
              x: g.transform.x,
              y: g.transform.y,
              order: g.order,
            }
            return s
          })
        : null,
    }
    if (isConstantLakeAndNotBubble()) {
      json.t = globalScope.t
    }
    return json
  }

  // Puzzles are completely serializable using the url data
  function serializePuzzle() {
    urlData.expressionOverride = currentLatex
    return urlData
  }

  function goalFailed(goal) {
    if (goal.order) {
      for (g of goals) {
        if (g.order && !g.completed) g.fail()
      }
    }

    assets.sounds.goal_fail.play()

    // Show try again button in place of reset button
    ui.tryAgainButton.setAttribute('hide', false)
    ui.stopButton.setAttribute('hide', true)
  }

  function playOpenMusic() {
    if (openMusic) openMusic.play()
  }

  function reset() {
    stopRunning()
  }

  function restart() {
    const expression = isConstantLake()
      ? defaultVectorExpression
      : defaultExpression

    ui.mathField.latex(expression)

    self.sendEvent('setGraphExpression', [
      mathquillToMathJS(expression),
      expression,
    ])

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

    ui.tSliderContainer.setAttribute('hide', true)

    if (usingTInExpression) {
      if (graph.resample) graph.resample()
      _.invokeEach(goals, 'reset')
      _.invokeEach(sledders, 'reset')
    }

    if (!hasBeenRun) {
      if (runMusic) runMusic.play()

      hasBeenRun = true
    }
  }

  function stopRunning() {
    _.invokeEach(goals, 'reset')
    _.invokeEach(tips, 'toggleVisible')
    if (usingTInExpression) ui.tSliderContainer.setAttribute('hide', false)
    completed = false
    refreshLowestOrder()
  }

  function isVolcano() {
    return datum.name === 'Volcano'
  }

  function isConstantLake() {
    return datum.name === 'Constant Lake'
  }

  function isConstantLakeAndNotBubble() {
    return isConstantLake() && !isBubbleLevel
  }

  function drawConstantLakeEditor(walkerPositionX) {
    if (walkerPositionX > VECTOR_FIELD_END_X) {
      if (!isVectorEditorActive) {
        isVectorEditorActive = true

        ui.resetButton.setAttribute('hide', false)
        ui.expressionEnvelope.classList.remove('hidden')

        ui.expressionEnvelope.animate(
          showUIAnimation.keyframes,
          showUIAnimation.options,
        )
        ui.resetButton.animate(
          showUIAnimation.keyframes,
          showUIAnimation.options,
        )
      }
    } else if (walkerPositionX < VECTOR_FIELD_START_X && isVectorEditorActive) {
      isVectorEditorActive = false

      const resetButtonAnimation = ui.resetButton.animate(
        hideUIAnimation.keyframes,
        hideUIAnimation.options,
      )
      const expressionEnvelopeAnimation = ui.expressionEnvelope.animate(
        hideUIAnimation.keyframes,
        hideUIAnimation.options,
      )

      resetButtonAnimation.onfinish = () =>
        ui.resetButton.setAttribute('hide', true)
      expressionEnvelopeAnimation.onfinish = () =>
        ui.expressionEnvelope.classList.add('hidden')
    }
  }

  function mergeData(source, out) {
    for (const [key, value] of Object.entries(source)) {
      if (_.isObject(value)) {
        let tmp = {}
        mergeData(value, tmp)
        out[key] = tmp
      } else {
        out[key] = value
      }
    }
  }

  function loadDatum(datum) {
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

    if (!isBubbleLevel) _.each(datum.sounds, addSound)
    _.each(datum.sprites, addSprite)
    _.each(datum.sledders, addSledder)
    _.each(datum.walkers, addWalker)
    _.each(datum.goals, addGoal)
    _.each(datum.texts, addText)
    _.each(datum.directors || [{}], addDirector)
    isBubbleLevel || _.each(datum.tips || [], addTip)

    if (urlData && urlData.t) {
      globalScope.runTime = urlData.t
    }

    if (isBubbleLevel && datum.bubble) {
      // console.log(datum)
      datum = {
        ...datum,
        ...datum.bubble,
      }
    }

    if (!isBubbleLevel && isVolcano()) {
      LavaMonster({
        parent: self,
        world,
        screen,
        assets,
        drawOrder: LAYERS.backSprites - 1,
        camera,
        globalScope,
      })
      // PostProcessing({
      //   parent: self,
      //   screen,
      //   drawOrder: LAYERS.volcanoPostProcessing,
      //   process: ctx => {
      //     blur = Math.floor(Math.min(sledders[0].rigidbody.velocity.magnitude/40 * 4, 10))
      //     ctx.filter = `blur(${blur}px)`
      //   }
      // })
      volcanoSunset = VolcanoSunsetShader({
        parent: self,
        screen,
        assets,
        quad: quads.volcanoSunset,
        drawOrder: LAYERS.sky,
        sledders,
      })
      // sledders.forEach(s => s.drawOrder = 10000)
    }

    if (datum.clouds)
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
    // Constant Lake sunset scene
    if (isConstantLakeAndNotBubble()) {
      ConstantLakeShader({
        parent: self,
        screen,
        assets,
        quad: quads.sunset,
        drawOrder: LAYERS.sky,
        walkerPosition: walkers[0].transform.position,
      })
    }
    if (datum.water && !isBubbleLevel) {
      Water({
        parent: self,
        camera,
        waterQuad: quads.water,
        screen: darkBufferOrScreen,
        globalScope,
        drawOrder: LAYERS.backSprites,
        ...datum.water,
      })
    }
    if (datum.lava && !isBubbleLevel) {
      lava = Water({
        parent: self,
        camera,
        waterQuad: quads.lava,
        screen: darkBufferOrScreen,
        globalScope,
        drawOrder: LAYERS.backSprites,
        ...datum.lava,
      })
    }
    if (datum.snow)
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

    self.sortChildren()
  }

  function save() {
    // Do not write to URL if debug level is set or if this is a bubble level
    if (DEBUG_LEVEL || isBubbleLevel) return

    // Save to player storage and to URI
    storage.setLevel(datum.nick, serialize())
    history.pushState(
      null,
      null,
      '?' + LZString.compressToBase64(JSON.stringify(serialize())),
    )
  }

  function tVariableChanged(newT) {
    globalScope.customT = newT
    if (graph.resample) graph.resample()
    _.invokeEach(goals, 'reset')
    _.invokeEach(sledders, 'reset')
  }

  function setGraphExpression(text, latex) {
    if (editor.editingPath) {
      // console.log('returning')
      return
    }

    ui.mathFieldStatic.latex(latex)

    currentLatex = latex

    save()

    if (isConstantLakeAndNotBubble()) {
      vectorExpression = latex
      quads.sunset.setVectorFieldExpression(text)
      return
    }

    usingTInExpression = false
    try {
      math.parse(text).traverse((node) => {
        if (node.name == 't' || node.args?.some((arg) => arg.name == 't')) {
          usingTInExpression = true
          throw '' // Throw exception for janky early return
        }
      })
    } catch {}

    ui.tSliderContainer.setAttribute('hide', !usingTInExpression)

    graph.expression = text
    ui.expressionEnvelope.setAttribute('valid', graph.valid)

    if (!graph.valid) {
      ui.expressionEnvelope.classList.add('invalid-exp')
    } else {
      ui.expressionEnvelope.classList.remove('invalid-exp')
    }

    _.invokeEach(sledders, 'reset')
    _.invokeEach(goals, 'reset')
  }

  function mathFieldFocused() {
    ui.expressionEnvelope.classList.remove('flash-shadow')
  }

  function disableGridlines() {
    gridlines.setActiveFalse()
    CoordinateBox1.visiblefalse()
  }
  function enableGridlines() {
    if (!world.running) {
      gridlines.setActiveTrue(CoordinateBox1.getx(), CoordinateBox1.gety())
      CoordinateBox1.visibletrue()
    }
  }

  function destroy() {
    if (runAsCutscene && !isBubbleLevel) {
      world._stopRunning()
    }
    _.invokeEach(tips, 'destroy')
  }

  function resize() {
    darkBufferOrScreen.resize()
    graph.resize()
  }

  function removeGoal(type) {}

  // TODO: Refactor?
  let goalLookup = {}

  function goalAdded(type) {
    addGoal({
      type,
    })
    goalLookup[goals[goals.length - 1].id] = goals.length - 1
  }

  // Takes in entity -- refactor?
  function goalDeleted(goal) {
    goals.splice(
      goals.findIndex((g) => g.id == goal.id),
      1,
    )
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

    setCoordinates,

    camera,
    graph,

    restart,
    reset,

    get cutsceneDistanceParameter() {
      return getCutsceneDistanceParameter()
    },

    playOpenMusic,

    mathFieldFocused,

    enableGridlines,
    disableGridlines,

    get isRunningAsCutscene() {
      return runAsCutscene
    },

    goalAdded,
    goalDeleted,

    save,

    goals,

    get currentLatex() {
      return currentLatex
    },

    get datum() {
      return spec.datum
    },
    get completed() {
      return completed
    },
    get nick() {
      return datum.nick
    },

    isEditor,
    sledders,
    walkers,

    // TODO: temp
    trackedEntities,

    get firstWalkerX() {
      return walkers[0]?.transform.x
    },

    tVariableChanged,
  })
}
