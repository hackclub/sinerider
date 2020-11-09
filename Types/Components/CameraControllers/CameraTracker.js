function CameraTracker(spec) {
  const self = CameraController(spec, 'CameraTracker')
  
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
  
  const positionTarget = Vector2()
  
  const minTrackPoint = Vector2()
  const maxTrackPoint = Vector2()
  
  let fovTarget = minFov
  let trackedEntityCount = 0
  
  const difference = Vector2()
  
  function tick() {
    trackEntities()
  }
  
  function trackEntities() {
    fovTarget = minFov
    positionTarget.set(0, 0)
    trackedEntityCount = 0
    
    minTrackPoint.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    maxTrackPoint.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    
    _.eachDeep(trackedEntities, trackEntity)
    
    minTrackPoint.add(maxTrackPoint, positionTarget)
    positionTarget.divide(2)
    
    self.position.lerp(positionTarget, smoothing)
    
    fovTarget = Math.max(
      maxTrackPoint.x-self.position.x,
      maxTrackPoint.y-self.position.y
    )
    
    fovTarget = Math.max(
      fovTarget+minFovMargin,
      minFov
    )
    
    self.fov = math.lerp(self.fov, fovTarget, smoothing)
  }
  
  function trackEntity(entity) {
    minTrackPoint.min(entity.transform.position)
    maxTrackPoint.max(entity.transform.position)
  }
  
  function draw() {
    
  }
  
  function snap() {
    trackEntities()
    self.position = positionTarget
    trackEntities()
    self.fov = fovTarget
    
    console.log('Snapped Position: ', self.position.toString())
    console.log('Snapped FOV: ', self.fov)
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    
  }
  
  return self.mix({
    tick,
    draw,
    
    snap,
    
    startRunning,
    stopRunning,
  })
}