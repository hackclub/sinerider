function Axes(spec) {
  const { self, screen } = Entity(spec, 'Axes')

  const transform = Transform()

  let { camera } = spec

  const ctx = screen.ctx

  const origin = Vector2()
  const screenOrigin = Vector2()

  function tick() {}
  function drawLocal(){
    const xTicks = Math.ceil(camera.upperRight.x-camera.lowerLeft.x)+1
    const yTicks = Math.ceil(camera.upperRight.y-camera.lowerLeft.y)+1
    ctx.beginPath()

    // Draw right x ticks
    for (let i=0; i<xTicks; i++){
      ctx.moveTo(i, 0)
      ctx.lineTo(i, -0.2)
    }
    // Draw left x ticks
    for (let i=0; i>-xTicks; i--){
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 0.2)
    }
    // Draw top y ticks
    for (let i=0; i<yTicks; i++){
      ctx.moveTo(0, -i)
      ctx.lineTo(0.2, -i)
    }
    // Draw bottom y ticks
    for (let i=0; i>-yTicks; i--){
      ctx.moveTo(0, -i)
      ctx.lineTo(-0.2, -i)
    }

    ctx.strokeStyle = '#aaa'
    ctx.lineWidth = camera.screenToWorldScalar(1)

    ctx.stroke()
  }
  function draw() {
    camera.worldToScreen(origin, screenOrigin)

    ctx.beginPath()

    ctx.moveTo(0, screenOrigin.y)
    ctx.lineTo(screen.width, screenOrigin.y)

    ctx.moveTo(screenOrigin.x, 0)
    ctx.lineTo(screenOrigin.x, screen.height)

    ctx.strokeStyle = '#aaa'
    ctx.lineWidth = 2

    ctx.stroke()
    camera.drawThrough(ctx, drawLocal, transform)
    
  }

  return self.mix({
    transform,

    tick,
    draw,
  })
}
