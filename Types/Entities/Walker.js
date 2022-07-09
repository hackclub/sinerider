function Walker(spec) {
  const {
    self,
    camera,
    screen,
    ctx,
  } = Entity(spec, 'Walker')

  const transform = Transform(spec, self)

  let {
    asset = 'images.benny_float',
    size = 2,
    sprite,
    graph,
  } = spec

  sprite = Sprite({
    parent: self,
    asset,
    size,
    y: size/2,
    ...sprite
  })

  const clickable = Clickable({
    entity: self,
    space: 'frame',
    layer: spec.layer,
  })

  let walking = false
  let walkSign = 1
  let walkSpeed = 1

  let floatCycle = 0
  let floatCycleSpeed = 0.6

  let floatBob = 0
  let floatBobCoefficient = 0.12
  let floatBobHeight = 0.2

  let floatOffset = -0.1

  const mousePointFrame = Vector2()
  const mousePoint = Vector2()

  function tick() {
    if (walking) {
      camera.frameToWorld(mousePointFrame, mousePoint)
      transform.invertPoint(mousePoint)

      const oldWalkSign = walkSign
      const newWalkSign = Math.sign(mousePoint.x)

      if (oldWalkSign == newWalkSign || Math.abs(mousePoint.x) > 0.5) {
        walkSign = newWalkSign
        transform.position.x += walkSign*walkSpeed*self.tickDelta
        sprite.flipX = walkSign == -1
      }
    }

    const groundHeight = graph.sample('x', transform.position.x)

    floatCycle -= self.tickDelta*floatCycleSpeed

    if (floatCycle <= 0)
      floatCycle = 1

    floatBob = math.lerp(floatBob, floatCycle, floatBobCoefficient)

    transform.position.y = groundHeight+floatBob*floatBobHeight+floatOffset
  }

  function draw() {

  }

  function mouseDown(point) {
    walking = true
    mousePointFrame.set(point)
  }

  function mouseMove(point) {
    mousePointFrame.set(point)
  }

  function mouseUp() {
    walking = false
  }

  function click() {

  }

  return self.mix({
    transform,
    clickable,

    mouseDown,
    mouseMove,
    mouseUp,

    click,

    tick,
    draw,
  })
}