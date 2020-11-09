function Level(spec) {
  const self = Entity(spec, 'Level')
  
  const {
    screen,
    globalScope,
    levelCompleted,
    useDragCamera = true,
  } = spec
  
  let defaultExpression = spec.datum.defaultExpression
  
  const sledders = []
  const goals = []
  const texts = []
  
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
  })
  
  self.children.push(sledders, goals, texts)
  
  let completed = false
  
  function tick() {
    // _.invokeEach(entities, 'tick', tickArgs)
  }
  
  function draw() {
    screen.ctx.fillStyle = '#48f'
    screen.ctx.fillRect(0, 0, screen.width, screen.height)
  
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
  
  function goalCompleted() {
    if (!completed) {
      for (goal of goals) {
        if (!goal.completed) {
          return
        }
      }
      
      completed = true
      levelCompleted()
    }
  }
  
  function stopRunning() {
    completed = false
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
  }
  
  loadDatum(spec.datum)
  
  return self.mix({
    tick,
    draw,
    
    stopRunning,
    
    setGraphExpression,
    
    get datum() {return spec.datum},
    get completed() {return completed},
  })
}