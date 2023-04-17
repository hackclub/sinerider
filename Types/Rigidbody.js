function Rigidbody(spec) {
  let {
    transform,
    graph,
    globalScope,
    camera,
    screen,
    fixed = false,
    fixedRotation = false,
    positionOffset = Vector2(),
  } = spec

  let grounded = false
  const velocity = Vector2()

  const collisionThreshold = 0.0
  const collisionTangent = Vector2()
  const collisionNormal = Vector2()

  const upright = Vector2(0, 1)

  const samplePosition = Vector2()

  const graphVelocity = Vector2()
  const depenetration = Vector2()

  const debugVectorOrigin = Vector2()
  const debugVectorTerminus = Vector2()

  function tick() {
    if (!globalScope.running || fixed) {
      return
    }

    // Gravity
    velocity[1] -= 9.8 * globalScope.dt

    // Integrate velocity. TODO: Verlet integration
    transform.x += velocity[0] * globalScope.dt
    transform.y += velocity[1] * globalScope.dt

    // Sample graph height
    samplePosition.set(transform.position)
    samplePosition.add(positionOffset)

    const graphY = graph.sample('x', samplePosition.x)
    grounded = samplePosition.y < graphY - collisionThreshold

    if (grounded) {
      // Slope and velocity of graph at this position
      const graphSlope = graph.sampleSlope('x', samplePosition.x)
      const verticalGraphVelocity = graph.sampleSlope(
        't',
        globalScope.t,
        'x',
        samplePosition.x,
      )

      // Vertical depth of penetration
      const verticalPenetration = graphY - samplePosition.y

      // Set collision tangent
      collisionTangent.x = 1
      collisionTangent.y = graphSlope
      collisionTangent.normalize()

      // Set collision normal
      collisionTangent.orthogonalize(collisionNormal)

      // Project velocity onto collision normal and tangent
      const tangentScalar = collisionTangent.dot(velocity)
      const normalScalar = collisionNormal.dot(velocity)

      // Project penetration onto collision normal
      const depenetrationScalar = collisionNormal.y * verticalPenetration

      // Project graph velocity onto collision normal
      const graphVelocityScalar = collisionNormal.y * verticalGraphVelocity

      // Calculate depenetration
      collisionNormal.multiply(depenetrationScalar, depenetration)

      // Calculate graph velocity
      collisionNormal.multiply(graphVelocityScalar, graphVelocity)

      // Save current upward velocity
      const velocityY = velocity.y

      // Reset velocity to limits imposed by ground angle
      collisionTangent.multiply(tangentScalar, velocity)

      // Add velocity of ground
      velocity.add(graphVelocity)

      // Prevent "sticking" to ground in cases where upward velocity was higher before collision correction
      velocity.y = Math.max(velocity.y, velocityY)

      // Smoothly move upright vector toward ground normal
      upright.lerp(collisionNormal, 0.15)
      upright.normalize()

      const uprightAngle = math.atan2(-upright.x, upright.y)

      // Write new rotation
      transform.rotation = fixedRotation ? 0 : uprightAngle
      // transform.rotation = uprightAngle

      // Depenetrate from ground
      transform.position.add(depenetration)
    }
  }

  function drawDebugVector(ctx, vector, color) {
    camera.worldToScreen(transform.position, debugVectorOrigin)

    debugVectorTerminus.set(vector)
    debugVectorTerminus.add(transform.position)
    camera.worldToScreen(debugVectorTerminus)

    ctx.beginPath()
    ctx.moveTo(debugVectorOrigin.x, debugVectorOrigin.y)
    ctx.lineTo(debugVectorTerminus.x, debugVectorTerminus.y)

    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.stroke()
  }

  function draw(ctx) {
    drawDebugVector(ctx, velocity, 'blue')

    if (grounded) {
      drawDebugVector(ctx, collisionNormal, 'green')
      drawDebugVector(ctx, collisionTangent, 'red')
      drawDebugVector(ctx, upright, 'yellow')
      drawDebugVector(ctx, graphVelocity, 'cyan')
      drawDebugVector(ctx, depenetration, 'pink')
    }
  }

  function resetVelocity() {
    velocity.x = 0
    velocity.y = 0
  }

  return {
    get velocity() {
      return velocity
    },
    set velocity(v) {
      velocity.set(v)
    },

    get upright() {
      return upright
    },
    set upright(v) {
      upright.set(v)
    },

    resetVelocity,

    tick,
    draw,
  }
}
