function PathGoal(spec) {
  const {
    self,
    screen,
    camera,
    transform,
    ctx,
  } = Goal(spec, 'Path Goal')
  
  const base = _.mix(self)
  
  let {
    size = 1,
    globalScope,
    graph,
    expression: pathExpression = 'sin(x)',
    pathX = 4,
    pathY = 0,
  } = spec
  
  const trackPoints = []
  
  const bottom = Vector2(0, -size/2)
  const bottomWorld = Vector2()
  
  const slopeTangent = Vector2()
  
  const pathPosition = Vector2()
  const pathPositionWorld = Vector2()
  
  const pathStart = Vector2()
  const pathEnd = Vector2(pathX, 0)
  
  const pathMin = Vector2()
  const pathMax = Vector2()
  
  const pathStartWorld = Vector2()
  const pathEndWorld = Vector2()
  
  const pathStartScreen = Vector2()
  const pathEndScreen = Vector2()
  
  const pathMinWorld = Vector2()
  const pathMaxWorld = Vector2()
  
  const pathSign = Math.sign(pathX)
  const pathSpan = Math.abs(pathX)
  
  const maxPathResetSpeed = 3
  let pathResetSpeed = 0
  let pathProgress = 0
  
  const outerColor = Color()
  const outerColors = [
    Color('#111111'),
    Color('#444444'),
    Color('#333333'),
  ]
  
  const shape = Circle({
    transform,
    center: Vector2(0, 0),
    radius: size/2,
  })
  
  // Establish path origin in world space
  transform.transformPoint(pathStart, pathStartWorld)
  transform.transformPoint(pathEnd, pathEndWorld)
  
  const pathGraph = Graph({
    name: 'Path Graph',
    parent: self,
    globalScope,
    expression: pathExpression,
    fill: false,
    freeze: true,
    scaleStroke: true,
    bounds: [pathStartWorld.x, pathEndWorld.x],
    sampleCount: Math.round(pathSpan*4),
    strokeWidth: 1,
    strokeColor: '#888',
    dashed: true,
    dashSettings: [0.5, 0.5],
  })
  
  // HACK: Hijack the graph's draw method to draw it behind the goal object
  const drawPathGraph = pathGraph.draw.bind(pathGraph)
  pathGraph.draw = () => {}
  
  // Sample start/end points
  pathStartWorld.y = pathGraph.sample('x', pathStartWorld.x)
  pathEndWorld.y = pathGraph.sample('x', pathEndWorld.x)
  
  // Move transform to start of path
  transform.position = pathStartWorld
  
  // Compute world-space points
  transform.invertPoint(pathStartWorld, pathStart)
  transform.invertPoint(pathEndWorld, pathEnd)
  
  pathPosition.set(pathStart)
  transform.transformPoint(pathPosition, pathPositionWorld)
  
  // Compute min/max points
  pathStart.min(pathEnd, pathMin)
  pathStart.max(pathEnd, pathMax)
  
  pathStartWorld.min(pathEndWorld, pathMinWorld)
  pathStartWorld.max(pathEndWorld, pathMaxWorld)
  
  trackPoints.push(pathStartWorld)
  trackPoints.push(pathEndWorld)

  function tick() {
    base.tick()
    tickPath()
  }
  
  function tickPath() {
    if (!self.completed && !self.failed) {
      if (self.triggered) {
        pathPositionWorld.x += self.triggeringSledderDelta.x
        pathResetSpeed = 0
      }
      else {
        pathPositionWorld.x -= pathSign*self.tickDelta*pathResetSpeed
        pathResetSpeed = Math.min(pathResetSpeed+self.tickDelta*6, maxPathResetSpeed)
      }
      pathPositionWorld.x = math.clamp(pathMinWorld.x, pathMaxWorld.x, pathPositionWorld.x)
      
      pathProgress = math.unlerp(pathStartWorld.x, pathEndWorld.x, pathPositionWorld.x)
      
      pathPositionWorld.y = pathGraph.sample('x', pathPositionWorld.x)
      transform.invertPoint(pathPositionWorld, pathPosition)
      shape.center = pathPosition
    }
  }
  
  
  function checkComplete() {
    if (self.triggered && !self.completed && !self.failed) {
      if (!self.available)
        self.fail()
      else if (pathProgress == 1)
        self.complete()
    }
  }
  
  function drawLocal() {
    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle
    
    ctx.lineWidth = self.strokeWidth
    
    ctx.beginPath()
    ctx.arc(pathPosition.x, -pathPosition.y, size/2, 0, TAU)
    ctx.fill()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(pathEnd.x, -pathEnd.y, size/2, 0, TAU)
    ctx.strokeStyle = '#888'
    // ctx.stroke()
    
    if (self.debug) {
      ctx.font = '1px Roboto Mono'
      ctx.fillStyle = 'green'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('position: '+pathPosition.toString(), pathPosition.x, -pathPosition.y)
      ctx.fillText('start: '+pathStart.toString(), pathStart.x, -pathStart.y)
      ctx.fillText('end: '+pathEnd.toString(), pathEnd.x, -pathEnd.y)
    }
  }
  
  function draw() {
    // Set alpha to fade with flash if completed
    self.setAlphaByFlashFade()
    
    camera.worldToScreen(pathStartWorld, pathStartScreen)
    camera.worldToScreen(pathEndWorld, pathEndScreen)
    
    let outerStyle = ctx.createLinearGradient(pathStartScreen.x, 0, pathEndScreen.x, 0)
    
    for (let i = 0; i < outerColors.length; i++) {
      let p = i/(outerColors.length-1)
      outerColor.set(outerColors[i]).lerp(self.flashWhite, self.flashProgress)
      outerStyle.addColorStop(p, outerColor.hex)
    }
    
    let innerStyle = ctx.createLinearGradient(pathStartScreen.x, 0, pathEndScreen.x, 0)
    
    innerStyle.addColorStop(0, '#6F0')
    innerStyle.addColorStop(pathProgress/2, '#4F6')
    innerStyle.addColorStop(pathProgress, '#4F6')
    innerStyle.addColorStop(math.clamp01(pathProgress+0.02), '#FFF')
    
    pathGraph.strokeWidth = 0.4
    pathGraph.strokeColor = outerStyle
    pathGraph.dashed = false
    drawPathGraph()
    
    pathGraph.strokeWidth = 0.2
    pathGraph.strokeColor = innerStyle
    pathGraph.dashed = true
    drawPathGraph()
    
    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()
    
    // Reset alpha
    ctx.globalAlpha = 1
    
    if (self.debug) {
      shape.draw(ctx, camera)
      
      if (dynamic)
        rigidbody.draw(ctx)
    }
  }
  
  function reset() {
    base.reset()
    
    pathPosition.set(pathStart)
    pathPositionWorld.set(pathStartWorld)
  }
  
  return self.mix({
    transform,
    
    tick,
    draw,
    
    reset,
    
    checkComplete,
    
    trackPoints,
    shape,
    
    get completedProgress() {return pathProgress},
  })
}