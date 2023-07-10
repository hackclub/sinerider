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
    fixedPoints = false,
  } = spec

  // Polar
  let {
    polar = false,
    minTheta = 0,
    maxTheta = TAU,
    invertGravity = false,
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
  let samples = sampler.generateSampleArray(sampleCount)

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

  let terrainLayers = 6
  let terrainParameters

  generateTerrainParameters()

  function generateTerrainParameters() {
    terrainParameters = []
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
  }

  function resample(refresh = false) {
    if (polar) {
      /* Resample polar graph */
      sampler.resetExtrema()
      sampler.sampleRange(
        scope,
        samples,
        sampleCount,
        'theta',
        minTheta,
        maxTheta,
      )
      minSample.y = math.pinf
      maxSample.y = math.ninf
      for (const sample of samples) {
        const theta = sample[0],
          r = sample[1]
        sample.set(r * Math.cos(theta), r * Math.sin(theta))
        if (sample.y < minSample.y) minSample.set(sample)
        if (sample.y > maxSample.y) maxSample.set(sample)
      }
    } else {
      /* Resample cartesian graph */
      updateXBounds()
      if (useInterpolation) {
        if (refresh) interpolationSampler.refresh(minX, maxX, scope.t, scope.dt)
        interpolationSampler.resetExtrema()
        interpolationSampler.sampleRange(
          scope,
          samples,
          sampleCount,
          minX,
          maxX,
        )
        minSample.set(minX, interpolationSampler.min)
        maxSample.set(maxX, interpolationSampler.max)
      } else {
        sampler.resetExtrema()
        sampler.sampleRange(scope, samples, sampleCount, 'x', minX, maxX)
        minSample.set(minX, sampler.min)
        maxSample.set(maxX, sampler.max)
      }
    }
  }

  function tVariableChanged() {
    resample(true)
  }

  function tick() {
    if (!freeze) resample()
  }

  function drawCartesianGraph() {
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

      let roundedSample

      // TODO: Implement fixed points to make
      // stroked hint graphs not "march"
      if (fixedPoints) {
        const sample = samples[1]
        const roundedSampleX = Math.round(sample.x)

        const sampleA = sample
        const sampleB = samples[i + 1]

        const roundedSampleSlope =
          (sampleB.y - sampleA.y) / (sampleB.x - sampleA.x)
        const roundedSampleY =
          sample.y + (roundedSampleX - sample.x) * roundedSampleSlope

        roundedSample.set(roundedSampleX, roundedSampleY)
        camera.worldToScreen(roundedSample, screenSpaceSample)
      } else {
        camera.worldToScreen(samples[0], screenSpaceSample)
      }

      ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)

      for (let i = 1; i < sampleCount; i++) {
        const sample = samples[i]

        if (fixedPoints) {
          const roundedSampleX = Math.round(sample.x)

          let sampleA, sampleB
          if (i == sampleCount - 1) {
            sampleA = samples[i - 1]
            sampleB = sample
          } else {
            sampleA = sample
            sampleB = samples[i + 1]
          }

          const roundedSampleSlope =
            (sampleB.y - sampleA.y) / (sampleB.x - sampleA.x)
          const roundedSampleY =
            sample.y + (roundedSampleX - sample.x) * roundedSampleSlope

          roundedSample.set(roundedSampleX, roundedSampleY)
          camera.worldToScreen(roundedSample, screenSpaceSample)
        } else {
          camera.worldToScreen(sample, screenSpaceSample)
        }

        ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
      }

      dashSettingsScreen[0] = dashSettings[0] * strokeScalar
      dashSettingsScreen[1] = dashSettings[1] * strokeScalar

      ctx.setLineDash(dashed ? dashSettingsScreen : undashedSettings)
      ctx.dashOffset = 30
      ctx.lineCap = 'round'
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth * strokeScalar
      ctx.stroke()
    }
  }

  const debugVectorOrigin = Vector2()
  const debugVectorTerminus = Vector2()

  function drawDebugVector(ctx, vector, color, origin = position) {
    camera.worldToScreen(origin, debugVectorOrigin)

    debugVectorTerminus.set(vector)
    debugVectorTerminus.add(origin)
    camera.worldToScreen(debugVectorTerminus)

    ctx.beginPath()
    ctx.moveTo(debugVectorOrigin.x, debugVectorOrigin.y)
    ctx.lineTo(debugVectorTerminus.x, debugVectorTerminus.y)

    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.stroke()
  }

  let point = Vector2(),
    tangent = Vector2(),
    normal = Vector2()

  function drawPolarGraph() {
    const worldToScreenScalar = camera.worldToScreenScalar()

    const strokeScalar = scaleStroke ? worldToScreenScalar : 1

    // Fill if curve is closed. TODO: I'm pretty sure
    // this doesn't work in every case?
    const start = samples[0]
    const end = samples[sampleCount - 1]
    fill = start.distance(end) < 0.001

    if (fill) {
      ctx.beginPath()
      camera.worldToScreen(samples[0], screenSpaceSample)
      ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)

      for (let i = 1; i < sampleCount; i++) {
        camera.worldToScreen(samples[i], screenSpaceSample)
        ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
      }

      // ctx.lineTo(screen.width, screen.height)
      // ctx.lineTo(0, screen.height)

      ctx.fillStyle = fillColor
      ctx.fill()

      ctx.clip()

      // for (let i = 0; i < terrainLayers; i++)
      //   drawSine.apply(null, terrainParameters[i])
    }

    if (stroke) {
      ctx.beginPath()

      camera.worldToScreen(samples[0], screenSpaceSample)

      ctx.moveTo(screenSpaceSample.x, screenSpaceSample.y)

      for (let i = 1; i < sampleCount; i++) {
        const sample = samples[i]
        camera.worldToScreen(sample, screenSpaceSample)
        ctx.lineTo(screenSpaceSample.x, screenSpaceSample.y)
      }

      dashSettingsScreen[0] = dashSettings[0] * strokeScalar
      dashSettingsScreen[1] = dashSettings[1] * strokeScalar

      ctx.setLineDash(dashed ? dashSettingsScreen : undashedSettings)
      ctx.dashOffset = 30
      ctx.lineCap = 'round'
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth * strokeScalar
      ctx.stroke()
    }

    for (let theta = 0; theta <= TAU + 0.001; theta += TAU / 12) {
      pointAtTheta(theta, point)
      normalVectorAt(theta, normal)
      normal.normalize()
      normal.multiply(0.2)
      drawDebugVector(ctx, normal, 'black', point)

      tangentVectorAt(theta, tangent)
      tangent.normalize()
      tangent.negate()
      drawDebugVector(ctx, tangent, 'blue', point)
    }
  }

  function draw() {
    ctx.save()
    if (polar) drawPolarGraph()
    else drawCartesianGraph()
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

    // TODO: Update min/max theta?
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

  function assignColors(_colors) {
    colors = _colors
    strokeColor = colors.groundStroke
    strokeWidth = colors.groundStrokeWidth
    fillColor = colors.groundFill
  }

  function pointAtTheta(theta, p) {
    const r = self.sample('theta', theta)
    p.set(r * Math.cos(theta), r * Math.sin(theta))
  }

  const pAtTheta = Vector2(),
    pAtMinusTheta = Vector2()

  function thetaOfClosestSurfacePoint(position) {
    const theta = Math.atan2(position.y, position.x)

    pointAtTheta(theta, pAtTheta)
    pointAtTheta(-theta, pAtMinusTheta)

    if (pAtTheta.distance(position) < pAtMinusTheta.distance(position)) {
      return theta
    } else {
      return -theta
    }
  }

  function sampleSlopeFromTheta(theta) {
    const r = self.sample('theta', theta)
    const rPrime = self.sampleSlope('theta', theta)
    const sinTheta = Math.sin(theta),
      cosTheta = Math.cos(theta)
    const graphSlope =
      (rPrime * sinTheta + r * cosTheta) / (rPrime * cosTheta - r * sinTheta)
    return graphSlope
  }

  function tangentVectorAt(theta, output = Vector2()) {
    const r = self.sample('theta', theta),
      rPrime = self.sampleSlope('theta', theta),
      sinTheta = Math.sin(theta),
      cosTheta = Math.cos(theta)

    output.set(
      -r * sinTheta + cosTheta * rPrime,
      cosTheta * r + sinTheta * rPrime,
    )

    output.negate()
  }

  function normalVectorAt(theta, output = Vector2()) {
    tangentVectorAt(theta, output)
    output.orthogonalize()
  }

  // Velocity vector w.r.t. time
  function velocityVectorAt(theta, output = Vector2()) {
    const rPrimeWrtTime = self.sampleSlope('t', globalScope.t, 'theta', theta),
      sinTheta = Math.sin(theta),
      cosTheta = Math.cos(theta)

    output.set(rPrimeWrtTime * cosTheta, rPrimeWrtTime * sinTheta)
  }

  resample(true)

  self.mix(sampler)

  return self.mix({
    tick,
    draw,
    resize,

    assignColors,

    tVariableChanged,

    resample,
    bounds,

    startRunning,
    stopRunning,

    pointAtTheta,
    thetaOfClosestSurfacePoint,
    velocityVectorAt,
    normalVectorAt,
    tangentVectorAt,
    sampleSlopeFromTheta,

    set polar(v) {
      polar = v
    },

    get isPolar() {
      return polar
    },

    get label() {
      return polar ? 'R' : 'Y'
    },

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

    set terrainLayers(v) {
      terrainLayers = v
      generateTerrainParameters()
    },

    get sampleCount() {
      return sampleCount
    },
    set sampleCount(v) {
      sampleCount = v

      samples = sampler.generateSampleArray(sampleCount)

      interpolationSampler = new InterFrameSampler({
        sampler,
        sampleCount,
        refreshPeriodT,
      })
    },
  })
}
