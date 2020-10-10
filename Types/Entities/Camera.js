// The Camera transforms world-space coordinates into Frame-space coordinates (see Screen.js for an explanation of the "Frame")
//
// The camera smoothly pans and zooms to keep all Sledders, Goals, and the Axes origin in view at all times.

function Camera(spec) {
  const self = Entity({
    name: 'Camera',
    ...spec
  })
  
  const transform = Transform(spec)
  
  let {
    screen,
    fov = 5,
    minFov = null,
    minFovMargin = 3,
    globalScope = {},
    smoothing = 0.05,
    goals = [],
    sledders = [],
  } = spec
  
  transform.scale = fov
  
  if (!minFov) minFov = fov
  
  const lowerLeft = Vector2()
  const upperRight = Vector2()
  
  const trackingOrigin = {
    transform: Transform()
  }
  
  const trackedPositionTarget = Vector2()
  const trackedPositionSmoothed = Vector2()
  
  const minTrackPoint = Vector2()
  const maxTrackPoint = Vector2()
  
  let trackedFovTarget = fov
  let trackedFovSmoothed = fov
  let trackedEntityCount = 0
  
  const difference = Vector2()
  
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
  
  function worldToScreen(point, output) {
    const framePoint = transform.invertPoint(point, output)
    framePoint.y *= -1
    return screen.transform.transformPoint(framePoint)
  }
  
  function screenToWorld(point, output) {
    const framePoint = screen.transform.invertPoint(point, output)
    framePoint.y *= -1
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
  
  function trackEntity(entity) {
    minTrackPoint.min(entity.transform.position)
    maxTrackPoint.max(entity.transform.position)
  }
  
  function trackEntities() {
    trackedFovTarget = minFov
    trackedPositionTarget.set(0, 0)
    trackedEntityCount = 0
    
    minTrackPoint.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    maxTrackPoint.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    
    trackEntity(trackingOrigin)
    _.each(goals, trackEntity)
    _.each(sledders, trackEntity)
    
    minTrackPoint.add(maxTrackPoint, trackedPositionTarget)
    trackedPositionTarget.divide(2)
    
    const s = globalScope.running ? smoothing : 1
    
    trackedPositionSmoothed.lerp(trackedPositionTarget, s)
    
    trackedFovTarget = Math.max(
      maxTrackPoint.x-trackedPositionSmoothed.x,
      maxTrackPoint.y-trackedPositionSmoothed.y
    )
    
    trackedFovTarget = Math.max(
      trackedFovTarget+minFovMargin,
      minFov
    )
    
    trackedFovSmoothed = math.lerp(trackedFovSmoothed, trackedFovTarget, s)
    
    setFov(trackedFovSmoothed)
    transform.position.set(trackedPositionSmoothed)
  }
  
  function tick() {
    trackEntities()
    computeCorners()
  }
  
  function draw() {
    
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    trackEntities()
  }
  
  function drawThrough(ctx, drawCallback, localTransform) {
    worldToScreenCanvas(ctx, localTransform)
    drawCallback(ctx)
    ctx.resetTransform()
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
    
    worldToScreen,
    screenToWorld,
    
    worldToScreenScalar,
    screenToWorldScalar,
    
    worldToScreenCanvas,
    screenToWorldCanvas,
    
    tick,
    draw,
    
    startRunning,
    stopRunning,
    
    drawThrough,
    
    get fov() {return fov},
    set fov(v) {setFov(fov)},
  })
}