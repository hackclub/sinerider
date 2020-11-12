function Level(spec) {
  const self = Entity(spec, 'Level')
  
  const {
    screen,
    globalScope,
    levelCompleted,
    useDragCamera = true,
    datum,
  } = spec
  
  const {
    colors = Colors.biomes.basic,
    defaultExpression,
  } = datum
  
  const sledders = []
  const goals = []
  const texts = []
  
  let lowestOrder = 'A'
  let highestOrder = 'A'
  
  const trackedEntities = [sledders, goals]
  
  const camera = Camera({
    screen,
    globalScope,
    parent: self,
    controllers: [
      // CameraDragger,
      CameraTracker, {trackedEntities},
      CameraWaypointer,
    ]
  })
  
  const axes = Axes({
    screen,
    camera,
    globalScope,
    parent: self,
  })
  
  trackedEntities.unshift(axes)
  
  const graph = Graph({
    screen,
    camera,
    globalScope,
    expression: defaultExpression,
    parent: self,
    colors,
  })
  
  self.children.push(sledders, goals, texts)
  
  let completed = false
  
  let skyColors = colors.sky
  
  if (_.isString(skyColors))
    skyColors = [[0, skyColors]]
  
  let skyGradient = screen.ctx.createLinearGradient(0, 0, 0, 1)
  
  for (color of skyColors)
    skyGradient.addColorStop(color[0], color[1])
  
  function awake() {
    refreshLowestOrder()
  }
  
  function tick() {
    // _.invokeEach(entities, 'tick', tickArgs)
  }
  
  function draw() {
    screen.ctx.save()
    screen.ctx.scale(1, screen.height)
    screen.ctx.fillStyle = skyGradient
    screen.ctx.fillRect(0, 0, screen.width, screen.height)
    screen.ctx.restore()
    // _.invokeEach(entities, 'draw', drawArgs)
  }
  
  function addGoal(goalDatum) {
    const goal = Goal({
      screen,
      camera,
      graph,
      sledders,
      globalScope,
      goalCompleted,
      goalFailed,
      getLowestOrder: () => lowestOrder,
      ...goalDatum
    })
    
    goals.push(goal)
  }
  
  function addSledder(sledderDatum) {
    const sledder = Sledder({
      screen,
      camera,
      graph,
      globalScope,
      ...sledderDatum
    })
    
    sledders.push(sledder)
  }
  
  function addText(textDatum) {
    const text = Text({
      screen,
      camera,
      globalScope,
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
  
  function stopRunning() {
    _.invokeEach(goals, 'reset')
    
    completed = false
    refreshLowestOrder()
  }
  
  function loadDatum(datum) {
    _.each(datum.sledders, addSledder)
    _.each(datum.goals, addGoal)
    _.each(datum.texts, addText)
  }
  
  function setGraphExpression(text) {
    graph.expression = ui.expressionText.value
    _.invokeEach(sledders, 'reset')
    _.invokeEach(goals, 'reset')
    
    camera.snap()
  }
  
  loadDatum(spec.datum)
  
  return self.mix({
    awake,
    
    tick,
    draw,
    
    stopRunning,
    
    setGraphExpression,

    camera,
    
    reset,
    
    get datum() {return spec.datum},
    get completed() {return completed},
  })
}