function Level(spec) {
  const self = Entity(spec)
  
  const {
    screen,
    globalScope,
    levelCompleted,
  } = spec
  
  let defaultExpression = spec.datum.defaultExpression
  
  const sledders = []
  const goals = []
  
  const camera = Camera({
    screen,
    globalScope,
    sledders,
    goals,
    parent: self,
  })
  
  const axes = Axes({
    screen,
    camera,
    globalScope,
    parent: self,
  })
  
  const graph = Graph({
    screen,
    camera,
    globalScope,
    expression: defaultExpression,
    parent: self,
  })
  
  self.children.push(sledders, goals)
  
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
  })
}