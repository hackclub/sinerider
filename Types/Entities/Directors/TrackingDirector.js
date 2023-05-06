function TrackingDirector(spec) {
  const { self, screen, cameraState, parent } = Director(
    spec,
    'TrackingDirector',
  )

  let { trackedEntities = [] } = spec

  const { camera, globalScope, transitions = [] } = spec

  let {
    minFov = 5,
    minFovMargin = 3,
    smoothing = 0.02,
    verticalBias = 7,
  } = spec

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

  function awake() {
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
        verticalBias = math.lerp(
          verticalBias,
          transition.properties.verticalBias ?? verticalBias,
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
      verticalBias = math.lerp(
        verticalBias,
        spec.verticalBias ?? 7,
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

    if (trackedEntityCount == 0) {
      minTrackPoint.set()
      maxTrackPoint.set()
    }

    maxTrackPoint.subtract(minTrackPoint, trackSpan)

    // Bias for showing more background. Maybe should be configurable?
    maxTrackPoint.y += verticalBias

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

    cameraState.position.lerp(targetState.position, smoothing)

    targetState.fov = Math.max(
      Math.abs(maxTrackPoint.x - cameraState.position.x),
      Math.abs(maxTrackPoint.y - cameraState.position.y),
    )

    targetState.fov = Math.max(targetState.fov + minFovMargin, minFov)

    cameraState.fov = math.lerp(cameraState.fov, targetState.fov, smoothing)
  }

  function trackEntity(entity) {
    if (!entity.active) return

    minTrackPoint.min(entity.transform.position)
    maxTrackPoint.max(entity.transform.position)

    if (entity.trackPoints) {
      for (point of entity.trackPoints) {
        minTrackPoint.min(point)
        maxTrackPoint.max(point)
      }
    }

    trackedEntityCount++
  }

  function draw() {}

  function snap() {
    trackEntities()
    cameraState.set(targetState)
    trackEntities()
    cameraState.set(targetState)
  }

  function setGraphExpression() {
    snap()
  }

  function startRunning() {}

  function stopRunning() {
    snap()
  }

  return self.mix({
    awake,

    tick,
    draw,

    startRunning,
    stopRunning,

    setGraphExpression,

    get trackedEntities() {
      return trackedEntities
    },
  })
}
