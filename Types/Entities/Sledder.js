function Sledder(spec = {}) {
  const { self, screen, parent } = Entity(spec, 'Sledder')

  const transform = Transform(spec, self)
  const rigidbody = Rigidbody({
    ...spec,
    transform,
  })

  const originalX = transform.position.x,
    originalY = transform.position.y

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

  const position = transform.position

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

  const debugVectorOrigin = Vector2()
  const debugVectorTerminus = Vector2()

  function drawDebugVector(ctx, vector, color, origin = position) {
    camera.worldToScreen(origin, debugVectorOrigin)

    debugVectorTerminus.set(vector)
    debugVectorTerminus.add(position)
    camera.worldToScreen(debugVectorTerminus)

    ctx.beginPath()
    ctx.moveTo(debugVectorOrigin.x, debugVectorOrigin.y)
    ctx.lineTo(debugVectorTerminus.x, debugVectorTerminus.y)

    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.stroke()
  }

  function draw() {
    rigidbody.draw(ctx)
    // camera.drawThrough(ctx, drawLocal, transform)
    // drawDebugVector(ctx, slopeTangent, 'blue')
    // drawDebugVector(ctx, rigidbody.upright, 'orange')
  }

  function startRunning() {}

  function stopRunning() {
    rigidbody.resetVelocity()
    reset()
  }

  function reset() {
    const polar = graph.isPolar

    if (polar) {
      position.set(originalX, originalY)
      const surfaceTheta = graph.thetaOfClosestSurfacePoint(position)

      graph.tangentVectorAt(surfaceTheta, slopeTangent)
      slopeTangent.normalize()

      graph.normalVectorAt(surfaceTheta, rigidbody.upright)
      rigidbody.upright.normalize()

      graph.pointAtTheta(surfaceTheta, position)
    } else {
      transform.x = originX
      transform.y = graph.sample('x', transform.x)

      slopeTangent.x = 1
      slopeTangent.y = graph.sampleSlope('x', transform.x)

      slopeTangent.normalize()

      // Set the Upright vector of rigidbody to the slope normal
      slopeTangent.orthogonalize(rigidbody.upright)
    }

    // let angle = Math.asin(slopeTangent.y)
    let angle = -PI / 2 + Math.atan2(rigidbody.upright.y, rigidbody.upright.x)
    transform.rotation = angle

    trail.reset()
  }

  /* Editor logic */

  const editor = parent

  function select() {
    if (!editor.editing) return
    editor.select(self, ['x'], false)
  }

  function deselect() {
    if (!editor.editing) return
    editor.deselect()
  }

  function dragMove(point) {
    if (!editor.editing) return
    position.set(point)
    editor.update()
  }

  function dragEnd() {
    if (!editor.editing) return
    originX = transform.x
    reset()
    editor.update()
  }

  function setX(x) {
    originX = x
    reset()
    editor.update()
  }

  function setY(y) {
    position.y = y
    // reset()
    // editor.update()
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

    get x() {
      return position.x
    },

    get y() {
      return position.y
    },

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
