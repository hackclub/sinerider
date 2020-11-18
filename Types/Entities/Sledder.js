function Sledder(spec = {}) {
  const {
    self,
    screen,
    assets
  } = Entity(spec, 'Sledder')
  
  const transform = Transform(spec)
  const rigidbody = Rigidbody({
    ...spec,
    transform,
  })
  
  let {
    asset = 'images.sledder_0',
    image,
    size = 1,
    globalScope,
    camera,
    graph,
    x: originX = 0
  } = spec
  
  const ctx = screen.ctx
  
  const velocity = [0, 0]
  
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
  
  if (asset) {
    image = _.get(assets, asset, $('#error-sprite'))
    console.log(`Sledder loaded asset ${asset}:`, image)
  }
  
  // const sprite = Sprite({
  //   parent: self,
  //   asset,
  //   image,
  //   size,
  // })
  
  reset()
  
  function tick() {
    rigidbody.tick()
  }
  
  function drawLocal() {
    ctx.drawImage(image, -size/2, -size, size, size)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
    // rigidbody.draw(ctx)
  }
  
  function startRunning() {
  }
  
  function stopRunning() {
    rigidbody.resetVelocity()
    reset()
  }
  
  function reset() {
    transform.x = originX
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