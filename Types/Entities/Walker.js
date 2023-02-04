function Walker(spec) {
  const { self, camera, screen, world } = Entity(spec, 'Walker')

  const transform = Transform(spec, self)

  let {
    asset = 'images.benny_float',
    size = 2,
    sprite,
    graph,
    speech,
    globalScope,
    walkers = [],
    following = null,
    followDistance = 2,
    domainTransform = null,
    bobSpeed = 0.6,
    hasDarkMode = false,
    darkModeOpacity = 0,
    speechScreen,
    victoryX = null,
    levelCompleted,
    range = [NINF, PINF],
    flipX = false,
    followFlip = true,
    transition = null,
    backflip = null,
  } = spec

  if (!_.isArray(walkers)) walkers = [walkers]

  s = sprite

  sprite = Sprite({
    parent: self,
    drawOrder: self.drawOrder,
    asset,
    size,
    globalScope,
    y: size / 2,
    speech,
    speechScreen,
    flipX,
    ...sprite,
  })

  const darkSprite = hasDarkMode
    ? Sprite({
        parent: self,
        asset: asset + '_dark',
        size,
        globalScope,
        y: size / 2,
        opacity: darkModeOpacity,
        drawOrder: 1000,
        flipX,
        ...s,
      })
    : null

  const clickable = following
    ? null
    : Clickable({
        entity: self,
        space: 'frame',
        layer: spec.layer,
      })

  walkers = _.map(walkers, (v) =>
    Walker({
      drawOrder: self.drawOrder,
      ...v,
      parent: self.parent,
      domainTransform: domainTransform || transform,
      camera,
      following: self,
      globalScope,
      screen,
      speechScreen,
      graph,
      hasDarkMode,
    }),
  )

  let walking = false
  let walkSign = 1
  let walkSpeed = 1
  let oldWalkSign = walkSign

  let floatCycle = 0
  let floatCycleSpeed = bobSpeed

  let floatBob = 0
  let floatBobCoefficient = 0.12
  let floatBobHeight = 0.2

  let floatOffset = -0.1

  let jumpProgress = 0

  const mousePointFrame = Vector2()
  const mousePoint = Vector2()

  let completed = false

  function tick() {
    if (followFlip && walking && !following) {
      camera.frameToWorld(mousePointFrame, mousePoint)
      transform.invertPoint(mousePoint)

      if (oldWalkSign == walkSign || Math.abs(mousePoint.x) > 0.5) {
        transform.position.x += walkSign * walkSpeed * self.tickDelta
        sprite.flipX = walkSign == -1
        if (darkSprite) darkSprite.flipX = walkSign == -1
      }
    } else if (followFlip && following) {
      if (transform.x - following.transform.x > followDistance) {
        transform.x = following.transform.x + followDistance
        sprite.flipX = true
        if (darkSprite) darkSprite.flipX = true
      } else if (following.transform.x - transform.x > followDistance) {
        transform.x = following.transform.x - followDistance
        sprite.flipX = false
        if (darkSprite) darkSprite.flipX = false
      }
    }

    transform.position.x = _.clamp(transform.position.x, range[0], range[1])

    if (
      backflip &&
      transform.position.x > backflip[0] &&
      transform.position.x < backflip[1]
    ) {
      jumpProgress = math.lerp(jumpProgress, 1, 0.05)
      sprite.transform.rotation += globalScope.dt * 10
    } else {
      jumpProgress = math.lerp(jumpProgress, 0, 0.12)
      sprite.transform.rotation = math.lerp(sprite.transform.rotation, 0, 0.12)
    }

    while (sprite.transform.rotation > PI) sprite.transform.rotation -= TAU

    while (sprite.transform.rotation < -PI) sprite.transform.rotation += TAU

    sprite.transform.y = math.lerp(size / 2, size / 2 + 1, jumpProgress)

    const groundHeight = graph.sample('x', transform.position.x)

    floatCycle -= self.tickDelta * floatCycleSpeed

    if (floatCycle <= 0) floatCycle = 1

    floatBob = math.lerp(floatBob, floatCycle, floatBobCoefficient)

    transform.position.y =
      groundHeight + floatBob * floatBobHeight + floatOffset

    if (victoryX != null && !completed) {
      if (Math.sign(victoryX - spec.x) == Math.sign(transform.x - victoryX)) {
        completed = true
        levelCompleted()
      }
    }
  }

  function draw() {}

  function mouseDown(point) {
    oldWalkSign = walkSign
    walkSign = Math.sign(point.x)
    mousePointFrame.set(point)
    walking = true
  }

  function mouseMove(point) {
    oldWalkSign = walkSign
    walkSign = Math.sign(point.x)
    walking = true
    mousePointFrame.set(point)
  }

  function mouseUp() {
    walking = false
  }

  document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') {
      oldWalkSign = walkSign
      walkSign = Math.sign(1)
      walking = true
      return
    } else if (e.key == 'ArrowLeft') {
      oldWalkSign = walkSign
      walkSign = Math.sign(-1)
      walking = true
    }
  })
  document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') walking = false
  })

  return self.mix({
    transform,
    domainTransform: domainTransform || transform,

    clickable,

    set darkModeOpacity(o) {
      if (darkSprite) darkSprite.opacity = o
      else throw `Tried to set opacity of Sprite without an opacity`
    },
    get hasDarkMode() {
      return hasDarkMode
    },

    get walkers() {
      return walkers
    },

    get transition() {
      return transition
    },
    set transition(v) {
      transition = v
    },

    mouseDown,
    mouseMove,
    mouseUp,

    sprite,
    speech,

    tick,
    draw,
  })
}
