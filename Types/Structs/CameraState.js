function CameraState(spec = {}) {
  const self = {}

  let { rotation = 0, fov = 10 } = spec

  const position = spec.position ? Vector2(spec.position) : Vector2(spec)

  function set(state) {
    position.x = state.position ? state.position.x : state.x || 0
    position.y = state.position ? state.position.y : state.y || 0
    roation = state.rotation || 0
    fov = state.fov || 10
  }

  function lerp(b, progress, output, smooth = true) {
    if (!output) output = self

    if (smooth) progress = math.smooth(progress)

    position.lerp(b.position, progress, output.position)

    output.rotation = math.modLerp(rotation, b.rotation, progress, TAU, true)

    output.fov = math.lerp(fov, b.fov, progress)
  }

  function toString() {
    return `{position: ${position.toString()}, rotation: ${rotation}, fov: ${fov}}`
  }

  return _.mixIn(self, {
    set,
    lerp,

    toString,

    get position() {
      return position
    },
    set position(v) {
      position.set(v)
    },

    get x() {
      return position.x
    },
    set x(v) {
      position.x = _.isNumber(v) ? v : 0
    },

    get y() {
      return position.y
    },
    set y(v) {
      position.y = _.isNumber(v) ? v : 0
    },

    get rotation() {
      return rotation
    },
    set rotation(v) {
      rotation = _.isNumber(v) ? v : 0
    },

    get fov() {
      return fov > 0 ? fov : 10
    },
    set fov(v) {
      fov = _.isNumber(v) ? v : 10
    },
  })
}
