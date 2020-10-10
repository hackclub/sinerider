function Axes(spec) {
  const self = Entity({
    name: 'Axes',
    ...spec
  })
  const transform = Transform()
  
  let {
    camera,
    screen,
  } = spec
  
  const ctx = screen.ctx
  
  const origin = Vector2()
  const screenOrigin = Vector2()
  
  function tick() {
    
  }
  
  function draw() {
    camera.worldToScreen(origin, screenOrigin)
    
    ctx.beginPath()
    
    ctx.moveTo(0, screenOrigin.y)
    ctx.lineTo(screen.width, screenOrigin.y)

    ctx.moveTo(screenOrigin.x, 0)
    ctx.lineTo(screenOrigin.x, screen.height)
    
    ctx.strokeStyle = '#aaa'
    ctx.lineWidth = 1
    
    ctx.stroke()
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
  })
}