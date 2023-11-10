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
    quads,
    darkenable,
    tryToLoadAssets = true,
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
    graphType = 'cartesian',
    minTheta = 0,
    maxTheta = TAU,
    invertGravity = false,
  } = datum

  let completed = false
  let hasBeenCompleted = spec.hasBeenCompleted ?? false

  const levelCompleted = (soft = false) => {
    hasBeenCompleted = true
    spec.levelCompleted(soft)
  }

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

  let lava, volcanoSunset, sky, clouds, snow

  let usingTInExpression = false

  if (!isBubbleLevel) {
    if (flashMathField) ui.expressionEnvelope.classList.add('flash-shadow')
    else ui.expressionEnvelope.classList.remove('flash-shadow')

    if (flashRunButton) ui.runButton.classList.add('flash-shadow')
    else ui.runButton.classList.remove('flash-shadow')
  }

  let currentLatex = defaultExpression

  const trackedEntities = [speech, sledders, walkers, goals]

  // TODO: Fix hint text. Mathquill broke it
  // ui.mathField.setAttribute('placeholder', hint)

  assets.sounds.level_success.volume(0.5)
  assets.sounds.goal_success.volume(0.5)
  assets.sounds.goal_fail.volume(0.5)

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

  // Gridlines and corresponding coordinate bubble
  const gridlines = Gridlines({
    drawOrder: LAYERS.gridlines,
    camera,
    globalScope,
    parent: self,
    domSelector: '#body',
  })
  const coordinateBox = CoordinateBox({
    drawOrder: LAYERS.gridlines,
    camera,
    globalScope,
    parent: self,
    content: '0, 0',
    domSelector: '#reset-button',
    style: { ...self.style, visibility: 'hidden' },
  })

  disableGridlines()

  let darkenBufferOrScreen, darkenBuffer

  // HACK: Collect entities created (only) in Level
  // in buffer which can then be darkened (ConstantLake)
  if (spec.useDarkenBuffer) {
    darkenBuffer = ScreenBuffer({
      parent: self,
      drawOrder: LAYERS.lighting,
      screen,
      postProcess: (ctx, width, height, params) => {
        ctx.globalCompositeOperation = 'source-atop'
        ctx.fillStyle = `rgba(1.0, 0.5, 0, ${params.darkenOpacity})`
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'source-over'
      },
      parameters: {
        darkenOpacity: 0.5,
      },
    })
    darkenBufferOrScreen = Screen({
      canvas: darkenBuffer.canvas,
    })
  } else {
    darkenBufferOrScreen = screen
  }

  const startingExpression =
    spec.startingExpression ?? getStartingGraphExpression()

  let polar
  if (graphType === 'polar') polar = true
  else if (graphType === 'cartesian') polar = false
  else throw `Unexpected graphType '${graphType}', expected polar/cartesian`

  const graph = Graph({
    camera,
    screen: darkenBufferOrScreen,
    globalScope,
    expression: mathquillToMathJS(startingExpression),
    parent: self,
    drawOrder: LAYERS.graph,
    colors,
    sledders,
    useInterpolation: false,
    polar,
    minTheta,
    maxTheta,
    invertGravity,
  })

  let skyColors = colors.sky

  if (_.isString(skyColors)) skyColors = [[0, skyColors]]

  let skyGradient = screen.ctx.createLinearGradient(0, 0, 0, 1)

  for (const color of skyColors) skyGradient.addColorStop(color[0], color[1])

  function preprocessDatum(datum) {
    // Reuse datum across levels/bubbles
    if (datum._preprocessed) return

    // Add biome defaults + required assets
    const biomeName = datum.biome ?? 'westernSlopes'
    const biome = BIOMES[biomeName]
    _.defaults(datum, biome)
    if (biome.assets) _.merge(datum.assets, biome.assets)

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

  function initMathEditor() {
    /* By default, make math editor display the graph */
    ui.expressionEnvelope.setAttribute('disabled', false)
    ui.expressionEnvelope.classList.remove('hidden')
    ui.mathFieldLabel.innerText = `${graph.label}=`

    ui.mathField.latex(startingExpression)
    ui.mathFieldStatic.latex(startingExpression)
  }

  function awake() {
    /* Initialization tasks that can be done
    without assets */

    // Can be overridden, use self.
    self.initMathEditor()

    // For puzzles, enable stop button
    ui.stopButton.classList.remove('disabled')

    /* Load assets */
    if (tryToLoadAssets) {
      self.active = false

      // Load assets
      assets.load(datum.assets, () => {
        self.active = true
        awakeWithAssets()
      })
    } else {
      awakeWithAssets()
    }
  }

  function awakeWithAssets() {
    console.log('Finished loading assets')

    loadDatum(spec.datum)

    // Allow for overload from subclass
    self.awakeWithAssetsAndDatum()
  }

  function awakeWithAssetsAndDatum() {
    refreshLowestOrder()

    // Add a variable to globalScope for player position
    globalScope.p = math.complex()
    assignPlayerPosition()

    if (playBackgroundMusic) playBackgroundMusic(datum.backgroundMusic, self)
  }

  function start() {}

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

  function getStartingGraphExpression() {
    const isPuzzle = urlData?.isPuzzle ?? false
    if (isPuzzle) {
      return urlData?.expressionOverride
        ? urlData?.expressionOverride
        : defaultExpression
    }
    return savedLatex ?? defaultExpression
  }

  function getTime() {
    return globalScope.t
  }

  function tick() {
    _.each(walkers, checkTransition)
    _.each(sledders, checkTransition)

    if (
      datum.victoryX != null &&
      self.getCutsceneX &&
      self.getCutsceneX() > datum.victoryX
    ) {
      completed = true
      levelCompleted(true)
    }

    // Can be overridden (self.)
    let time = self.getTime().toFixed(1)
    if (time === '0.0') time = '0'

    // ui.timeString.innerHTML = 't='+time
    ui.runButtonString.innerHTML = 't=' + time
    ui.stopButtonString.innerHTML = 't=' + time

    assignPlayerPosition()
  }

  function assignPlayerPosition() {
    const playerEntity =
      walkers.length > 0 ? walkers[0] : sledders.length > 0 ? sledders[0] : axes

    // TODO: assignPlayerPosition() shouldn't exist,
    // as it abuses globalScope

    if (playerEntity) {
      globalScope.p.re = playerEntity.transform.position.x
      globalScope.p.im = playerEntity.transform.position.y
    }
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
      invertGravity,
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
      screen: darkenBufferOrScreen,
      speechScreen: screen,
      drawOrder: LAYERS.walkers,
      hasDarkMode: darkenable,
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
      screen: darkenBufferOrScreen,
      drawOrder: LAYERS.sledders,
      speechScreen: screen,
      motionBlur: false,
      invertGravity,
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
      screen: darkenBufferOrScreen,
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

  function getDefaultExpression() {
    return defaultExpression
  }

  function restart() {
    // Can be overridden, use self.
    const expression = self.getDefaultExpression()

    // setGraphExpression() only updates static
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

  function setSky(skyDatum) {
    if (sky) sky.destroy()
    if (skyDatum)
      sky = Sky({
        parent: self,
        camera,
        globalScope,
        asset: skyDatum.asset,
        margin: skyDatum.margin,
        screen: darkenBufferOrScreen,
        drawOrder: LAYERS.background,
        motionBlur: false,
        ...skyDatum,
      })
  }

  function setSnow(snowDatum) {
    if (snow) snow.destroy()
    if (snowDatum)
      snow = Snow({
        parent: self,
        camera,
        globalScope,
        screen,
        density: snowDatum.density,
        velocityX: snowDatum.velocity.x,
        velocityY: snowDatum.velocity.y,
        maxHeight: snowDatum.maxHeight,
        drawOrder: LAYERS.snow,
        screen: darkenBufferOrScreen,
        ...snowDatum,
      })
  }

  function setClouds(cloudDatum) {
    if (clouds) clouds.destroy()
    if (cloudDatum)
      clouds = Clouds({
        parent: self,
        camera,
        globalScope,
        assets,
        velocity: cloudDatum.velocity,
        heights: cloudDatum.heights,
        drawOrder: LAYERS.clouds,
        screen: darkenBufferOrScreen,
        ...cloudDatum,
      })
  }

  function loadDatum(datum) {
    if (datum.sky) setSky(datum.sky)

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

    if (datum.clouds) setClouds(datum.clouds)
    if (datum.water && !isBubbleLevel) {
      // Water({
      //   parent: self,
      //   camera,
      //   waterQuad: quads.water,
      //   screen: darkenBufferOrScreen,
      //   globalScope,
      //   drawOrder: LAYERS.backSprites,
      //   ...datum.water,
      // })
    }
    if (datum.lava && !isBubbleLevel) {
      lava = Water({
        parent: self,
        camera,
        // TODO: Clean up
        lava: true,
        screen: darkenBufferOrScreen,
        globalScope,
        drawOrder: LAYERS.backSprites,
        ...datum.lava,
      })
    }
    if (datum.snow) setSnow(datum.snow)
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
    // Do not write to URL if this is a bubble level
    if (isBubbleLevel) return

    // Save to player storage and to URI
    const serialized = self.serialize() // Overridden
    storage.setLevel(datum.nick, serialized)
    history.pushState(
      null,
      null,
      '?' + LZString.compressToBase64(JSON.stringify(serialized)),
    )
  }

  function tVariableChanged(newT) {
    globalScope.customT = newT
    if (graph.resample) graph.resample()
    _.invokeEach(goals, 'reset')
    _.invokeEach(sledders, 'reset')
  }

  // Tightly-couple Level superclass to PathGoal
  // to ignore graph updates while editing goal
  // TODO: Fix this
  let editingPath

  function selectedPathGoalForEditing() {
    console.log('Selected path goal for editing')
    editingPath = true
  }

  function unselectedPathGoalForEditing() {
    console.log('Unselected path goal for editing')
    editingPath = false
  }

  function setGraphExpression(text, latex) {
    if (editingPath) return

    ui.mathFieldStatic.latex(latex)

    currentLatex = latex

    save()

    usingTInExpression = false
    try {
      math.parse(text).traverse((node) => {
        if (node.name == 't' || node.args?.some((arg) => arg.name == 't')) {
          usingTInExpression = true
          throw '' // HACK: Throw exception for early return
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

  // TODO: Figure out how gridlines enable/disable logic
  // should be organized, along with UI generally
  function disableGridlines() {
    gridlines.active = false
    coordinateBox.visible = false
  }

  function enableGridlines() {
    // TODO: Implement special gridline behavior for editor
    gridlines.active = true
    coordinateBox.visible = true
  }

  function onMouseDown() {
    if (!world.running) enableGridlines()
  }

  function onMouseUp() {
    disableGridlines()
  }

  function selectScreenCoordinates(screenX, screenY) {
    // TODO: Creating a vector every call? Anti-pattern?
    const worldPoint = Vector2(screenX, screenY)
    camera.screenToWorld(worldPoint)
    coordinateBox.selectCoordinates(
      screenX,
      screenY,
      worldPoint.x,
      worldPoint.y,
    )
    gridlines.updatePosition(worldPoint.x, worldPoint.y)
  }

  function destroy() {
    _.invokeEach(tips, 'destroy')
  }

  function resize() {
    darkenBufferOrScreen.resize()
    graph.resize()
  }

  function setBiome(biome) {
    // Sky
    setSky(biome.sky)

    // Snow, clouds
    setSnow(biome.snow)
    setClouds(biome.clouds)

    // Music
    if (playBackgroundMusic) playBackgroundMusic(biome.backgroundMusic, self)

    // Graph colors
    graph.assignColors(biome.colors)
  }

  return self.mix({
    awake,
    awakeWithAssetsAndDatum,
    start,
    destroy,

    setBiome,

    addGoal,

    tick,
    draw,

    resize,

    serialize,

    startRunning,
    stopRunning,

    setGraphExpression,

    selectedPathGoalForEditing,
    unselectedPathGoalForEditing,

    camera,
    graph,

    restart,
    reset,

    save,

    playOpenMusic,

    mathFieldFocused,

    gridlines,
    coordinateBox,

    enableGridlines,
    disableGridlines,
    selectScreenCoordinates,

    get datum() {
      return datum
    },

    get isRunningAsCutscene() {
      return runAsCutscene
    },

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

    sledders,
    walkers,

    get graph() {
      return graph
    },

    // TODO: temp
    trackedEntities,

    tVariableChanged,
    sky,
    lava,

    levelCompleted,

    getDefaultExpression,
    initMathEditor,

    getTime,

    onMouseDown,
    onMouseUp,

    loadDatum,

    addSledder,

    get darkenBuffer() {
      if (!spec.useDarkenBuffer) {
        throw `Tried to access non-existent darken buffer in Level`
      }

      return darkenBuffer
    },
  })
}
