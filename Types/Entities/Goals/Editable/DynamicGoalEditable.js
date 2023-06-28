function EditableDynamicGoal(spec) {
  const { self, transform, startPosition, clickable, ctx, camera, bounds } =
    DynamicGoal(spec)

  const { editor } = spec

  const base = _.mix(self)

  function select() {
    editor.select(self, 'dynamic', ['order', 'x', 'y'])
  }

  function unselect() {
    editor.unselect()
  }

  let moving = false

  function mouseDown() {
    if (!clickable.selected) return
    moving = true
    transform.scale = 1.1
  }

  function mouseMove(point) {
    if (!moving) return
    startPosition.set(point)
    transform.position.set(point)
    editor.sendEvent('selectionChange')
  }

  function mouseUp() {
    if (moving) moving = false
    transform.scale = 1
    self.reset()
  }

  let t = 0

  function drawLocal() {
    base.drawLocal()

    if (clickable.selected) {
      bounds.draw(ctx, camera)

      t += 0.1
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
    }
  }

  return self.mix({
    drawLocal,

    mouseDown,
    mouseMove,
    mouseUp,

    select,
    unselect,
  })
}
