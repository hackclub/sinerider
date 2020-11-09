// Is this stub "virtual" type really even necessary? I guess we'll find out!

function CameraController(spec, defaultName = 'CameraController') {
  const self = Component(spec, defaultName)
  
  const {
    screen,
    camera,
  } = spec
  
  let controlling = false
  
  const position = Vector2()
  let fov = 0
  
  function tick() {
    
  }
  
  function snap() {
    
  }
  
  function align() {
    position.set(camera.transform.position)
    fov = camera.fov
    
    console.log('Aligned Position: ', position.toString())
    console.log('Aligned FOV: ', fov)
  }
  
  function startControlling() {
    controlling = true
    
    console.log(`${self.name} is now controlling`)
  }
  
  function stopControlling() {
    controlling = false
  }
  
  function canControl() {
    return true
  }
  
  return self.mix({
    camera,
    screen,
    
    tick,
    
    canControl,
    startControlling,
    stopControlling,
    
    align,
    snap,
    
    get controlling() {return controlling},
    
    get position() {return position},
    set position(v) {position.set(v)},
    
    get fov() {return fov},
    set fov(v) {fov = v},
  })
}