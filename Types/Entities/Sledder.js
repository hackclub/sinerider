function Sledder(spec = {}) {
  const self = Entity(spec)
  const transform = Transform(spec)
  const rigidbody = Rigidbody({
    ...spec,
    transform,
  })
  
  let {
    skin = 'Assets/nicky_sledders.png',
    size = 1,
    globalScope,
    
    camera,
    graph,
  } = spec
  
  const ctx = screen.ctx
  
  const velocity = [0, 0]
  
  const image = new Image()
  image.src = skin
  
  const slopeTangent = Vector2()
  const pointCloud = [
    Vector2(0, 0),
    Vector2(-0.5, 0),
    Vector2(-0.5, 0.5),
    Vector2(0, 0.9),
    Vector2(0.1, 1),
    Vector2(0.3, 0.9),
    Vector2(0.5, 0.5),
    Vector2(0.5, 0),
  ]
  
  reset()
  
  function tick() {
    rigidbody.tick()
  }
  
  function drawLocal() {
    ctx.drawImage(image, -0.5, -1, size, size)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
    //rigidbody.draw(ctx)
  }
  
  function startRunning() {
  }
  
  function stopRunning() {
    rigidbody.resetVelocity()
    reset()
  }
  
  function reset() {
    transform.x = 0
    transform.y = graph.sample('x', transform.x)
    
    slopeTangent.x = 1
    slopeTangent.y = graph.sampleSlope('x', transform.x)
    slopeTangent.normalize()
    
    // Set the Upright vector of rigidbody to the slope normal
    slopeTangent.orthogonalize(rigidbody.upright)
    
    let angle = Math.asin(slopeTangent.y)
    transform.rotation = angle
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
    
    startRunning,
    stopRunning,
    
    reset,
    
    pointCloud,
  })
}