function Director(spec, defaultName='Director') {
  const {
    self,
    screen,
    camera,
    globalScope,
  } = Entity(spec, defaultName)
  
  let {
  } = spec
  
  const cameraState = CameraState()

  camera.addDirector(self)
  
  function tick() {
    
  }
  
  function canControl() {
    // virtual function stub
    return true
  }
  
  function startControlling() {
    // virtual function stub
    console.log(self.name, ' is now controlling camera')
  }
  
  function stopControlling() {
    // virtual function stub
    console.log(self.name, ' is now controlling camera')
  }
  
  return self.mix({
    tick,
    
    cameraState,
    
    canControl,
    
    startControlling,
    stopControlling,
  })
}