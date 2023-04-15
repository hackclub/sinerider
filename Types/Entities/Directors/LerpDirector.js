function LerpDirector(spec) {
  const {
    self,
    camera,
    screen,
    bounds,
    cameraState,
    playerPosition,
    tick: baseTick,
    awake: baseAwake,
  } = Director(spec, 'LerpDirector')

  let {} = spec

  const state0 = CameraState(spec.state0 || {})
  const state1 = CameraState(spec.state1 || {})

  const point0 = spec.point0
    ? Vector2(spec.point0)
    : Vector2(bounds.min.x, bounds.center.y)

  const point1 = spec.point1
    ? Vector2(spec.point1)
    : Vector2(bounds.max.x, bounds.center.y)

  let progress = 0

  function awake() {
    baseAwake()
    computeState()
  }

  function tick() {
    baseTick()
    computeState()
  }

  function computeState() {
    // TODO: Interpolate from both x and y components, as god intended
    progress = playerPosition.x
    progress = math.unlerp(point0.x, point1.x, progress)
    progress = math.clamp01(progress)

    state0.lerp(state1, progress, cameraState)
  }

  function canControl() {
    const c = point1.x > playerPosition.x
    // console.log(`Can control lerp director: ${c}`, state0, state1, progress)
    return c
  }

  return self.mix({
    awake,
    tick,

    canControl,
  })
}
