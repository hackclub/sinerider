function DynamicGoal(spec) {
  const {
    self,
    screen,
    camera,
    transform,
    ctx,
  } = Goal(spec, 'Dynamic Goal')
  
  const base = _.mix(self)
  
  let {
    size = 1,
    globalScope,
    graph,
  } = spec
  
  const bottom = Vector2(0, -size/2)
  const bottomWorld = Vector2()
  
  const slopeTangent = Vector2()
    
  const startPosition = Vector2(spec)
  
  const shape = Circle({
    transform,
    center: Vector2(0, 0),
    radius: size/2,
  })
  
  const rigidbody = Rigidbody({
    ...spec,
    transform,
    // fixedRotation: true,
    positionOffset: Vector2(0, -0.5),
  })
  
  function tick() {
    base.tick()
    rigidbody.tick()
    
    transform.transformPoint(bottom, bottomWorld)
  }
  
  function drawLocal() {
    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle
    
    ctx.lineWidth = self.strokeWidth
    
    ctx.beginPath()
    ctx.arc(0, 0, size/2, 0, TAU)
    ctx.fill()
    ctx.stroke()
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()
    
    if (self.debug) {
      rigidbody.draw(ctx)
    }
  }
  
  function reset() {
    base.reset()
    
    transform.position = startPosition
    transform.rotation = 0

    transform.position.y = graph.sample('x', transform.position.x)+size/2
    
    transform.transformPoint(bottom, bottomWorld)
    
    rigidbody.resetVelocity()
    
    slopeTangent.x = 1
    slopeTangent.y = graph.sampleSlope('x', bottomWorld.x)
    slopeTangent.normalize()
      
    // Set the Upright vector of rigidbody to the slope normal
    slopeTangent.orthogonalize(rigidbody.upright)
      
    let angle = math.atan2(slopeTangent.y, slopeTangent.x)
    transform.rotation = angle
  }
  
  return self.mix({
    transform,
    rigidbody,
    
    tick,
    draw,
    
    reset,
    
    shape,
  })
}