function Director(spec, defaultName = 'Director') {
  const { self, screen, camera } = Entity(spec, defaultName)

  let { globalScope } = spec

  const cameraState = CameraState()
  const bounds = spec.bounds ? Bounds(spec.bounds) : null

  camera.addDirector(self)

  const playerPosition = Vector2()

  function start() {
    playerPosition.set(globalScope.p.re, globalScope.p.im)
  }

  function tick() {
    playerPosition.set(globalScope.p.re, globalScope.p.im)
  }

  function canControl() {
    // By default, controllers may activate if player is within bounds (if bounds are specified) or may always be active (if bounds are unspecified)
    return bounds ? bounds.contains(playerPosition) : true
  }

  function startControlling() {
    // virtual function stub
  }

  function stopControlling() {
    // virtual function stub
  }

  return self.mix({
    tick,

    bounds,
    cameraState,
    playerPosition,

    canControl,

    startControlling,
    stopControlling,

    get fov() {
      return cameraState.fov
    },
    get position() {
      return cameraState.position
    },
    get rotation() {
      return cameraState.rotation
    },
  })
}
