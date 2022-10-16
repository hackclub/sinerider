function TrackingDirector(spec) {
  const {
    self,
    screen,
    cameraState,
  } = Director(spec, 'TrackingDirector')

  const {
    camera,
    trackedEntities = [],
    globalScope,
  } = spec

  let {
    minFov = 5,
    minFovMargin = 3,
    smoothing = 0.05,
  } = spec

  const targetState = CameraState({
    fov: minFov,
  })

  const minTrackPoint = Vector2()
  const maxTrackPoint = Vector2()

  let trackedEntityCount = 0

  const difference = Vector2()

  cameraState.set(targetState)

  function start() {
    snap()
  }

  function tick() {
    trackEntities()
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

    console.log('camera state', cameraState.position.x.toFixed(2), cameraState.position.y.toFixed(2),
      'max track point', maxTrackPoint.x.toFixed(2), maxTrackPoint.y.toFixed(2),
      'min track point', minTrackPoint.x.toFixed(2), minTrackPoint.y.toFixed(2),
      'target fov', targetState.fov,
      'camera fov', cameraState.fov)

    targetState.fov = Math.max(
      maxTrackPoint.x-cameraState.position.x,
      maxTrackPoint.y-cameraState.position.y
    )

    targetState.fov = Math.max(
      targetState.fov+minFovMargin,
      minFov
    )

    console.log('Setting camera state fov; current:', cameraState.fov, 'target:', targetState.fov)

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

  function draw() {

  }

  function snap() {
    console.log('SNAPPING')
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

  function startRunning() {

  }

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