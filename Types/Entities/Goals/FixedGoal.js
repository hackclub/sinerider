function FixedGoal(spec) {
  const {
    self,
    screen,
    camera,
    transform,
    ctx,
  } = Goal(spec, 'Fixed Goal')
  
  const base = _.mix(self)
  
  let {
    size = 1,
  } = spec
  
  const shape = Rect({
    transform,
    width: size,
    height: size,
  })
  
  function drawLocal() {
    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle
    
    ctx.lineWidth = self.strokeWidth
    
    ctx.fillRect(-size/2, -size/2, size, size)
    ctx.strokeRect(-size/2, -size/2, size, size)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()
  }
  
  return self.mix({
    draw,
    shape,
  })
}