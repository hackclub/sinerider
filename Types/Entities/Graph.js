function Graph(spec) {
  const self = Entity(spec)
  const sampler = Sampler(spec)
  
  let {
    sampleCount = 65,
    screen,
    camera,
    globalScope,
  } = spec
  
  const ctx = screen.ctx
  
  const samples = sampler.generateSampleArray(sampleCount)
  
  // Directly assigning the global scope as the local scope for now
  const scope = globalScope

  const screenSpaceSample = Vector2()
  
  const minWorldPoint = Vector2()
  const maxWorldPoint = Vector2()
  
  resample()
  
  function tick() {
    resample()
  }
  
  function draw() {
    ctx.beginPath()
    
    camera.worldToScreen(samples[0], screenSpaceSample)
    ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)
    
    for (let i = 1; i < sampleCount; i++) {
      camera.worldToScreen(samples[i], screenSpaceSample)
      
      ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
    }
    
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 4
    ctx.stroke()
    
    ctx.lineTo(screen.width, screen.height)
    ctx.lineTo(0, screen.height)
    
    ctx.fillStyle = '#f8f8f8'
    ctx.fill()
  }
  
  function resample() {
    camera.frameToWorld(screen.minFramePoint, minWorldPoint)
    camera.frameToWorld(screen.maxFramePoint, maxWorldPoint)
    
    sampler.sampleRange(scope, samples, sampleCount, 'x',  minWorldPoint[0], maxWorldPoint[0])
  }
  
  function onResizeScreen() {
    resample()
  }
  
  function startRunning() {
    
  }
  
  function stopRunning() {
    resample()
  }
  
  screen.resizeSubs.push(onResizeScreen)
  
  return self.mix({
    ...sampler,
    
    get expression() {
      return sampler.expression
    },
    set expression(v) {
      sampler.expression = v
    },
    
    tick,
    draw,
    
    startRunning,
    stopRunning,
  })
}