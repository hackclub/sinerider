// The Camera transforms world-space coordinates into Frame-space coordinates (see Screen.js for an explanation of the "Frame")
//
// The camera smoothly pans and zooms to keep all Sledders, Goals, and the Axes origin in view at all times.

function Camera(spec) {
  const self = Entity(spec, 'Camera')
  
  const transform = Transform(spec)
  
  let {
    screen,
    fov = 5,
    globalScope = {},
  } = spec
  
  const controllers = self.addComponents(spec.controllers, {
    screen,
    camera: self,
    globalScope,
  })
  
  let activeController
  
  transform.scale = fov
  
  const lowerLeft = Vector2()
  const upperRight = Vector2()
  
  function start() {
    tickControllers()
    snap()
  }
  
  function setFov(_fov) {
    fov = _fov
    transform.scale = fov
  }
  
  function worldToFrame(point, output) {
    return transform.invertPoint(point, output)
  }
  
  function frameToWorld(point, output) {
    return transform.transformPoint(point, output)
  }
  
  function worldToFrameScalar(scalar) {
    return transform.invertScalar(scalar)
  }
  
  function frameToWorldScalar(scalar) {
    return transform.transformScalar(scalar)
  }
  
  function worldToFrameDirection(direction, output) {
    return transform.invertDirection(direction, output)
  }
  
  function frameToWorldDirection(direction, output) {
    return transform.transformDirection(direction, output)
  }
  
  function worldToScreen(point, output) {
    const framePoint = transform.invertPoint(point, output)
    return screen.frameToScreen(framePoint)
  }
  
  function screenToWorld(point, output) {
    const framePoint = screen.screenToFrame(point, output)
    return transform.transformPoint(framePoint)
  }
  
  function worldToScreenScalar(scalar) {
    const frameScalar = transform.invertScalar(scalar)
    return screen.transform.transformScalar(frameScalar)
  }
  
  function screenToWorldScalar(scalar) {
    const frameScalar = screen.transform.invertScalar(scalar)
    return transform.transformScalar(frameScalar)
  }
  
  function worldToScreenCanvas(ctx, localTransform) {
    ctx.translate(0, screen.height)
    ctx.scale(1, -1)
    
    screen.transform.invertCanvas(ctx)
    transform.transformCanvas(ctx)
    
    if (localTransform) {
      localTransform.invertCanvas(ctx)
    }
    
    ctx.scale(1, -1)
  }
  
  function screenToWorldCanvas(ctx, localTransform) {
    ctx.scale(1, -1)
    
    if (localTransform) {
      localTransform.transformCanvas(ctx)
    }
    
    transform.invertCanvas(ctx)
    screen.transform.transformCanvas(ctx)

    ctx.scale(1, -1)
    ctx.translate(0, -screen.height)
  }
  
  function computeCorners() {
    transform.transformPoint(screen.minFramePoint, lowerLeft)
    transform.transformPoint(screen.maxFramePoint, upperRight)
  }
  
  function tickControllers() {
    let _activeController
    for (c of controllers) {
      if (c.canControl()) {
        _activeController = c
        break
      }
    }
    
    if (activeController != _activeController) {
      if (activeController)
        activeController.stopControlling()
      if (_activeController)
        _activeController.startControlling()
        
      activeController = _activeController
      align()
    }
    
    if (activeController) {
      transform.position = activeController.position
      setFov(activeController.fov)
    }
  }
  
  function snap() {
    if (activeController) {
      activeController.snap()
      
      transform.position = activeController.position
      setFov(activeController.fov)
    
      console.log('Camera snapped to Position: ', transform.position.toString())
      console.log('Camera snapped to FOV: ', fov)
    }
  }
  
  function align() {
    if (activeController)
      activeController.align()
  }
  
  function tick() {
    computeCorners()
    tickControllers()
    // console.log('Camera Position: ', transform.position.toString())
    // console.log('Camera FOV: ', fov)
  }
  
  function draw() {
    
  }
  
  function startRunning() {
    
  }
  
  function stopRunningLate() {
    snap()
  }
  
  function drawThrough(ctx, drawCallback, localTransform) {
    ctx.save()
    worldToScreenCanvas(ctx, localTransform)
    drawCallback(ctx)
    ctx.restore()
  }
  
  function onResizeScreen() {
    computeCorners()
  }
  
  screen.resizeSubs.push(onResizeScreen)
  
  return self.mix({
    transform,
    screen,
    
    lowerLeft,
    upperRight,
    
    worldToFrame,
    frameToWorld,
    
    worldToFrameScalar,
    frameToWorldScalar,
    
    worldToFrameDirection,
    frameToWorldDirection,
    
    worldToScreen,
    screenToWorld,
    
    worldToScreenScalar,
    screenToWorldScalar,
    
    worldToScreenCanvas,
    screenToWorldCanvas,
    
    tick,
    draw,
    start,
    
    startRunning,
    stopRunningLate,
    
    drawThrough,
    
    get fov() {return fov},
    set fov(v) {setFov(fov)},
  })
}