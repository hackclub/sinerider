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
    invertGravity,
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

  const polar = graph.isPolar

  const gravitySign = invertGravity ? 1 : -1

  function tick() {
    if (!globalScope.running || fixed) {
      return
    }

    // Gravity
    if (polar) {
      // Polar (towards center)
      const theta = Math.atan2(transform.y, transform.x)
      const r = transform.position.magnitude
      velocity[0] += gravitySign * Math.cos(theta) * r * globalScope.dt
      velocity[1] += gravitySign * Math.sin(theta) * r * globalScope.dt
    } else {
      // Cartesian (down)
      velocity[1] += gravitySign * 9.8 * globalScope.dt
    }

    // Integrate velocity. TODO: Verlet integration
    transform.x += velocity[0] * globalScope.dt
    transform.y += velocity[1] * globalScope.dt

    // Sample graph height
    samplePosition.set(transform.position)
    samplePosition.add(positionOffset)

    let graphY

    let surfaceR, surfaceTheta

    let penetrationDepth

    if (polar) {
      const theta = Math.atan2(samplePosition.y, samplePosition.x)

      const r = transform.position.magnitude

      const rAtTheta = graph.sample('theta', theta)
      const rAtMinusTheta = graph.sample('theta', -theta)
      if (Math.abs(r - rAtTheta) < Math.abs(r - rAtMinusTheta)) {
        surfaceR = rAtTheta
        surfaceTheta = theta
      } else {
        surfaceR = rAtMinusTheta
        surfaceTheta = -theta
      }

      if (surfaceR < 0) {
        console.log('surface r is negative', surfaceR)
        debugger
      }

      penetrationDepth = surfaceR - r
    } else {
      const graphY = graph.sample('x', samplePosition.x)

      penetrationDepth = graphY - samplePosition.y
    }

    grounded = penetrationDepth > collisionThreshold

    if (grounded) {
      // Slope and velocity of graph at this position
      let graphSlope, verticalGraphVelocity
      if (polar) {
        graphSlope = graph.sampleSlopeFromTheta(surfaceTheta)
        verticalGraphVelocity =
          graph.sampleSlope('t', globalScope.t, 'theta', surfaceTheta) *
          Math.sin(surfaceTheta)
      } else {
        graphSlope = graph.sampleSlope('x', samplePosition.x)
        verticalGraphVelocity = graph.sampleSlope(
          't',
          globalScope.t,
          'x',
          samplePosition.x,
        )
      }

      // Set collision tangent
      if (polar) {
        graph.tangentVectorAt(surfaceTheta, collisionTangent)
        collisionTangent.normalize()

        debugger
        graph.normalVectorAt(surfaceTheta, collisionNormal)
        collisionNormal.normalize()
      } else {
        collisionTangent.x = 1
        collisionTangent.y = graphSlope
        collisionTangent.normalize()

        // Set collision normal
        collisionTangent.orthogonalize(collisionNormal)
      }

      // Project velocity onto collision normal and tangent
      const tangentScalar = collisionTangent.dot(velocity)

      // Project penetration onto collision normal
      const depenetrationScalar = collisionNormal.y * penetrationDepth

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
