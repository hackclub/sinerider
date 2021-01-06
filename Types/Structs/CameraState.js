function CameraState(spec) {
  let {
    rotation = 0,
    fov = 10,
  } = spec
  
  const position = spec.position ?
    Vector2(spec.position) : Vector2(spec)
    
  function set(state) {
    position.x = state.position ?
      state.position.x : (state.x || 0)
    position.y = state.position ?
      state.position.y : (state.y || 0)
    roation = state.rotation || 0
    fov = state.fov || 10
  }
    
  return {
    set,
    position,
    
    get x() {return position.x},
    set x(v) {position.x = v},
    
    get y() {return position.y},
    set y(v) {position.y = v},
    
    get rotation() {return rotation},
    set rotation(v) {rotation = v},
    
    get fov() {return fov},
    set fov(v) {fov = v},
  }
}