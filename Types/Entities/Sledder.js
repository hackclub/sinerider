function Sledder(spec = {}) {
  const {
    self,
    screen,
    assets
  } = Entity(spec, 'Sledder')

  const transform = Transform(spec, self)
  const rigidbody = Rigidbody({
    ...spec,
    transform,
  })

  let {
    asset = 'images.lunchbox_sam_sled',
    size = 2,
    globalScope,
    camera,
    graph,
    speech,
    speechScreen,
    x: originX = 0
  } = spec

  const ctx = screen.ctx

  const velocity = [0, 0]

  const slopeTangent = Vector2()

  const pointCloud = [
    Vector2(0, 0),
    Vector2(-0.5, 0),
    Vector2(-0.5, 0.5),
    Vector2(0, 0.9),
    Vector2(0.1, 1),
    Vector2(0.3, 0.9),
    Vector2(0.5, 0.5),
    Vector2(0.5, 0),
  ]

  const trail = Trail({
    parent: self,
    x: 0.1,
    y: 0.5,
  })

  const sprite = Sprite({
    asset,
    size,
    speech,
    globalScope,
    parent: self,
    speechScreen,
    y: 1,
  })

  reset()

  function tick() {
    rigidbody.tick()
  }

  function draw() {
    // rigidbody.draw(ctx)
  }

  function startRunning() {
  }

  function stopRunning() {
    rigidbody.resetVelocity()
    reset()
  }

  function reset() {
    transform.x = originX
    transform.y = graph.sample('x', transform.x)

    slopeTangent.x = 1
    slopeTangent.y = graph.sampleSlope('x', transform.x)
    slopeTangent.normalize()

    // Set the Upright vector of rigidbody to the slope normal
    slopeTangent.orthogonalize(rigidbody.upright)

    let angle = Math.asin(slopeTangent.y)
    transform.rotation = angle

    trail.reset()
  }

  return self.mix({
    transform,

    tick,
    draw,

    startRunning,
    stopRunning,

    reset,

    pointCloud,
  })
}