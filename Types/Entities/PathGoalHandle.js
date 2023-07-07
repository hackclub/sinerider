function PathGoalHandle(spec) {
  const { self, parent, camera, ctx } = Entity(spec, 'Fixed Goal Handle')

  const { type, editor } = spec

  const transform = Transform(spec)

  const radius = 0.5
  const color = '#fff'

  const center = Vector2()

  const handle = Circle({
    center,
    radius,
    color,
  })

  self.mix(handle)

  const clickable = Clickable({
    entity: self,
    shape: handle,
  })

  function draw() {
    if (parent.selected && editor.editing) {
      handle.center = transform
      handle.draw(ctx, camera)
    }
  }

  function dragMove(point) {
    console.log('setting end', point.x)
    if (type === 'start') {
      parent.setStart(point.x)
    } else if (type === 'end') {
      parent.setEnd(point.x)
    }
  }

  function mouseDown() {
    console.log('path handle clicked')
  }

  return self.mix({
    transform,

    mouseDown,

    clickable,

    dragMove,

    draw,
    center,
  })
}
