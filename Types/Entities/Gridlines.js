// TODO: Refactor Gridlines, clean up interface
function Gridlines(spec) {
  const { self, screen, parent } = Entity(spec, 'Gridlines')

  const transform = Transform()

  let { camera } = spec

  const ctx = screen.ctx

  let x = 0
  let y = 0
  const origin = Vector2()
  const screenOrigin = Vector2()

  function updatePosition(newX, newY) {
    x = newX
    y = newY
  }

  function tick() {}

  function drawLocalAxesTicks() {
    const xTicks = Math.ceil(camera.upperRight.x - camera.lowerLeft.x) + 1
    const yTicks = Math.ceil(camera.upperRight.y - camera.lowerLeft.y) + 1
    ctx.beginPath()

    // Draw right x ticks
    for (let i = 0; i < xTicks; i++) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i, -0.2)
    }
    // Draw left x ticks
    for (let i = 0; i > -xTicks; i--) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 0.2)
    }
    // Draw top y ticks
    for (let i = 0; i < yTicks; i++) {
      ctx.moveTo(0, -i)
      ctx.lineTo(0.2, -i)
    }
    // Draw bottom y ticks
    for (let i = 0; i > -yTicks; i--) {
      ctx.moveTo(0, -i)
      ctx.lineTo(-0.2, -i)
    }
    ctx.strokeStyle = '#DDD'
    ctx.lineWidth = camera.screenToWorldScalar(1.4)

    ctx.stroke()
  }

  function drawLocal() {
    const xTicks = Math.ceil(camera.upperRight.x - camera.lowerLeft.x) + 1
    const yTicks = Math.ceil(camera.upperRight.y - camera.lowerLeft.y) + 1
    ctx.beginPath()

    // Draw vertical lines
    for (let i = 0; i < xTicks; i++) {
      ctx.moveTo(i, -camera.lowerLeft.y)
      ctx.lineTo(i, -camera.upperRight.y)
      ctx.moveTo(-i, -camera.lowerLeft.y)
      ctx.lineTo(-i, -camera.upperRight.y)
    }

    // Draw horizontal lines
    for (let i = 0; i < yTicks; i++) {
      ctx.moveTo(camera.lowerLeft.x, -i)
      ctx.lineTo(camera.upperRight.x, -i)
      ctx.moveTo(camera.lowerLeft.x, i)
      ctx.lineTo(camera.upperRight.x, i)
    }

    ctx.strokeStyle = 'rgba(170, 170, 170, 0.5)'
    ctx.lineWidth = camera.screenToWorldScalar(1)

    ctx.stroke()

    if (!parent.isEditor) {
      ctx.beginPath()
      ctx.moveTo(camera.lowerLeft.x, -y)
      ctx.lineTo(camera.upperRight.x, -y)
      ctx.moveTo(x, -camera.lowerLeft.y)
      ctx.lineTo(x, -camera.upperRight.y)
      ctx.strokeStyle = 'rgba(136, 187, 221, 1)'
      ctx.lineWidth = camera.screenToWorldScalar(1)
      ctx.stroke()
    }
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)

    // Draw Axis Lines When Active
    camera.worldToScreen(origin, screenOrigin)
    ctx.beginPath()
    ctx.moveTo(0, screenOrigin.y)
    ctx.lineTo(screen.width, screenOrigin.y)
    ctx.moveTo(screenOrigin.x, 0)
    ctx.lineTo(screenOrigin.x, screen.height)
    ctx.strokeStyle = '#DDD'
    ctx.lineWidth = 2.8
    ctx.stroke()

    camera.drawThrough(ctx, drawLocalAxesTicks, transform)
  }

  return self.mix({
    transform,
    tick,
    draw,
    updatePosition,
  })
}
