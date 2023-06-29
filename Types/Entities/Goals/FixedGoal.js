function FixedGoal(spec) {
  const { self, screen, camera, transform, ctx, parent } = Goal(
    spec,
    'Fixed Goal',
  )

  const base = _.mix(self)

  let { world, size = 1 } = spec

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

  t = 0

  function drawLocal() {
    t += 0.01
    if (clickable.selectedInEditor) {
      transform.scale = 1.1

      ctx.fillStyle = ctx.createConicGradient(Math.PI / 4, size / 2, size / 2)
      ctx.fillStyle.addColorStop(t % 1, '#FBA')
      ctx.fillStyle.addColorStop((t + 0.25) % 1, '#BC1')
      ctx.fillStyle.addColorStop((t + 0.5) % 1, '#BFC')
      ctx.fillStyle.addColorStop((t + 0.75) % 1, '#A9D')
      ctx.fillStyle.addColorStop((t + 1) % 1, '#A9B')

      ctx.lineWidth = 0.05

      let outlinePadding = 0.3

      ctx.fillRect(
        -size / 2 - outlinePadding / 2,
        -size / 2 - outlinePadding / 2,
        size + outlinePadding,
        size + outlinePadding,
      )
    } else {
      transform.scale = 1
    }

    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle

    ctx.lineWidth = self.strokeWidth

    ctx.fillRect(-size / 2, -size / 2, size, size)
    ctx.strokeRect(-size / 2, -size / 2, size, size)
  }

  function draw() {
    // Set alpha to fade with flash if completed
    self.setAlphaByFlashFade()

    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()

    // Reset alpha
    ctx.globalAlpha = 1
  }

  /* Editor logic */

  const editor = parent

  let moving = false

  function select() {
    if (!editor.editing) return
    editor.select(self, ['x', 'y', 'order'])
  }

  function deselect() {
    if (!editor.editing) return
    editor.deselect()
  }

  function mouseDown() {
    if (!editor.editing) return
    moving = true
  }

  function mouseMove(point) {
    if (!moving) return
    transform.position = point
    editor.update()
  }

  function mouseUp() {
    if (!moving) return
    moving = false
  }

  return self.mix({
    draw,
    shape,

    clickable,
    mouseDown,
    mouseMove,
    mouseUp,

    select,
    deselect,

    get type() {
      return 'fixed'
    },
  })
}
