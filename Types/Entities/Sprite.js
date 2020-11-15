function Sprite(spec = {}) {
  const {
    self,
    screen,
    camera,
  } = Entity(spec, 'Sprite')
  
  const transform = Transform(spec)
  
  let {
    source = 'Assets/nicky_sledders.png',
    pngName = null,
    size = 1,
    globalScope,
    graph,
    anchored = true,
    sloped = false,
    x: originX = 0,
    y: offsetY = 0,
  } = spec
  
  if (pngName)
    source = `Assets/${pngName}.png`
  
  const ctx = screen.ctx
  
  const slopeTangent = Vector2()
  
  const image = new Image()
  image.src = source
  
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