let arrowsDisabled = false
function Arrow(spec) {
  const { self, screen, camera, ctx } = Entity(spec, 'Arrow')

  const {
    point0 = Vector2(),
    point1 = Vector2(),
    color = '#111',
    style = 'solid',
    headSize = 1,
    lineWidth = 0.2,
    truncate = [0, 0],
  } = spec

  let {
    dashed = false,
    dashSettings = [0.5, 0.5],
    dashOffset = 0,
    fadeIn = false,
    fadeOut = false,
  } = spec

  const transform = Transform({
    position: point0,
    ...spec,
  })

  const endTransform = Transform({
    position: point1,
    scale: headSize,
  })

  const direction = Vector2()

  const pathPoint = Vector2()

  const undashedSettings = []

  let fadeOutGradient
  let fadeInGradient

  let opacity = 1

  recomputeValues()

  function tick() {}

  function drawLocalShaft() {
    ctx.beginPath()
    ctx.moveTo(0, truncate[0])
    ctx.lineTo(0, direction.magnitude - truncate[1] - headSize)

    ctx.globalAlpha = opacity
    ctx.strokeStyle = fadeIn
      ? fadeInGradient
      : fadeOut
      ? fadeOutGradient
      : color
    ctx.lineWidth = lineWidth
    ctx.setLineDash(dashed ? dashSettings : undashedSettings)
    ctx.dashOffset = dashOffset
    ctx.stroke()

    ctx.setLineDash([])
  }

  function drawLocalPoint() {
    const y = -truncate[1] / headSize
    ctx.beginPath()
    ctx.moveTo(0, y)

    ctx.lineTo(-0.5, y - 1)
    ctx.lineTo(0.5, y - 1)
    ctx.lineTo(0, y)

    ctx.globalAlpha = opacity
    ctx.fillStyle = color
    ctx.fill()
  }

  function draw() {
    if (arrowsDisabled) return
    if (opacity == 0) return

    camera.drawThrough(ctx, drawLocalShaft, transform)
    if (!fadeOut) camera.drawThrough(ctx, drawLocalPoint, endTransform)
    ctx.globalAlpha = 1
  }

  function recomputeValues() {
    point1.subtract(point0, direction)

    let angle = Math.atan2(direction.x, -direction.y)

    transform.rotation = angle
    endTransform.rotation = angle
    endTransform.position.set(point1)

    fadeOutGradient = ctx.createLinearGradient(
      0,
      truncate[0],
      0,
      direction.magnitude - truncate[1] - headSize,
    )
    fadeInGradient = ctx.createLinearGradient(
      0,
      truncate[0],
      0,
      direction.magnitude - truncate[1] - headSize,
    )

    // Makes a higher proportion of short arrows visible
    const shortyOffset = math.remap(10, 30, 0.6, 0, direction.magnitude, true)

    fadeOutGradient.addColorStop(0 + shortyOffset, color)
    fadeOutGradient.addColorStop(0.4 + shortyOffset, 'rgba(255, 255, 255, 0)')

    fadeInGradient.addColorStop(0.6 - shortyOffset, 'rgba(255, 255, 255, 0)')
    fadeInGradient.addColorStop(1 - shortyOffset, color)
  }

  return self.mix({
    transform,
    endTransform,

    tick,
    draw,

    get point0() {
      return point0
    },
    set point0(v) {
      transform.position.set(v)
      point0.set(v)
      recomputeValues()
    },

    get point1() {
      return point0
    },
    set point1(v) {
      point1.set(v)
      recomputeValues()
    },

    get opacity() {
      return opacity
    },
    set opacity(v) {
      opacity = v
    },

    get dashed() {
      return dashed
    },
    set dashed(v) {
      dashed = v
    },

    get fadeIn() {
      return fadeIn
    },
    set fadeIn(v) {
      fadeIn = v
    },

    get fadeOut() {
      return fadeOut
    },
    set fadeOut(v) {
      fadeOut = v
    },
  })
}
