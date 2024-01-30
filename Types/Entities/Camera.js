// The Camera transforms world-space coordinates into Frame-space coordinates (see Screen.js for an explanation of the "Frame")
//
// The camera smoothly pans and zooms to keep all Sledders, Goals, and the Axes origin in view at all times.

function Camera(spec) {
  const { self, screen } = Entity(spec, 'Camera')

  const transform = Transform(spec)

  let { fov = 5, rotation = 0, globalScope = {}, directors = [] } = spec

  let shake = 0

  // const defaultOffset = Vector2(spec.offset || [0, 0])
  const defaultOffset = Vector2([0, 0])
  const offset = defaultOffset.clone()
  const scaledOffset = Vector2()

  let activeDirector = null

  transform.scale = fov

  const lowerLeft = Vector2()
  const upperRight = Vector2()

  computeCorners()

  // Debug values
  const topScreen = Vector2()
  const topWorld = Vector2()

  const bottomScreen = Vector2()
  const bottomWorld = Vector2()

  const leftScreen = Vector2()
  const leftWorld = Vector2()

  const rightScreen = Vector2()
  const rightWorld = Vector2()

  const centerWorld = Vector2()
  const centerScreen = Vector2()

  function start() {
    sampleDirector()
  }

  function setFov(_fov) {
    fov = _fov
    transform.scale = fov
  }

  function worldToFrame(point, output) {
    return transform.invertPoint(point, output)
  }

  function frameToWorld(point, output) {
    return transform.transformPoint(point, output)
  }

  function worldToFrameScalar(scalar) {
    return transform.invertScalar(scalar)
  }

  function frameToWorldScalar(scalar) {
    return transform.transformScalar(scalar)
  }

  function worldToFrameDirection(direction, output) {
    return transform.invertDirection(direction, output)
  }

  function frameToWorldDirection(direction, output) {
    return transform.transformDirection(direction, output)
  }

  function worldToScreen(point, output, localTransform) {
    if (output) output.set(point)
    else output = point

    if (localTransform) localTransform.transformPoint(output)

    transform.invertPoint(output)
    screen.frameToScreen(output)

    return output
  }

  function screenToWorld(point, output, localTransform) {
    if (output) output.set(point)
    else output = point

    screen.screenToFrame(output)
    transform.transformPoint(output)

    if (localTransform) localTransform.invertPoint(output)

    return output
  }

  function worldToScreenDirection(input, output, localTransform) {
    if (output) output.set(input)
    else output = input

    if (localTransform) localTransform.transformDirection(output)

    transform.invertDirection(output)
    screen.frameToScreenDirection(output)

    return output
  }

  function screenToWorldDirection(input, output, localTransform) {
    if (output) output.set(input)
    else output = input

    screen.screenToFrameDirection(output)
    transform.transformDirection(output)

    if (localTransform) localTransform.invertDirection(output)

    return output
  }

  function worldToScreenScalar(scalar = 1) {
    const frameScalar = transform.invertScalar(scalar)
    return screen.transform.transformScalar(frameScalar)
  }

  function screenToWorldScalar(scalar = 1) {
    const frameScalar = screen.transform.invertScalar(scalar)
    return transform.transformScalar(frameScalar)
  }

  function worldToScreenCanvas(ctx, localTransform) {
    screen.transform.invertCanvas(ctx)
    ctx.scale(1, -1)
    transform.transformCanvas(ctx)

    if (localTransform) {
      localTransform.invertCanvas(ctx)
    }

    ctx.scale(1, -1)
  }

  function screenToWorldCanvas(ctx, localTransform) {
    ctx.scale(1, -1)

    if (localTransform) {
      localTransform.transformCanvas(ctx)
    }

    transform.invertCanvas(ctx)
    ctx.scale(1, -1)
    screen.transform.transformCanvas(ctx)
  }

  function computeCorners() {
    transform.transformPoint(screen.minFramePoint, lowerLeft)
    transform.transformPoint(screen.maxFramePoint, upperRight)
  }

  function sampleDirector() {
    let _activeDirector
    for (c of directors) {
      if (c.canControl()) {
        _activeDirector = c
        break
      }
    }

    if (activeDirector != _activeDirector) {
      if (activeDirector) activeDirector.stopControlling()
      if (_activeDirector) _activeDirector.startControlling()

      activeDirector = _activeDirector
    }

    alignToDirector()
  }

  function alignToDirector() {
    if (activeDirector) {
      offset.multiply(fov, scaledOffset)
      transform.position = activeDirector.cameraState.position
      transform.position.add(scaledOffset)
      setFov(activeDirector.cameraState.fov)
      // const offsetMargin = math.max(scaledOffset.x, scaledOffset.y)
      // setFov(activeDirector.cameraState.fov+offsetMargin)
    }
  }

  function addDirector(director) {
    directors.push(director)
  }

  let target = offset.clone()

  function tick() {
    computeCorners()
    sampleDirector()

    // Every n ticks, translate camera slightly then lerp to normal

    if (Math.random() > 1 - shake) {
      defaultOffset.add(
        Vector2(
          ((Math.random() - 0.5) * shake) / 2,
          ((Math.random() - 0.5) * shake) / 2,
        ),
        target,
      )
    }

    const timescale = globalScope.timescale ?? 1 // globalScope is cleared on map navigation, not sure why?
    offset.lerp(shake > 0 ? target : defaultOffset, 0.1 * timescale)
  }

  function drawLocal(ctx) {
    ctx.fillStyle = 'green'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // ctx.scale(size, size)

    ctx.font = '1px Roboto Mono'

    ctx.fillText('up', 0, 1)
    ctx.fillText('down', 0, -1)
    ctx.fillText('left', -1, 0)
    ctx.fillText('right', 1, 0)
  }

  function draw() {
    if (self.debug) {
      leftScreen.set(0, 0)
      rightScreen.set(0, screen.width)

      topScreen.set(0, screen.height)
      bottomScreen.set(0, 0)

      drawThrough(screen.ctx, drawLocal)
    }
  }

  function startRunning() {}

  function stopRunningLate() {}

  function drawThrough(ctx, drawCallback, localTransform) {
    ctx.save()
    worldToScreenCanvas(ctx, localTransform)
    drawCallback(ctx)
    ctx.restore()
  }

  function onResizeScreen() {
    computeCorners()
  }

  screen.resizeSubs.push(onResizeScreen)

  return self.mix({
    transform,
    screen,

    lowerLeft,
    upperRight,

    worldToFrame,
    frameToWorld,

    worldToFrameScalar,
    frameToWorldScalar,

    worldToFrameDirection,
    frameToWorldDirection,

    worldToScreen,
    screenToWorld,

    worldToScreenScalar,
    screenToWorldScalar,

    worldToScreenCanvas,
    screenToWorldCanvas,

    tick,
    draw,
    start,

    startRunning,
    stopRunningLate,

    drawThrough,

    addDirector,

    computeCorners,

    get fov() {
      return fov
    },
    set fov(v) {
      setFov(v)
    },

    get activeDirector() {
      return activeDirector
    },

    get position() {
      return transform.position
    },
    set position(v) {
      transform.position.set(v)
    },

    get rotation() {
      return rotation
    },
    set rotation(v) {
      transform.rotation = v
    },

    get shake() {
      return shake
    },
    set shake(v) {
      shake = v
    },

    get offset() {
      return defaultOffset
    },
    set offset(v) {
      defaultOffset.set(v)
    },
  })
}
