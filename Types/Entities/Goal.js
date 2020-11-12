function Goal(spec) {
  const self = Entity({
    name: 'Goal',
    ...spec
  })
  
  const transform = Transform(spec)
  
  let {
    type = 'fixed',
    timer = 0,
    order = null,
    size = 1,
    screen,
    camera,
    sledders,
    goalCompleted,
    goalFailed,
    globalScope,
    graph,
    getLowestOrder,
  } = spec
  
  const ctx = screen.ctx
  
  const fixed = type == 'fixed'
  const dynamic = type == 'dynamic'
  const anchored = type == 'anchored'
  
  const pointCloud = !dynamic ? null : [
    Vector2(-0.5, 0),
    Vector2(-0.4, -0.3),
    Vector2(-0.3, -0.4),
    Vector2(-0.1, -0.458),
    Vector2(0, -0.5),
    Vector2(0.1, -0.458),
    Vector2(0.3, -0.4),
    Vector2(0.4, -0.3),
    Vector2(0.5, 0),
  ]
  
  const shape = Rect({
    transform,
    width: size,
    height: size,
  })
  
  const rigidbody = Rigidbody({
    ...spec,
    transform,
    fixed: !dynamic,
    fixedRotation: true,
    positionOffset: Vector2(0, -0.5),
  })
  
  const startPosition = Vector2(spec)
  
  const screenPosition = Vector2()

  let triggered = false
  let available = false
  let completed = false
  let failed = false
  
  const completedFill = 'rgba(32, 255, 32, 0.8)'
  const availableFill = 'rgba(255, 255, 255, 0.8)'
  const unavailableFill = 'rgba(255, 192, 0, 0.8)'
  const failedFill = 'rgba(255, 0, 0, 0.8)'
  
  const p = Vector2()

  reset()
  
  function tick() {
    rigidbody.tick()
    
    if (globalScope.running)
      checkComplete()
  }
  
  function checkComplete() {
    triggered = false
    for (sledder of sledders) {
      if (intersectSledder(sledder)) {
        triggered = true
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
      p.set(sledderPoint)
      sledder.transform.transformPoint(p)
      
      if (shape.intersectPoint(p))
        return true
    }
    
    return false
  }
  
  function drawLocal() {
    // console.log('Localized canvas: ', ctx.getTransform().toString())
    
    ctx.strokeStyle = '#111'
    ctx.fillStyle = completed ? 
      completedFill : failed ? 
      failedFill : available ? 
      availableFill : unavailableFill
      
    ctx.lineWidth = 0.05
    
    if (fixed) {
      ctx.fillRect(-size/2, -size/2, size, size)
      ctx.strokeRect(-size/2, -size/2, size, size)
    }
    else if (dynamic) {
      ctx.beginPath()
      ctx.arc(0, 0, size/2, 0, TAU)
      ctx.fill()
      ctx.stroke()
    }
    
    if (order) {
      ctx.save()
      ctx.fillStyle = '#333'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '1px Roboto Mono' 
      ctx.scale(0.7, 0.7)
      ctx.fillText(order, 0, 0.25)
    // ctx.fillText(levelDatum.name, 0, radius)
      ctx.restore()
    }
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  function reset() {
    completed = false
    failed = false
    
    transform.position = startPosition

    if (dynamic || anchored) {
      transform.position.y = graph.sample('x', transform.position.x)+size/2
    }
    
    if (dynamic) {
      rigidbody.resetVelocity()
    }
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    reset()
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
    
    startRunning,
    stopRunning,
    
    pointCloud,
    refresh,
    
    complete,
    fail,
    
    get completed() {return completed},
    get available() {return available},
    get failed() {return failed},
    get order() {return order},
  })
}