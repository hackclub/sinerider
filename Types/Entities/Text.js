function Text(spec) {
  const self = Entity({
    name: 'Text',
    ...spec
  })
  
  const transform = Transform(spec)

  const {
    screen,
    camera,
    size = 1,
    color = '#222',
    align = 'center',
    baseline = 'middle',
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
    
    ctx.font = '1px Roboto Mono'
    
    ctx.fillText(content, 0, 0)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  return self.mix({
    tick,
    draw,
  })
}