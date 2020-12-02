function Level(spec) {
  const {
    self,
    assets,
    screen,
  } = Entity(spec, 'Level')
  
  const {
    globalScope,
    levelCompleted,
    useDragCamera = true,
    datum,
  } = spec
  
  let {
    colors = Colors.biomes.alps,
    defaultExpression,
    hint = '',
    openMusic,
    runMusic,
    camera = {
      type: 'track',
      padding: 3
    },
  } = datum
  
  const sledders = []
  const goals = []
  const texts = []
  const sprites = []
  const speech = []
  
  let lowestOrder = 'A'
  let highestOrder = 'A'
  
  const trackedEntities = [speech, sledders, goals]
  
  ui.expressionText.setAttribute('placeholder', hint)
  
  openMusic = _.get(assets, openMusic, null)
  runMusic = _.get(assets, runMusic, null)
  
  let hasBeenRun = false
  
  let cameraSpec
  if (camera.type == 'track' || true) {
    cameraSpec = {
      controllers: [
        CameraTracker, {trackedEntities, minFovMargin: camera.padding || 3},
        CameraWaypointer,
      ]
    }
  }
  else {
    cameraSpec = camera
  }
  
  camera = Camera({
    globalScope,
    parent: self,
    ...cameraSpec,
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
  
  for (color of skyColors)
    skyGradient.addColorStop(color[0], color[1])
    
  loadDatum(spec.datum)
  
  function awake() {
    refreshLowestOrder()
  }
  
  function start() {
    
  }
  
  function tick() {
    let time = (Math.round(globalScope.t*10)/10).toString()
    
    if (globalScope.running && !_.includes(time, '.'))
      time += '.0'
    
    // ui.timeString.innerHTML = 'T='+time
    ui.runButtonString.innerHTML = 'T='+time
    ui.stopButtonString.innerHTML = 'T='+time
  }
  
  function draw() {
    screen.ctx.save()
    screen.ctx.scale(1, screen.height)
    screen.ctx.fillStyle = skyGradient
    screen.ctx.fillRect(0, 0, screen.width, screen.height)
    screen.ctx.restore()
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
  
  function addSledder(sledderDatum) {
    const sledder = Sledder({
      name: 'Sledder '+sledders.length,
      parent: self,
      camera,
      graph,
      globalScope,
      ...sledderDatum
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
      ...spriteDatum
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
      
      for (goal of goals) {
        if (!goal.completed) {
          return
        }
      }
      
      completed = true
      levelCompleted()
    }
  }
  
  function goalFailed(goal) {
    console.log('Failed :(')
    
    if (goal.order) {
      for (g of goals) {
        if (g.order && !g.completed)
          g.fail()
      }
    }
  }
  
  function playOpenMusic() {
    if (openMusic)
      openMusic.play()
  }
  
  function reset() {
    ui.expressionText.value = defaultExpression
    setGraphExpression(defaultExpression)
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
    _.each(datum.sledders, addSledder)
    _.each(datum.goals, addGoal)
    _.each(datum.texts, addText)
    self.sortChildren()
  }
  
  function setGraphExpression(text) {
    graph.expression = ui.expressionText.value
    _.invokeEach(sledders, 'reset')
    _.invokeEach(goals, 'reset')
    
    camera.snap()
  }
  
  return self.mix({
    awake,
    
    tick,
    draw,
    
    startRunning,
    stopRunning,
    
    setGraphExpression,

    camera,
    
    reset,
    
    playOpenMusic,
    
    get datum() {return spec.datum},
    get completed() {return completed},
  })
}