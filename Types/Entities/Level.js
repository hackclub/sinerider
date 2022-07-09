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
  } = spec

  let {
    colors = Colors.biomes.alps,
    defaultExpression,
    hint = '',
    openMusic,
    runMusic,
    flashMathField = false,
    flashRunButton = false,
  } = datum

  const sledders = []
  const walkers = []
  const goals = []
  const texts = []
  const sprites = []
  const speech = []
  const directors = []

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
  })

  const axes = Axes({
    drawOrder: -2,
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
    drawOrder: 0,
    colors,
  })

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
    screen.ctx.fillRect(0, 0, screen.width, screen.height)
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
      drawOrder: 1,
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

  function addWalker(walkerDatum) {
    const walker = Walker({
      name: 'Walker '+walkers.length,
      parent: self,
      camera,
      graph,
      globalScope,
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
      drawOrder: 2,
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

    self.sortChildren()
  }

  function setGraphExpression(text, latex) {
    currentLatex = latex

    graph.expression = text
    ui.expressionEnvelope.setAttribute('valid', graph.valid)

    ui.mathFieldStatic.latex(latex)

    _.invokeEach(sledders, 'reset')
    _.invokeEach(goals, 'reset')
  }

  function mathFieldFocused() {
    ui.expressionEnvelope.classList.remove('flash-shadow')
  }

  return self.mix({
    awake,
    start,

    tick,
    draw,

    startRunning,
    stopRunning,

    setGraphExpression,

    camera,

    reset,

    playOpenMusic,

    mathFieldFocused,

    get datum() {return spec.datum},
    get completed() {return completed},
  })
}