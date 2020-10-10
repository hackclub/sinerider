function Goal(spec) {
  const self = Entity({
    name: 'Goal',
    ...spec
  })
  
  const transform = Transform(spec)
  
  let {
    type = 'static',
    timer = 0,
    order = null,
    size = 1,
    screen,
    camera,
    sledders,
    goalCompleted,
    globalScope,
  } = spec
  
  const ctx = screen.ctx
  
  const shape = Rect({
    transform,
    width: size,
    height: size,
  })
  
  const rigidbody = Rigidbody({
    ...spec,
    transform,
    fixed: type == 'static',
  })
  
  const screenPosition = Vector2()

  let triggered = false
  let completed = false
  
  const completedFill = 'rgba(32, 255, 32, 0.8)'
  const normalFill = 'rgba(255, 255, 255, 0.8)'
  
  const p = Vector2()
  
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
    
    if (triggered && !completed) complete()
  }
  
  function complete() {
    completed = true
    goalCompleted()
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
    ctx.fillStyle = completed ? completedFill : normalFill
    ctx.lineWidth = 0.05
    
    ctx.fillRect(-size/2, -size/2, size, size)
    ctx.strokeRect(-size/2, -size/2, size, size)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  function reset() {
    completed = false
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    reset()
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
    
    reset,
    
    startRunning,
    stopRunning,
    
    get completed() {return completed},
  })
}