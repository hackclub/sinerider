function Graph(spec) {
  const { self, screen, camera, ctx } = Entity(spec, 'Graph')

  let {
    sampleCount = 129,
    sampleDensity = 4,
    globalScope,
    colors = Colors.biomes.alps,
    bounds,
    freeze = false,
    fill = true,
    scaleStroke = false,
    stroke = true,
    dashed = false,
    dashOffset = 0,
    dashSettings = [0.5, 0.5],
    sledders = [],
    useInterpolation = true,
    refreshPeriodT = 0.3,
  } = spec

  let {
    strokeColor = colors.groundStroke,
    strokeWidth = colors.groundStrokeWidth,
    fillColor = colors.groundFill,
  } = spec

  if (bounds && sampleDensity) {
    let span = Math.abs(bounds[0] - bounds[1])
    sampleCount = Math.ceil(sampleDensity * span)
  }

  let minX, maxX

  const undashedSettings = []
  const dashSettingsScreen = [0, 0]

  // Scope is global scope
  const scope = globalScope

  const sampler = new Sampler({
    ...spec,
    scope,
  })
  const samples = sampler.generateSampleArray(sampleCount)

  let interpolationSampler = null
  if (useInterpolation) {
    interpolationSampler = new InterFrameSampler({
      sampler,
      sampleCount,
      refreshPeriodT,
    })
  }

  const screenSpaceSample = Vector2()

  const minWorldPoint = Vector2()
  const maxWorldPoint = Vector2()

  const minSample = Vector2()
  const maxSample = Vector2()

  const terrainLayers = 6
  const terrainParameters = []
  for (let i = 0; i < terrainLayers; i++) {
    scalar = math.lerp(1, 3, Math.random())
    terrainParameters.push([
      math.lerp(0, TAU, Math.random()),
      math.lerp(0.3, 3, Math.random()),
      math.lerp(3, 5, Math.random()) * scalar,
      math.lerp(1, 3, Math.random()) * scalar,
      math.lerp(0.05, 0.25, Math.random()),
    ])
  }

  function resample(refresh = false) {
    updateXBounds()
    if (useInterpolation) {
      if (refresh) interpolationSampler.refresh(minX, maxX, scope.t, scope.dt)
      interpolationSampler.resetExtrema()
      interpolationSampler.sampleRange(scope, samples, sampleCount, minX, maxX)
      minSample.set(minX, interpolationSampler.min)
      maxSample.set(maxX, interpolationSampler.max)
    } else {
      sampler.resetExtrema()
      sampler.sampleRange(scope, samples, sampleCount, 'x', minX, maxX)
      minSample.set(minX, sampler.min)
      maxSample.set(maxX, sampler.max)
    }
  }

  function tVariableChanged() {
    resample(true)
  }

  function tick() {
    if (!freeze) resample()
  }

  function draw() {
    ctx.save()

    const worldToScreenScalar = camera.worldToScreenScalar()

    const strokeScalar = scaleStroke ? worldToScreenScalar : 1

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

      for (let i = 0; i < terrainLayers; i++)
        drawSine.apply(null, terrainParameters[i])
    }

    if (stroke) {
      ctx.beginPath()

      camera.worldToScreen(samples[0], screenSpaceSample)
      ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)

      for (let i = 1; i < sampleCount; i++) {
        camera.worldToScreen(samples[i], screenSpaceSample)
        ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
      }

      dashSettingsScreen[0] = dashSettings[0] * strokeScalar
      dashSettingsScreen[1] = dashSettings[1] * strokeScalar

      ctx.setLineDash(dashed ? dashSettingsScreen : undashedSettings)
      ctx.dashOffset = dashOffset
      ctx.lineCap = 'round'
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth * strokeScalar
      ctx.stroke()
    }

    ctx.restore()
  }

  function drawSine(
    xOffset = 0,
    yOffset = 0,
    xScale = 1,
    yScale = 1,
    opacity = 0.5,
  ) {
    ctx.beginPath()

    ctx.globalAlpha = opacity
    camera.worldToScreen(samples[0], screenSpaceSample)
    ctx.moveTo(screen.width, screen.height)
    ctx.lineTo(0, screen.height)

    for (let i = 0; i < sampleCount; i++) {
      const x = samples[i].x
      const increasedX = x + 50

      // if (!window.logged) // console.log(samples[i]);
      window.logged = true
      camera.worldToScreen(samples[i], screenSpaceSample)
      const y =
        screenSpaceSample.y +
        (Math.sin(x / xScale - xOffset) + 1) *
          camera.worldToScreenScalar(1) *
          yScale +
        yOffset * camera.worldToScreenScalar(1)
      ctx.lineTo(screenSpaceSample.x, y)
    }

    ctx.fillStyle = _.isString(colors.groundPattern)
      ? colors.groundPattern
      : _.sample(colors.groundPattern)
    ctx.fill()

    ctx.globalAlpha = 1
  }

  function updateXBounds() {
    camera.frameToWorld(screen.minFramePoint, minWorldPoint)
    camera.frameToWorld(screen.maxFramePoint, maxWorldPoint)

    if (bounds) {
      minX = bounds[0]
      maxX = bounds[1]
    } else {
      minX = minWorldPoint[0]
      maxX = maxWorldPoint[0]
    }
  }

  function resize() {
    resample(true)
  }

  function startRunning() {
    resample(true)
  }

  function stopRunning() {
    resample(true)

    _.invokeEach(sledders, 'reset')
  }

  resample(true)

  self.mix(sampler)

  return self.mix({
    tick,
    draw,
    resize,

    tVariableChanged,

    resample,
    bounds,

    startRunning,
    stopRunning,

    get minSample() {
      return minSample
    },

    get maxSample() {
      return maxSample
    },

    get samples() {
      return samples
    },

    get expression() {
      return sampler.expression
    },
    set expression(v) {
      sampler.expression = v
      resample(true)
    },

    get strokeWidth() {
      return strokeWidth
    },
    set strokeWidth(v) {
      strokeWidth = v
    },

    get strokeColor() {
      return strokeColor
    },
    set strokeColor(v) {
      strokeColor = v
    },

    get fillColor() {
      return fillColor
    },
    set fillColor(v) {
      fillColor = v
    },

    get dashSettings() {
      return dashSettings
    },
    set dashSettings(v) {
      dashSettings = v
    },

    get dashOffset() {
      return dashOffset
    },
    set dashOffset(v) {
      dashOffset = v
    },

    get dashed() {
      return dashed
    },
    set dashed(v) {
      dashed = v
    },
  })
}
