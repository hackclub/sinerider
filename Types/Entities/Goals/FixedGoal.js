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

  const clickable = Clickable({
    entity: self,
    shape,
    transform,
    camera,
  })

  function drawLocal() {
    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle

    ctx.lineWidth = self.strokeWidth

    ctx.fillRect(-size/2, -size/2, size, size)
    ctx.strokeRect(-size/2, -size/2, size, size)
  }

  function draw() {
    // Set alpha to fade with flash if completed
    self.setAlphaByFlashFade()

    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()

    // Reset alpha
    ctx.globalAlpha = 1
  }

  let moving = false

  function mouseDown() {
    console.log('moved down')
    transform.scale = 1.1
    moving = true
  }

  function mouseMove(point) {
    if (!moving) return
    startPosition = point
    transform.position = point
  }

  function mouseUp() {
    if (!moving) return
    transform.scale = 1
    moving = false
    reset()
  }

  return self.mix({
    draw,
    shape,

    clickable,
    mouseDown,
    mouseMove,
    mouseUp,
  })
}