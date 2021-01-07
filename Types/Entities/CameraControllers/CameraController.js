function CameraController(spec, defaultName='CameraController') {
  const {
    self,
    screen,
    camera,
    globalScope,
  } = Entity(spec, defaultName)
  
  let {
  } = spec
  
  const cameraState = CameraState()
  
  function tick() {
    
  }
  
  function getCanControl() {
    // virtual function stub
    return false
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
    
    getCanControl,
    get canControl() {return self.getCanControl()},
    
    startControlling,
    stopControlling,
  })
}