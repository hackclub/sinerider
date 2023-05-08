function Sledder(spec = {}) {
  const { self, screen, assets } = Entity(spec, 'Sledder')

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
    x: originX = 0,
    activeRange = [NINF, PINF],
    flipX,
    transition = null,
  } = spec

  const ctx = screen.ctx

  const velocity = [0, 0]

  const slopeTangent = Vector2()

  const pointCloud = [
    Vector2(0, 0),
    Vector2(-0.5, 0),
    Vector2(-0.5, 0.5),
    Vector2(-0.3, 0.8),
    Vector2(-0.1, 1.6),
    Vector2(0.1, 1.6),
    Vector2(0.3, 1.6),
    Vector2(0.3, 0.7),
    Vector2(0.6, 0.5),
    Vector2(0.6, 0),
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
    // opacity: 0,
    y: 1,
    flipX,
  })

  const shape = Rect({
    transform,
    width: size,
    height: size - 0.2,
    center: Vector2(0, size / 2 - 0.2),
  })

  const clickable = Clickable({
    entity: self,
    shape,
    transform,
    camera,
  })

  reset()

  function tick() {
    rigidbody.tick()
  }

  function drawLocal() {
    pointCloud.forEach((v) => {
      ctx.beginPath()
      ctx.fillStyle = 'red'
      ctx.arc(v.x, -v.y, camera.screenToWorldScalar(4), 0, TAU)
      ctx.fill()
    })
  }

  function draw() {
    if (clickable.selectedInEditor) shape.draw(ctx, camera)

    // rigidbody.draw(ctx)
    // camera.drawThrough(ctx, drawLocal, transform)
  }

  function startRunning() {}

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

  function select() {
    editor.select(self, 'sledder', ['x', 'y'])
  }

  function deselect() {
    editor.deselect()
  }

  function dragMove(point) {
    if (!editor.active) return
    transform.position = point
    ui.editorInspector.x.value = point.x.toFixed(2)
    ui.editorInspector.y.value = point.y.toFixed(2)
  }

  function dragEnd() {
    originX = transform.x
    reset()
  }

  function setX(x) {
    transform.position.x = x
  }

  function setY(y) {
    transform.position.y = y
  }

  return self.mix({
    transform,

    clickable,

    tick,
    draw,

    setX,
    setY,

    dragEnd,
    dragMove,

    startRunning,
    stopRunning,

    reset,

    pointCloud,

    select,
    deselect,

    get transition() {
      return transition
    },
    set transition(v) {
      transition = v
    },

    get activeRange() {
      return activeRange
    },
    get selectable() {
      return !globalScope.running
    },

    get velocity() {
      return self.active ? rigidbody.velocity.magnitude : 0
    },

    get rigidbody() {
      return rigidbody
    },
  })
}
