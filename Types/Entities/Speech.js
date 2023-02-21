function Speech(spec) {
  const { self, screen, camera, world } = Entity(spec, 'Speech')

  let {
    content = 'WORDS WORDS WORDS',
    direction = 'up',
    font = 'Patrick Hand',
    baseline = 'alphabetic',
    align = 'center',
    color = '#222',
    size = 0.5,
    distance = 1,
    speech,
    speakerX = 0,
    speakerY = 0,
    domain = [NINF, PINF],
    drawIfRunning = false,
    globalScope,
    deactivationThreshold = null,
    activationThreshold = null,
  } = spec

  const transform = Transform(spec, self)

  let domainTransform

  let activationThresholdMet = false

  let textDirection
  switch (direction) {
    case 'up-left':
      textDirection = Vector2(-1, 1)
      align = 'center'
      // baseline = 'middle'
      break
    case 'up-up-left':
      textDirection = Vector2(-1, 2)
      align = 'center'
      // baseline = 'middle'
      break
    case 'up-left-left':
      textDirection = Vector2(-2, 1)
      align = 'center'
      // baseline = 'middle'
      break
    case 'left':
      textDirection = Vector2(-1, 0)
      align = 'right'
      // baseline = 'middle'
      break
    case 'left-up':
      textDirection = Vector2(-1, 1)
      align = 'right'
      // baseline = 'middle'
      break
    case 'left-left-up':
      textDirection = Vector2(-2, 1)
      align = 'right'
      // baseline = 'middle'
      break
    case 'left-up-up':
      textDirection = Vector2(-1, 2)
      align = 'right'
      // baseline = 'middle'
      break
    case 'up':
      textDirection = Vector2(0, 1)
      align = 'center'
      // baseline = 'middle'
      break
    case 'up-right':
      textDirection = Vector2(1, 1)
      align = 'center'
      // baseline = 'middle'
      break
    case 'up-up-right':
      textDirection = Vector2(1, 2)
      align = 'center'
      // baseline = 'middle'
      break
    case 'up-right-right':
      textDirection = Vector2(2, 1)
      align = 'center'
      // baseline = 'middle'
      break
    case 'right':
      textDirection = Vector2(1, 0)
      align = 'left'
      // baseline = 'middle'
      break
    case 'right-up':
      textDirection = Vector2(1, 1)
      align = 'left'
      // baseline = 'middle'
      break
    case 'right-up-up':
      textDirection = Vector2(1, 2)
      align = 'left'
      // baseline = 'middle'
      break
    case 'right-right-up':
      textDirection = Vector2(2, 1)
      align = 'left'
      // baseline = 'middle'
      break
    default:
      textDirection = direction
  }
  textDirection.normalize()

  const textTangent = Vector2(textDirection).orthogonalize()
  const textOriginPerturbation = Vector2(textTangent).multiply(0) //Math.random()*distance/6)

  const worldPosition = Vector2()

  const speakerOrigin = Vector2(speakerX, speakerY)
  const speakerOriginWorld = Vector2()

  const textOrigin = Vector2(textDirection)
    .multiply(distance)
    .add(textOriginPerturbation)
  const textOriginWorld = Vector2()
  const textOriginScreen = Vector2()

  const lineDirection = Vector2()

  const lineOriginWorld = Vector2()
  const lineOriginScreen = Vector2()

  const lineTerminusWorld = Vector2()
  const lineTerminusScreen = Vector2()

  const controlPointWorld = Vector2()
  const controlPointPerturbation = Vector2(
    (Math.random() *
      Math.sign(textDirection.x || Math.round(Math.random()) * 2 - 1) *
      distance) /
      10,
    (Math.random() * distance) / 10,
  )
  const controlPointScreen = Vector2()

  if (speech) {
    if (!_.isArray(speech)) speech = [speech]

    for (s of speech) {
      if (_.isString(s)) s = { content: s }

      Speech({
        parent: self,
        domainTransform,
        globalScope,
        x: textOrigin.x + (s.x || 0),
        y: textOrigin.y + (s.y || 0) + size * 0.8,
        ...s,
      })
    }
  }

  function awake() {
    domainTransform = self.getFromAncestor('domainTransform')
  }

  function tick() {
    transform.rotation = -transform.parentWorldRotation
  }

  function calculatePoints() {
    speakerOriginWorld.set(speakerOrigin).add(transform.position)
    transform.parent.transformPoint(speakerOriginWorld)

    transform.transformPoint(worldPosition.set())

    worldPosition.add(textOrigin, textOriginWorld)
    textOriginWorld.subtract(speakerOriginWorld, lineDirection).normalize()

    lineOriginWorld.set(lineDirection).multiply(0.25).add(speakerOriginWorld)
    lineTerminusWorld.set(lineDirection).multiply(-0.25).add(textOriginWorld)

    lineOriginWorld
      .lerp(lineTerminusWorld, 0.5, controlPointWorld)
      .add(controlPointPerturbation)
  }

  function transformPoints() {
    camera.worldToScreen(textOriginWorld, textOriginScreen)
    camera.worldToScreen(lineOriginWorld, lineOriginScreen)
    camera.worldToScreen(lineTerminusWorld, lineTerminusScreen)
    camera.worldToScreen(controlPointWorld, controlPointScreen)
  }

  let inDomain = false

  function draw() {
    // Activation/deactivation threshold logic
    if (
      deactivationThreshold &&
      domainTransform &&
      Math.abs(domainTransform.x - deactivationThreshold) < 0.1
    ) {
      self.destroy()
      console.log('destroyed speech sprite')
    }

    if (
      activationThreshold &&
      domainTransform &&
      Math.abs(domainTransform.x - activationThreshold) < 0.1
    )
      activationThresholdMet = true

    if (activationThreshold && !activationThresholdMet) return

    // Draw based on whether we are within the given domain
    if (
      domainTransform &&
      (domainTransform.x < domain[0] || domainTransform.x > domain[1])
    )
      return

    if (
      globalScope.running &&
      !drawIfRunning &&
      !world.level.isRunningAsCutscene
    ) {
      return
    }

    const scalar = camera.worldToScreenScalar()

    calculatePoints()
    transformPoints()

    ctx = screen.ctx

    ctx.strokeStyle = color
    ctx.lineWidth = scalar / 15
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(lineOriginScreen.x, lineOriginScreen.y)
    ctx.quadraticCurveTo(
      controlPointScreen.x,
      controlPointScreen.y,
      lineTerminusScreen.x,
      lineTerminusScreen.y,
    )
    ctx.stroke()

    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.font = '1px ' + font

    ctx.save()
    ctx.translate(textOriginScreen.x, textOriginScreen.y)
    ctx.scale(size * scalar, size * scalar)
    ctx.fillText(content, 0, 0)
    ctx.restore()
  }

  return self.mix({
    transform,

    awake,
    tick,
    draw,
  })
}
