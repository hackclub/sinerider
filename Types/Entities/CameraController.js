function CameraController(spec) {
  const {
    self,
    screen,
    camera,
    globalScope,
  } = Entity(spec, 'Camera Controller')
  
  let {
  } = spec
  
  function tick() {
    
  }
  
  return self.mix({
    tick,
  })
}