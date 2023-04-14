function TrackingDirector(spec) {
  const { self, screen, cameraState } = Director(spec, 'TrackingDirector')

  let { trackedEntities = [] } = spec

  const { camera, globalScope, transitions = [] } = spec

  let { minFov = 5, minFovMargin = 3, smoothing = 0.02 } = spec

  const targetState = CameraState({
    fov: minFov,
  })

  const minTrackPoint = Vector2()
  const maxTrackPoint = Vector2()
  const trackSpan = Vector2()

  let trackedEntityCount = 0

  const difference = Vector2()

  let transitionActive = false
  let lastTransition = null

  cameraState.set(targetState)

  function start() {
    snap()
  }

  let originalCameraOffset = camera.offset.clone()

  function tick() {
    trackEntities()

    transitionActive = false
    for (const transition of transitions) {
      if (_.inRange(targetState.position.x, ...transition.domain)) {
        lastTransition = transition
        transitionActive = true

        const transitionSmoothing =
          transition.properties.transitionSmoothing ?? 0.05

        minFov = math.lerp(
          minFov,
          transition.properties.minFov ?? minFov,
          transitionSmoothing,
        )
        minFovMargin = math.lerp(
          minFovMargin,
          transition.properties.minFovMargin ?? minFovMargin,
          transitionSmoothing,
        )
        smoothing = math.lerp(
          smoothing,
          transition.properties.smoothing ?? smoothing,
          transitionSmoothing,
        )
      }
    }

    if (lastTransition && !transitionActive) {
      const transitionSmoothing =
        lastTransition.properties.transitionSmoothing ?? 0.05
      minFov = math.lerp(minFov, spec.minFov ?? 5, transitionSmoothing)
      minFovMargin = math.lerp(
        minFovMargin,
        spec.minFovMargin ?? 3,
        transitionSmoothing,
      )
      smoothing = math.lerp(
        smoothing,
        spec.smoothing ?? 0.05,
        transitionSmoothing,
      )
    }
  }

  function trackEntities() {
    targetState.fov = minFov
    targetState.position.set(0, 0)
    trackedEntityCount = 0

    minTrackPoint.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    maxTrackPoint.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)

    _.eachDeep(trackedEntities, trackEntity)

    maxTrackPoint.subtract(minTrackPoint, trackSpan)

    // Bias for showing more background. Maybe should be configurable?
    maxTrackPoint.y += 7

    // Correct for space occupied by equation bar
    const equationRatio = ui.expressionEnvelope.clientHeight / screen.height
    minTrackPoint.y -= 4 * trackSpan.y * equationRatio

    minTrackPoint.add(maxTrackPoint, targetState.position)

    targetState.position.divide(2)

    const ySpan = Math.abs(maxTrackPoint.y - minTrackPoint.y)
    const xSpan = Math.abs(maxTrackPoint.x - minTrackPoint.x)
    let span = Math.max(xSpan, ySpan)
    span = Math.max(span + minFovMargin, minFov)

    targetState.position.y += (0.5 * (span - ySpan)) / 2

    const positionSmoothing = math.remap(
      0,
      2,
      smoothing,
      1,
      targetState.position.distance(cameraState.position),
      true,
    )

    cameraState.position.lerp(targetState.position, positionSmoothing)

    targetState.fov = Math.max(
      Math.abs(maxTrackPoint.x - cameraState.position.x),
      Math.abs(maxTrackPoint.y - cameraState.position.y),
    )

    targetState.fov = Math.max(targetState.fov + minFovMargin, minFov)

    const fovSmoothing = math.remap(
      0.5,
      5,
      smoothing,
      1,
      Math.abs(cameraState.fov - targetState.fov),
      true,
    )

    cameraState.fov = math.lerp(cameraState.fov, targetState.fov, fovSmoothing)
  }

  function trackEntity(entity) {
    if (!entity.activeInHierarchy) return

    minTrackPoint.min(entity.transform.position)
    maxTrackPoint.max(entity.transform.position)

    if (entity.trackPoints) {
      for (point of entity.trackPoints) {
        minTrackPoint.min(point)
        maxTrackPoint.max(point)
      }
    }
  }

  function draw() {}

  function snap() {
    trackEntities()
    cameraState.set(targetState)
    trackEntities()
    cameraState.set(targetState)

    if (self.debug || true) {
    }
  }

  function setGraphExpression() {
    snap()
  }

  function startRunning() {}

  function stopRunning() {
    snap()
  }

  return self.mix({
    start,

    tick,
    draw,

    startRunning,
    stopRunning,

    setGraphExpression,
  })
}
