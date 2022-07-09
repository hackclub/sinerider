function Level(spec) {
  const {
    self,
    assets,
    screen,
    ui,
  } = Entity(spec, 'Level')

  const {
    globalScope,
    levelCompleted,
    datum,
    isBubbleLevel,
    quad,
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

  const axes = Axes({
    drawOrder: -5,
    camera,
    globalScope,
    parent: self,
  })

  trackedEntities.unshift(axes)

  const graph = Graph({
    camera,
    globalScope,
    expression: defaultExpression,
    parent: self,
    drawOrder: 100,
    colors,
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

  function awake() {
    refreshLowestOrder()

    // Add a variable to globalScope for player position
    globalScope.p = math.complex()
    assignPlayerPosition()

    ui.mathField.latex(defaultExpression)
    ui.mathFieldStatic.latex(defaultExpression)
  }

  function start() {
  }

  function startLate() {
    // self.sendEvent('levelFullyStarted')
  }

  function tick() {
    let time = (Math.round(globalScope.t*10)/10).toString()

    if (globalScope.running && !_.includes(time, '.'))
      time += '.0'

    // ui.timeString.innerHTML = 'T='+time
    ui.runButtonString.innerHTML = 'T='+time
    ui.stopButtonString.innerHTML = 'T='+time

    assignPlayerPosition()
  }

  function draw() {
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
      drawOrder: 110,
      goalCompleted,
      goalFailed,
      getLowestOrder: () => lowestOrder,
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
        visible:false,
        place:"top-right",
        ...bubbleDatum
      })
    )
  }

  function addWalker(walkerDatum) {
    const walker = Walker({
      name: 'Walker '+walkers.length,
      parent: self,
      camera,
      graph,
      globalScope,
      drawOrder: 1,
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
      drawOrder: 10,
      ...sledderDatum,
    })

    sledders.push(sledder)

    trackDescendants(sledder, speech)
  }

  function addSprite(spriteDatum) {
    const sprite = Sprite({
      name: 'Sprite '+sprites.length,
      parent: self,
      camera,
      graph,
      globalScope,
      drawOrder: -1,
      anchored: true,
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
      drawOrder: 105,
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
    ui.mathField.latex(defaultExpression)
    // self.sendEvent('setGraphExpression', [defaultExpression, defaultExpression])
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

  function loadDatum(datum) {
    _.each(datum.sprites, addSprite)
    _.each(datum.walkers, addWalker)
    _.each(datum.sledders, addSledder)
    _.each(datum.goals, addGoal)
    _.each(datum.texts, addText)
    _.each(datum.directors || [{}], addDirector)
    isBubbleLevel || _.each(datum.textBubbles || [], addTextBubbles)
    if (datum.clouds) 
      CloudRow({
        parent:self,
        camera,
        globalScope,
        velocity: datum.clouds.velocity,
        heights: datum.clouds.heights,
        drawOrder: 50,
        ...datum.clouds,
      })
    // Constant Lake sunset scene
    if (datum.name === 'Constant Lake') {
      console.log('loaded shader', datum)
      shader = Shader({
        parent: self,
        screen,
        assets,
        quad,
        drawOrder: -100000,
      })
      setTimeout(() => {
        ui.vectorMathField.latex('x + y \\cdot i')
        ui.vectorMathContainer.style.display = 'block'
      }, 4000)
    } else {
      shader = null
      ui.vectorMathContainer.style.display = 'none'
    }
    if (datum.sky) 
      Sky({
        parent:self,
        camera,
        globalScope,
        asset:datum.sky.asset,
        margin: datum.sky.margin,
        screen,
        drawOrder:-10,
        ...datum.sky,
      })
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
        drawOrder: 20,
        ...datum.snow,
      })

    if (datum.slider && !isBubbleLevel) {

      const dottedGraph = Graph({
        camera,
        globalScope,
        expression: datum.slider.expression.replace("n", "0"),
        parent: self,
        drawOrder: 1,
        strokeWidth: 0.1,
        strokeColor: 'rgb(0,255,0)',
        dashed: true,
        scaleStroke: true,
        dashSettings: [0.5, 0.5],
        fill: false,
      })

      function setSliderExpression(text) {
        dottedGraph.expression = mathquillToMathJS(text)
    
        ui.dottedMathFieldStatic.latex(text)
      }
      ui.dottedSlider.hidden = false;
      ui.dottedSlider.oninput = e => {
        let val = (ui.dottedSlider.value)/100
        let exp = datum.slider.expression.replace("n", (val*(datum.slider.bounds[1] - datum.slider.bounds[0]) +datum.slider.bounds[0]).toFixed(1))
        exp = exp.replaceAll("+ -", "-")
        exp = exp.replaceAll("- +", "-")
        setSliderExpression(exp)
      }
      ui.dottedSlider.value = 100*((datum.slider.bounds[2] - datum.slider.bounds[0])/(datum.slider.bounds[1] - datum.slider.bounds[0]))
      setSliderExpression(datum.slider.expression.replace("n", datum.slider.bounds[2]).replaceAll("+ -", "-").replaceAll("- +", "-"))
    }
    self.sortChildren()
  }

  function setVectorExpression(text, latex) {
    if (shader != null)
      shader.setVectorFieldExpression(text)
  }

  function setGraphExpression(text, latex) {
    currentLatex = latex

    graph.expression = text
    ui.expressionEnvelope.setAttribute('valid', graph.valid)

    console.log('latex', latex)
    ui.mathFieldStatic.latex(latex)

    _.invokeEach(sledders, 'reset')
    _.invokeEach(goals, 'reset')
  }

  function mathFieldFocused() {
    ui.expressionEnvelope.classList.remove('flash-shadow')
  }

  function destroy() {
    _.invokeEach(bubbles, "destroy")

    ui.dottedMathFieldStatic.latex("")
    ui.dottedSlider.hidden = "true"
  }
  
  return self.mix({
    awake,
    start,
    destroy,
    
    tick,
    draw,

    startRunning,
    stopRunning,

    setGraphExpression,
    setVectorExpression,

    camera,
    graph,
    
    reset,

    playOpenMusic,

    mathFieldFocused,

    get datum() {return spec.datum},
    get completed() {return completed},
  })
}