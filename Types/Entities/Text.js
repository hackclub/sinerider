function Text(spec) {
  const {
    self,
    screen
  } = Entity(spec, 'Text')
  
  const transform = Transform(spec)

  const {
    camera,
    size = 1,
    fill = '#222',
    stroke = false,
    align = 'center',
    baseline = 'middle',
<<<<<<< HEAD
    font = 'Edu QLD Beginner'
=======
    font = '1px Roboto Mono'
>>>>>>> e94e8d065ee73dd9fb478887dbd30787926d4a32
  } = spec
  
  let {
    content = 'Hello',
  } = spec
  
  const ctx = screen.ctx
  
  function tick() {
    
  }
  
  function drawLocal() {
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.scale(size, size)
    
<<<<<<< HEAD
    ctx.font = `1px ${font}`
=======
    ctx.font = font
>>>>>>> e94e8d065ee73dd9fb478887dbd30787926d4a32
    
    if (fill)
      ctx.fillText(content, 0, 0)
    if (stroke)
      ctx.strokeText(content, 0, 0)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  return self.mix({
    tick,
    draw,
  })
}