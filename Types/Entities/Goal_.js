function Goal(spec) {
  const {
    self,
    screen
  } = Entity(spec, 'Goal')
  
  const transform = Transform(spec)
  
  let {
    type = 'fixed',
    timer = 0,
    order = null,
    size = 1,
    camera,
    sledders,
    goalCompleted,
    goalFailed,
    globalScope,
    graph,
    getLowestOrder,
    expression: pathExpression = 'sin(x)', 
    pathX = 4,
    pathY = 0,
  } = spec
  
  const ctx = screen.ctx
  
  const fixed = type == 'fixed'
  const dynamic = type == 'dynamic'
  const anchored = type == 'anchored'
  const path = type == 'path'
  
  const trackPoints = []
  
  const bottom = Vector2(0, -size/2)
  const bottomWorld = Vector2()
  
  const slopeTangent = Vector2()
  
  const pathPosition = Vector2()
  const pathPositionWorld = Vector2()
  
  const pathStart = Vector2()
  const pathEnd = Vector2(pathX, 0)
  
  const pathMin = Vector2()
  const pathMax = Vector2()
  
  const pathStartWorld = Vector2(spec.x, 0)
  const pathEndWorld = Vector2(pathX, 0)
  
  const pathMinWorld = Vector2()
  const pathMaxWorld = Vector2()
  
  const pathSign = Math.sign(pathX)
  const pathSpan = Math.abs(pathX)
  
  const maxPathResetSpeed = 3
  let pathResetSpeed = 0
  let pathProgress = 0
    
  const startPosition = Vector2(spec)
  
  const screenPosition = Vector2()

  let triggered = false
  let available = false
  let completed = false
  let failed = false
  
  let triggeringSledder = null
  const triggeringSledderPosition = Vector2()
  const triggeringSledderDelta = Vector2()
  
  const completedFill = 'rgba(32, 255, 32, 0.8)'
  const triggeredFill = 'rgba(128, 255, 128, 0.8)'
  const availableFill = 'rgba(255, 255, 255, 0.8)'
  const unavailableFill = 'rgba(255, 192, 0, 0.8)'
  const failedFill = 'rgba(255, 0, 0, 0.8)'
  
  const sledderPosition = Vector2()
  
  const shape = fixed ? Rect({
    transform,
    width: size,
    height: size,
  }) : Circle({
    transform,
    center: Vector2(0, 0),
    radius: size/2,
  })
  
  const rigidbody = Rigidbody({
    ...spec,
    transform,
    fixed: !dynamic,
    // fixedRotation: true,
    positionOffset: Vector2(0, -0.5),
  })
  
  let pathGraph
  if (path) {
    // Establish path origin in world space
    transform.transformPoint(pathStart, pathStartWorld)
    transform.transformPoint(pathEnd, pathEndWorld)
    
    pathGraph = Graph({
      parent: self,
      globalScope,
      expression: pathExpression,
      fill: false,
      freeze: true,
      bounds: [pathStartWorld.x, pathEndWorld.x],
      sampleCount: Math.round(pathSpan*4),
      strokeWidth: 4,
      strokeColor: '#888',
      dashed: true,
      dashSettings: [0.2, 0.2],
    })
    
    // Sample start/end points
    pathStartWorld.y = pathGraph.sample('x', pathStartWorld.x)
    pathEndWorld.y = pathGraph.sample('x', pathEndWorld.x)
    
    // Move transform to start of path
    transform.position = pathStartWorld
    
    // Compute world-space points
    transform.invertPoint(pathStartWorld, pathStart)
    transform.invertPoint(pathEndWorld, pathEnd)
    
    pathPosition.set(pathStart)
    transform.transformPoint(pathPosition, pathPositionWorld)
    
    // Compute min/max points
    pathStart.min(pathEnd, pathMin)
    pathStart.max(pathEnd, pathMax)
    
    pathStartWorld.min(pathEndWorld, pathMinWorld)
    pathStartWorld.max(pathEndWorld, pathMaxWorld)
    
    trackPoints.push(pathStartWorld)
    trackPoints.push(pathEndWorld)
  }

  reset()
  
  function tick() {
    if (globalScope.running)
      checkComplete()
  }
  
  function checkComplete() {
    let alreadyTriggered = triggered
    
    triggered = false
    triggeringSledder = null
    for (sledder of sledders) {
      if (intersectSledder(sledder)) {
        if (!alreadyTriggered)
          triggeringSledderPosition.set(sledder.transform.position)
        
        sledder.transform.position.subtract(triggeringSledderPosition, triggeringSledderDelta)
        triggeringSledderPosition.set(sledder.transform.position)
        
        triggered = true
        triggeringSledder = sledder
        
        break
      }
    }
    
    if (triggered && !completed && !failed) {
      if (available)
        complete()
      else
        fail()
    }
  }
  
  function complete() {
    if (completed) return
    
    completed = true
    goalCompleted(self)
  }
  
  function fail() {
    if (failed) return
    
    failed = true
    goalFailed(self)
  }
  
  function intersectSledder(sledder) {
    for (sledderPoint of sledder.pointCloud) {
      sledderPosition.set(sledderPoint)
      sledder.transform.transformPoint(sledderPosition)
      
      if (self.shape.intersectPoint(sledderPosition))
        return true
    }
    
    return false
  }
  
  function drawLocal() {
    ctx.strokeStyle = '#111'
    ctx.fillStyle = completed ? 
      completedFill : failed ? 
      failedFill : triggered ? 
      triggeredFill : available ? 
      availableFill : unavailableFill
    
    
    if (order) {
      ctx.save()
      ctx.fillStyle = '#333'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '1px Roboto Mono'
      ctx.scale(0.7, 0.7)
      
      ctx.fillText(order, 0, 0.25)
      ctx.restore()
    }
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
    
    if (self.debug) {
      shape.draw(ctx, camera)
    }
  }
  
  function reset() {
    triggered = false
    completed = false
    failed = false
    
    triggeringSledder = null
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    self.reset()
  }
  
  function refresh() {
    available = true
    
    if (order) {
      available = getLowestOrder().localeCompare(order) >= 0
    }
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
    
    reset,
    refresh,
    
    startRunning,
    stopRunning,
    
    complete,
    fail,
    
    trackPoints,
    
    get completed() {return completed},
    get available() {return available},
    get triggered() {return triggered},
    get failed() {return failed},
    get order() {return order},
    
    get triggeringSledder() {return triggeringSledder},
    get triggeringSledderPosition() {return triggeringSledderPosition},
    get triggeringSledderDelta() {return triggeringSledderDelta},
  })
}