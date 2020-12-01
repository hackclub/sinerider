function Goal(spec) {
  const {
    self,
    screen,
    ctx,
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
  } = spec

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
  
  let fillColor
  let strokeColor
  
  const sledderPosition = Vector2()

  function awake() {
    self.reset()
  }
  
  function tick() {
    if (globalScope.running) {
      self.refreshTriggered()
      self.checkComplete()
    }
  }
  
  function refreshTriggered() {
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
  }
  
  function checkComplete() {
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
    strokeColor = '#111'
    fillColor = completed ? 
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

    self.refresh()
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
    
    awake,
    
    tick,
    draw,
    
    reset,
    refresh,
    
    startRunning,
    stopRunning,
    
    refreshTriggered,
    checkComplete,
    
    complete,
    fail,
    
    get completed() {return completed},
    get available() {return available},
    get triggered() {return triggered},
    get failed() {return failed},
    get order() {return order},
    
    get triggeringSledder() {return triggeringSledder},
    get triggeringSledderPosition() {return triggeringSledderPosition},
    get triggeringSledderDelta() {return triggeringSledderDelta},
    
    get fillColor() {return fillColor},
    get strokeColor() {return strokeColor},
  })
}