function Trail(spec) {
  const { self, camera, screen, ctx } = Entity(spec, 'Trail')

  const transform = Transform(spec, self)

  let {
    maxTime = 3,
    strokeStyle = 'rgba(255, 255, 255, 0.5)',
    alpha = 1,
    lineWidth = 0.3,
  } = spec

  let sampleCount = Math.ceil(maxTime / self.tickDelta)
  let sampleIndex = 0

  const pathPoint = Vector2()

  const worldPoints = []
  const worldPointsUpper = []
  const worldPointsLower = []

  for (let i = 0; i < sampleCount; i++) {
    worldPoints.push(Vector2())
    worldPointsUpper.push(Vector2())
    worldPointsLower.push(Vector2())
  }

  function awake() {
    // reset()
  }

  function tick() {
    // Move to next sample, wrapping at sampleCount
    sampleIndex = (sampleIndex + 1) % sampleCount

    const worldPoint = worldPoints[sampleIndex]
    const worldPointUpper = worldPointsUpper[sampleIndex]
    const worldPointLower = worldPointsLower[sampleIndex]

    transform.transformPoint(worldPoint.set())
    transform.transformPoint(worldPointUpper.set(0, 1))
    transform.transformPoint(worldPointLower.set(0, -1))
  }

  function draw() {
    ctx.beginPath()
    const screenScalar = camera.worldToScreenScalar()

    for (let i = 0; i < sampleCount; i++) {
      // Count forwards from oldest point
      const index = (sampleIndex + i + 1) % sampleCount

      const worldPoint = worldPoints[index]
      const worldPointUpper = worldPointsUpper[index]

      let progress = i / (sampleCount - 1)

      worldPoint.lerp(worldPointUpper, (progress * lineWidth) / 2, pathPoint)

      camera.worldToScreen(pathPoint)

      if (i == 0) ctx.moveTo(pathPoint.x, pathPoint.y)
      else ctx.lineTo(pathPoint.x, pathPoint.y)
    }

    // Traverse path in opposite direction, stopping just short of earliest point
    for (let i = sampleCount - 1; i >= 0; i--) {
      const index = (sampleIndex + i + 1) % sampleCount

      const worldPoint = worldPoints[index]
      const worldPointLower = worldPointsLower[index]

      let progress = i / (sampleCount - 1)

      worldPoint.lerp(worldPointLower, (progress * lineWidth) / 2, pathPoint)

      camera.worldToScreen(pathPoint)

      ctx.lineTo(pathPoint.x, pathPoint.y)
    }

    ctx.lineWidth = lineWidth * screenScalar
    ctx.fillStyle = strokeStyle
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.fill()
  }

  // function draw() {
  //   ctx.beginPath()
  //   const screenScalar = camera.worldToScreenScalar()

  //   for (let i = 0; i < sampleCount; i++) {
  //     // Count *backwards* from current point
  //   const index = (sampleIndex-i+sampleCount)%sampleCount

  //     const worldPoint = worldPoints[index]
  //     const worldPointUpper = worldPointsUpper[index]
  //     const worldPointLower = worldPointsLower[index]

  //     const screenPoint = screenPoints[index]
  //     const screenPointUpper = screenPointsUpper[index]
  //     const screenPointLower = screenPointsLower[index]

  //     camera.worldToScreen(worldPoint, screenPoint)
  //     camera.worldToScreen(worldPointUpper, screenPointUpper)
  //     camera.worldToScreen(worldPointLower, screenPointLower)

  //     if (i == 0)
  //       ctx.moveTo(screenPoint.x, screenPoint.y)
  //     else
  //       ctx.lineTo(screenPoint.x, screenPoint.y)
  //   }

  //   ctx.lineWidth = lineWidth*screenScalar
  //   ctx.strokeStyle = strokeStyle
  //   ctx.lineJoin = 'round'
  //   ctx.lineCap = 'round'
  //   ctx.stroke()
  // }

  function reset() {
    for (point of worldPoints) {
      transform.transformPoint(point.set())
    }
    for (point of worldPointsUpper) {
      transform.transformPoint(point.set())
    }
    for (point of worldPointsLower) {
      transform.transformPoint(point.set())
    }
  }

  return self.mix({
    transform,

    awake,

    tick,
    draw,

    reset,
  })
}
