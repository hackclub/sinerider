function PanDirector(spec) {
  const { self, screen, cameraState } = Director(spec, 'PanDirector')

  const { camera } = spec

  let {} = spec

  let velocity = Vector2()

  cameraState.position = Vector2()

  let justUpdatedVelocity = false
  let justUpdatedVelocityThroughKeys = false

  let clickable = Clickable({
    entity: self,
  })

  function tick() {
    if (!clickable.holding && !justUpdatedVelocity) {
      velocity.multiply(0.85)
    }
    cameraState.position.add(velocity)
    justUpdatedVelocity = false
  }

  function updateVelocity(mousePoint) {
    if (!clickable.holding) return
    let left = camera.lowerLeft.x
    let right = camera.upperRight.x
    let top = camera.upperRight.y
    let bottom = camera.lowerLeft.y

    let x = math.remap(left, right, -1, 1, mousePoint.x)
    let y = math.remap(bottom, top, -1, 1, mousePoint.y)

    velocity.set(x, y).normalize().multiply(0.5)

    // console.log('Mouse move', x, y)

    justUpdatedVelocity = true
  }

  function keydown(key) {
    let x =
      key == 'ArrowRight' || key == 'd'
        ? 1
        : key == 'ArrowLeft' || key == 'a'
        ? -1
        : velocity.x
    let y =
      key == 'ArrowUp' || key == 'w'
        ? 1
        : key == 'ArrowDown' || key == 's'
        ? -1
        : velocity.y

    velocity.set(x, y)
    justUpdatedVelocity = true
    justUpdatedVelocityThroughKeys = true
  }

  function mouseUp() {
    // velocity.set(0, 0)
  }

  function mouseDown(point) {
    // let left = camera.lowerLeft.x
    // let right = camera.upperRight.x
    // let top = camera.upperRight.y
    // let bottom = camera.lowerLeft.y
    // let x = math.remap(left, right, -1, 1, point.x)
    // let y = math.remap(bottom, top, -1, 1, point.y)
    // velocity.set(x, y)
  }

  function moveTo(point, cb = null) {
    // TODO: Pan in tick() and then call cb
    point.subtract(cameraState.position, cameraState.position).multiply(0.1)
    if (cb) setTimeout(cb, 500)
  }

  return self.mix({
    tick,
    draw,

    keydown,

    clickable,
    mouseUp,
    mouseDown: updateVelocity,
    hoverMove: updateVelocity,

    moveTo,
  })
}
