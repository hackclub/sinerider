function Graph(spec) {
  const {
    self,
    screen,
    camera,
  } = Entity(spec, 'Graph')
  
  let {
    sampleCount = 129,
    globalScope,
    colors = Colors.biomes.alps,
    bounds,
    freeze = false,
    fill = true,
    stroke = true,
    dashed = false,
    dashOffset = 0,
    dashSettings = [0.5, 0.5],
  } = spec
  
  let {
    strokeColor = colors.groundStroke,
    strokeWidth = colors.groundStrokeWidth,
    fillColor = colors.groundFill,
  } = spec
  
  const ctx = screen.ctx
  
  const undashedSettings = []
  const dashSettingsScreen = [0, 0]
  
  const sampler = Sampler(spec)
  const samples = sampler.generateSampleArray(sampleCount)
  
  // Directly assigning the global scope as the local scope for now
  const scope = globalScope

  const screenSpaceSample = Vector2()
  
  const minWorldPoint = Vector2()
  const maxWorldPoint = Vector2()
  
  resample()
  
  function tick() {
    if (!freeze)
      resample()
  }
  
  function draw() {
    ctx.save()
    
    const worldToScreenScalar = camera.worldToScreenScalar()
    
    if (fill) {
      ctx.beginPath()
      camera.worldToScreen(samples[0], screenSpaceSample)
      ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)
      
      for (let i = 1; i < sampleCount; i++) {
        camera.worldToScreen(samples[i], screenSpaceSample)
        ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
      }
      
      ctx.lineTo(screen.width, screen.height)
      ctx.lineTo(0, screen.height)
      
      ctx.fillStyle = fillColor
      ctx.fill()
      
      ctx.clip()
    }
    
    if (stroke) {
      ctx.beginPath()
      
      camera.worldToScreen(samples[0], screenSpaceSample)
      ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)
      
      for (let i = 1; i < sampleCount; i++) {
        camera.worldToScreen(samples[i], screenSpaceSample)
        ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
      }
      
      dashSettingsScreen[0] = dashSettings[0]*worldToScreenScalar
      dashSettingsScreen[1] = dashSettings[1]*worldToScreenScalar
      
      ctx.setLineDash(dashed ? dashSettingsScreen : undashedSettings)
      ctx.dashOffset = dashOffset
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth || 1
      ctx.stroke()
    }
    
    ctx.restore()
  }
  
  function resample() {
    camera.frameToWorld(screen.minFramePoint, minWorldPoint)
    camera.frameToWorld(screen.maxFramePoint, maxWorldPoint)
    
    let minX
    let maxX
    
    if (bounds) {
      minX = bounds[0]
      maxX = bounds[1]
    }
    else {
      minX = minWorldPoint[0]
      maxX = maxWorldPoint[0]
    }
    
    sampler.sampleRange(scope, samples, sampleCount, 'x',  minX, maxX)
  }
  
  function onResizeScreen() {
    resample()
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    resample()
  }
  
  if (!bounds)
    screen.resizeSubs.push(onResizeScreen)
  
  return self.mix({
    ...sampler,
    
    tick,
    draw,
    
    startRunning,
    stopRunning,
    
    get expression() {return sampler.expression},
    set expression(v) {sampler.expression = v},
    
    get strokeWidth() {return strokeWidth},
    set strokeWidth(v) {strokeWidth = v},
    
    get strokeColor() {return strokeColor},
    set strokeColor(v) {strokeColor = v},
    
    get fillColor() {return fillColor},
    set fillColor(v) {fillColor = v},
  })
}