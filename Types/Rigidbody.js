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
  const originalVelocity = Vector2()

  const collisionThreshold = 0.0
  const collisionTangent = Vector2()
  const collisionNormal = Vector2()

  const upright = Vector2(0, 1)

  const samplePosition = Vector2()

  const graphVelocity = Vector2()
  const depenetration = Vector2()

  const debugVectorOrigin = Vector2()
  const debugVectorTerminus = Vector2()

  const gravitySign = invertGravity ? 1 : -1

  function tick() {
    if (!globalScope.running || fixed) {
      return
    }

    // Graph can change from cartesian/polar mid-level (editor)
    let polar = graph.isPolar
    // polar = false

    // Gravity
    if (polar) {
      // Polar (towards or away from center)
      const theta = Math.atan2(transform.y, transform.x)

      velocity[0] += gravitySign * Math.cos(theta) * 9.8 * 3 * globalScope.dt
      velocity[1] += gravitySign * Math.sin(theta) * 9.8 * 3 * globalScope.dt
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

    let penetrationDepth, surfaceTheta

    if (polar) {
      surfaceTheta = graph.thetaOfClosestSurfacePoint(transform.position)

      const surfaceR = graph.sample('theta', surfaceTheta)

      const r = transform.position.magnitude

      penetrationDepth = surfaceR - r
    } else {
      const graphY = graph.sample('x', samplePosition.x)

      penetrationDepth = graphY - samplePosition.y
    }

    grounded = penetrationDepth > collisionThreshold

    if (grounded) {
      // Set collision tangent, normal, velocity
      if (polar) {
        // Calculate vectors from graph position
        graph.tangentVectorAt(surfaceTheta, collisionTangent)
        collisionTangent.normalize()
        collisionTangent.negate()

        graph.normalVectorAt(surfaceTheta, collisionNormal)
        collisionNormal.normalize()

        graph.velocityVectorAt(surfaceTheta, graphVelocity)

        /* Collision correction */

        // Project velocity onto collision normal and tangent
        const tangentScalar =
          collisionTangent.dot(velocity) / velocity.magnitude

        const depenetrationScalar = penetrationDepth

        // Calculate depenetration
        collisionNormal.multiply(depenetrationScalar, depenetration)

        // Calculate graph velocity
        graphVelocity.multiply(graphVelocity.dot(collisionNormal))
        // collisionNormal.multiply(graphVelocityScalar, graphVelocity)

        // Save current velocity
        originalVelocity.set(velocity)

        // Reset velocity to limits imposed by ground angle
        collisionTangent.multiply(tangentScalar, velocity)

        // Add velocity of ground
        velocity.add(graphVelocity)

        // Prevent "sticking" to ground in cases where upward velocity was higher before collision correction
        // velocity.max(originalVelocity)

        // Smoothly move upright vector toward ground normal
        upright.lerp(collisionNormal, 0.15)
        upright.normalize()

        const uprightAngle = math.atan2(-upright.x, upright.y)

        // Write new rotation
        transform.rotation = fixedRotation ? 0 : uprightAngle
        // transform.rotation = uprightAngle

        // Depenetrate from ground
        transform.position.add(depenetration)
      } else {
        const graphSlope = graph.sampleSlope('x', samplePosition.x)

        // Set collision tangent
        collisionTangent.x = 1
        collisionTangent.y = graphSlope
        collisionTangent.normalize()

        // Set collision normal
        collisionTangent.orthogonalize(collisionNormal)

        const verticalGraphVelocity = graph.sampleSlope(
          't',
          globalScope.t,
          'x',
          samplePosition.x,
        )

        // Project velocity onto collision normal and tangent
        const tangentScalar = collisionTangent.dot(velocity)
        const normalScalar = collisionNormal.dot(velocity)

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
    if (grounded) {
      // drawDebugVector(ctx, collisionNormal, 'green')
      // drawDebugVector(ctx, collisionTangent, 'red')
      // drawDebugVector(ctx, upright, 'yellow')
      // drawDebugVector(ctx, graphVelocity, 'cyan')
      // drawDebugVector(ctx, depenetration, 'pink')
    }

    // drawDebugVector(ctx, velocity, 'orange')
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
