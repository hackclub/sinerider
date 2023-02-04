function TrackingDirector(spec) {
  const { self, screen, cameraState } = Director(spec, 'TrackingDirector')

  let { trackedEntities = [] } = spec

  const { camera, globalScope, transitions = [] } = spec

  let { minFov = 5, minFovMargin = 3, smoothing = 0.05 } = spec

  const targetState = CameraState({
    fov: minFov,
  })

  const minTrackPoint = Vector2()
  const maxTrackPoint = Vector2()

  let trackedEntityCount = 0

  const difference = Vector2()

  let transitionActive = false

  cameraState.set(targetState)

  function start() {
    snap()
  }

  let originalCameraOffset = camera.offset.clone()

  function tick() {
    trackEntities()

    let _transitionActive = false
    for (const transition of transitions) {
      if (_.inRange(targetState.position.x, ...transition.domain)) {
        minFov = transition.properties.minFov ?? minFov
        minFovMargin = transition.properties.minFovMargin ?? minFovMargin
        smoothing = transition.properties.smoothing ?? smoothing
        _transitionActive = true
        camera.offset = transition.properties.offset ?? camera.offset
      }
    }

    if (!_transitionActive && transitionActive) {
      minFov = spec.minFov
      minFovMargin = spec.minFovMargin
      smoothing = spec.smoothing
      camera.offset = originalCameraOffset
    }

    transitionActive = _transitionActive
  }

  function trackEntities() {
    targetState.fov = minFov
    targetState.position.set(0, 0)
    trackedEntityCount = 0

    minTrackPoint.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    maxTrackPoint.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)

    _.eachDeep(trackedEntities, trackEntity)

    minTrackPoint.add(maxTrackPoint, targetState.position)

    targetState.position.divide(2)

    cameraState.position.lerp(targetState.position, smoothing)

    targetState.fov = Math.max(
      Math.abs(maxTrackPoint.x - cameraState.position.x),
      Math.abs(maxTrackPoint.y - cameraState.position.y),
    )

    targetState.fov = Math.max(targetState.fov + minFovMargin, minFov)

    cameraState.fov = math.lerp(cameraState.fov, targetState.fov, smoothing)
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
