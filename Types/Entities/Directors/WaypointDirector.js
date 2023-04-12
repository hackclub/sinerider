function WaypointDirector(spec) {
  const { self, screen, cameraState } = Director(spec, 'WaypointDirector')

  const { camera } = spec

  let {} = spec

  let fromPoint = null
  let toPoint = null
  let callback = null

  let transitDuration = 1
  let transitProgress = 0
  let transitComplete = false

  function tick() {
    if (transitProgress == 1 && !transitComplete) {
      transitComplete = true

      if (callback) callback()
    }

    if (transitDuration == 0) transitProgress = 1
    else if (toPoint) transitProgress += camera.tickDelta / transitDuration

    transitProgress = math.clamp01(transitProgress)

    if (fromPoint && toPoint && !transitComplete) {
      fromPoint.lerp(toPoint, transitProgress, cameraState)
    }
  }

  function canControl() {
    return !transitComplete
  }

  function lerpWaypoints(a, b, progress, output, smooth = true) {
    if (smooth) progress = math.smooth(progress)

    a.position.lerp(b.position, progress, output.position)

    output.rotation = math.modLerp(a.rotation, b.rotation, progress, TAU, true)

    output.fov = math.lerp(a.fov, b.fov, progress)
  }

  function moveTo(waypointA, waypointB, duration = 0, cb = null) {
    fromPoint = CameraState(waypointA || camera)
    toPoint = CameraState(waypointB)

    transitDuration = duration
    transitProgress = 0
    transitComplete = false
    callback = cb

    lerpWaypoints(fromPoint, toPoint, 0, self)
  }

  function release() {
    fromPoint = null
    toPoint = null
  }

  function draw() {}

  return self.mix({
    tick,
    draw,

    canControl,

    moveTo,
    release,

    get toPoint() {
      return toPoint
    },
  })
}
