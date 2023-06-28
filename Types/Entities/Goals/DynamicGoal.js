function DynamicGoal(spec) {
  const { self, screen, camera, transform, ctx } = Goal(spec, 'Dynamic Goal')

  const base = _.mix(self)

  let { size = 1, globalScope, graph } = spec

  const bottom = Vector2(0, -size / 2)
  const bottomWorld = Vector2()

  const slopeTangent = Vector2()

  let startPosition = Vector2(spec)

  const bounds = Circle({
    transform,
    center: Vector2(0, 0),
    radius: size / 2,
  })

  const clickable = Clickable({
    entity: self,
    bounds,
    transform,
    camera,
  })

  const rigidbody = Rigidbody({
    ...spec,
    transform,
    // fixedRotation: true,
    positionOffset: Vector2(0, -0.5),
  })

  function drawLocal() {
    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle

    ctx.lineWidth = self.strokeWidth

    ctx.beginPath()
    ctx.arc(0, 0, size / 2, 0, TAU)
    ctx.fill()
    ctx.stroke()
  }

  function tick() {
    base.tick()
    rigidbody.tick()

    transform.transformPoint(bottom, bottomWorld)
  }

  function draw() {
    // Set alpha to fade with flash if completed
    self.setAlphaByFlashFade()

    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()

    // Reset alpha
    ctx.globalAlpha = 1

    if (self.debug) {
      rigidbody.draw(ctx)
    }
  }

  function reset() {
    base.reset()

    transform.position = startPosition
    transform.rotation = 0

    transform.position.y = graph.sample('x', transform.position.x) + size / 2

    transform.transformPoint(bottom, bottomWorld)

    rigidbody.resetVelocity()

    slopeTangent.x = 1
    slopeTangent.y = graph.sampleSlope('x', bottomWorld.x)
    slopeTangent.normalize()

    // Set the Upright vector of rigidbody to the slope normal
    slopeTangent.orthogonalize(rigidbody.upright)

    let angle = math.atan2(slopeTangent.y, slopeTangent.x)
    transform.rotation = angle
  }

  function setX(x) {
    startPosition.x = x
    transform.position.x = x
    self.reset()
  }

  function setY(y) {
    startPosition.y = y
    transform.position.y = y
    self.reset()
  }

  return self.mix({
    transform,
    rigidbody,

    // TODO: Ideally this sort of thing shouldn't
    // be exposed? Either refactor how Editable goals
    // work or establish/re-establish how Crockford
    // inheritance should ideally be used
    startPosition,

    clickable,

    tick,
    draw,

    reset,

    setX,
    setY,

    bounds,

    get type() {
      return 'dynamic'
    },
  })
}
