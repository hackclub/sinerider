function Speech(spec) {
  const {
    self,
    screen,
    camera,
    ctx,
  } = Entity(spec, 'Speech')
  
  let {
    content = 'WORDS WORDS WORDS',
    direction = 'center',
    font = 'Patrick Hand',
    baseline = 'bottom',
    align = 'center',
    color = '#222',
    size = 16,
    lineLength = 0.5,
  } = spec
  
  const transform = Transform(spec, self)
  
  let textDirection
  switch (direction) {
    case 'left':
      textDirection = Vector2(-1, 0)
      align = 'right'
      baseline: 'middle'
      break
    case 'center':
      textDirection = Vector2(0, 1)
      align = 'center'
      baseline: 'bottom'
      break
    case 'right':
      textDirection = Vector2(1, 0)
      align = 'left'
      baseline: 'middle'
      break
    default:
      textDirection = direction
  }
  textDirection.normalize()
  
  const lineOrigin = textDirection.multiply(0.1, Vector2())
  const lineOriginScreen = Vector2()
  
  const lineTerminus = textDirection.multiply(lineLength, Vector2())
  const lineTerminusScreen = Vector2()
  
  const textOrigin = Vector2(textDirection).multiply(lineLength)
  const textOriginScreen = Vector2()
  
  function tick() {
    
  }
  
  function draw() {
    const scalar = camera.worldToScreenScalar()
    
    camera.worldToScreen(textOrigin, textOriginScreen, transform)
    camera.worldToScreen(lineOrigin, lineOriginScreen, transform)
    
    lineTerminusScreen.set(lineTerminus)
    // lineTerminusScreen.y *= -1
    lineTerminusScreen.multiply(scalar)
    lineTerminusScreen.x += lineOriginScreen.x
    lineTerminusScreen.y += lineOriginScreen.y
    
    ctx.strokeStyle = color
    ctx.lineWidth = scalar/15
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(lineOriginScreen.x, lineOriginScreen.y)
    ctx.lineTo(lineTerminusScreen.x, lineTerminusScreen.y)
    ctx.stroke()
    
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.font = (size)+'px '+font
    
    ctx.fillText(content, textOriginScreen.x, textOriginScreen.y)
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
  })
}