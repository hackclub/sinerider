function Sprite(spec = {}) {
  const {
    self,
    screen,
    camera,
    assets,
  } = Entity(spec, 'Sprite')
  
  const transform = Transform(spec)
  
  let {
    asset,
    image,
    graph,
    size = 1,
    globalScope,
    anchored = false,
    sloped = false,
    x: originX = 0,
    y: offsetY = 0,
  } = spec
  
  const ctx = screen.ctx
  
  const slopeTangent = Vector2()
  
  if (asset) {
    image = _.get(assets, asset, $('#error-sprite'))
    console.log(`Sprite loaded asset ${asset}:`, image)
  }
  
  function tick() {
    if (anchored) {
      transform.x = originX
      transform.y = graph.sample('x', transform.x)
    }
    
    if (sloped) {
      slopeTangent.x = 1
      slopeTangent.y = graph.sampleSlope('x', transform.x)
      slopeTangent.normalize()
      
      let angle = Math.asin(slopeTangent.y)
      transform.rotation = angle
    }
  }
  
  function drawLocal() {
    ctx.drawImage(image, -size/2, -size-offsetY, size, size)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  return self.mix({
    transform,

    tick,
    draw,
  })
}