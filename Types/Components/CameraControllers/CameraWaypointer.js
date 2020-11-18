function CameraWaypointer(spec) {
  const self = CameraController({
    ...spec,
    entityPath: 'waypointer',
  }, 'CameraWaypointer')
  
  const {
    camera,
  } = spec
  
  let {
  } = spec
  
  let fromPoint = null
  let toPoint = null
  let callback = null
  
  let transitDuration = 1
  let transitProgress = 0
  let transitComplete = false
  
  function tick() {
    if (transitProgress == 1 && !transitComplete) {
      console.log(`Transit to waypoint complete`)
      transitComplete = true

      if (callback)
        callback()
    }
    
    if (transitDuration == 0)
      transitProgress = 1
    else if (toPoint)
      transitProgress += camera.tickDelta/transitDuration
    
    transitProgress = math.clamp01(transitProgress)
    
    if (fromPoint && toPoint && !transitComplete) {
      // console.log(`Transiting... ${transitProgress}`)
      lerpWaypoints(fromPoint, toPoint, transitProgress, self)
    }
  }
  
  function canControl() {
    return fromPoint && toPoint
  }
  
  function lerpWaypoints(a, b, progress, output, smooth=true) {
    if (smooth)
      progress = math.smooth(progress)
    
    if (_.has(b, 'position'))
      a.position.lerp(b.position, progress, output.position)
    
    if (_.has(b, 'rotation'))
      output.rotation = math.modLerp(a.rotation, b.rotation, progress, TAU, true)
      
    if (_.has(b, 'fov'))
      output.fov = math.lerp(a.fov, b.fov, progress)
  }
  
  function moveTo(waypoint, duration = 0, cb = null) {
    fromPoint = {
      position: Vector2(camera.transform.position),
      rotation: camera.transform.rotation,
      fov: camera.fov,
    }
    
    // console.log(`Moving to waypoint {${waypoint.position.toString()}, ${waypoint.fov}} over ${duration} seconds`)
    
    toPoint = waypoint
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
  
  function draw() {
    
  }
  
  function snap() {
    
  }
  
  function align() {
    
  }
  
  return self.mix({
    tick,
    draw,
    
    snap,
    align,
    canControl,
    
    moveTo,
    release,
  })
}