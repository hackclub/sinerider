function Walker(spec) {
  const {
    self,
    camera,
    screen,
    ctx,
  } = Entity(spec, 'Walker')

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
  } = spec

  if (!_.isArray(walkers))
    walkers = [walkers]
  
  sprite = Sprite({
    parent: self,
    asset,
    size,
    globalScope,
    y: size/2,
    speech,
    ...sprite
  })
  
  const clickable = following ? null : Clickable({
    entity: self,
    space: 'frame',
    layer: spec.layer,
  })

  walkers = _.map(walkers, v => Walker({
    ...v,
    parent: self.parent,
    domainTransform: domainTransform || transform,
    camera,
    following: self,
    globalScope,
    graph,
  }))
  
  let walking = false
  let walkSign = 1
  let walkSpeed = 1

  let floatCycle = 0
  let floatCycleSpeed = bobSpeed
  
  let floatBob = 0
  let floatBobCoefficient = 0.12
  let floatBobHeight = 0.2

  let floatOffset = -0.1

  const mousePointFrame = Vector2()
  const mousePoint = Vector2()

  function tick() {
    if (walking) {
      camera.frameToWorld(mousePointFrame, mousePoint)
      transform.invertPoint(mousePoint)

      const oldWalkSign = walkSign
      const newWalkSign = Math.sign(mousePoint.x)

      if (oldWalkSign == newWalkSign || Math.abs(mousePoint.x) > 0.5) {
        walkSign = newWalkSign
        transform.position.x += walkSign*walkSpeed*self.tickDelta
        sprite.flipX = walkSign == -1
      }
    }
    else if (following) {
      if (transform.x - following.transform.x > followDistance) {
        transform.x = following.transform.x + followDistance
        sprite.flipX = true
      }
      else if (following.transform.x - transform.x > followDistance) {
        transform.x = following.transform.x - followDistance
        sprite.flipX = false
      }
    }
    
    const groundHeight = graph.sample('x', transform.position.x)

    floatCycle -= self.tickDelta*floatCycleSpeed

    if (floatCycle <= 0)
      floatCycle = 1

    floatBob = math.lerp(floatBob, floatCycle, floatBobCoefficient)

    transform.position.y = groundHeight+floatBob*floatBobHeight+floatOffset
  }

  function draw() {

  }

  function mouseDown(point) {
    walking = true
    mousePointFrame.set(point)
  }

  function mouseMove(point) {
    mousePointFrame.set(point)
  }

  function mouseUp() {
    walking = false
  }

  function click() {

  }

  return self.mix({
    transform,
    domainTransform: domainTransform || transform,
    
    clickable,

    mouseDown,
    mouseMove,
    mouseUp,

    click,

    tick,
    draw,
  })
}