function LevelBubble(spec) {
  const self = Entity({
    name: spec.name,
    ...spec
  })
  
  const {
    screen,
    camera,
    setLevel,
    levelDatum,
    getEditing,
    radius = 3,
  } = spec
  
  const transform = Transform(levelDatum)
  
  const shape = Circle({
    transform,
    radius,
  })
  
  const clickable = Clickable({
    shape,
    transform,
    camera,
  })
  self.mix(clickable)
  
  const ctx = screen.ctx
  
  function tick() {
    
  }
  
  function drawLocal() {
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI*2)
    
    ctx.lineWidth = clickable.hover ? 0.1 : 0.02
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#444'
    
    ctx.fill()
    ctx.stroke()
    
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    ctx.font = '1px Garamond'
    
    ctx.fillText(levelDatum.name, 0, 0)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  function click(point) {
    setLevel(levelDatum)
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
    
    click,
  })
}