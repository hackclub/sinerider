function Flake(spec) {
  const { ctx, camera, spawnHeight } = spec

  let growth
  let size
  let sizeCoefficient
  let spawned = false
  const position = Vector2()

  function spawn() {
    position.x = math.lerp(
      camera.lowerLeft.x,
      camera.upperRight.x,
      Math.random(),
    )

    position.y = math.lerp(spawnHeight[0], spawnHeight[1], Math.random())

    sizeCoefficient = Math.random()
    size = math.lerp(0.03, 0.06, sizeCoefficient)
    growth = 0
    spawned = true
  }

  function tick() {
    // if (!spawned) return

    if (position.x > camera.upperRight.x + 1) spawned = false
    else if (position.x < camera.lowerLeft.x - 1) spawned = false
    else if (position.y < camera.lowerLeft.y - 1) spawned = false
    // else if (position.y > camera.upperRight.y + 1) spawn()

    if (!spawned && Math.random() < 0.00001 * camera.fov * camera.fov) spawn()

    if (growth < 1) growth += 0.01

    position.y -= 0.015 / (1 + sizeCoefficient)
  }

  function draw() {
    if (!spawned) return

    ctx.beginPath()
    ctx.arc(position.x, -position.y, size * growth, 0, TAU)
    ctx.fill()
  }

  function log() {
    console.log(`Snowflake is at ${position.toString()}`)
  }

  return {
    position,

    tick,
    draw,

    spawn,
    log,
  }
}

function Snow(spec, name = 'Snow') {
  const {
    self,
    screen,
    assets,
    density = 0.5,
    maxParticles = 100,
    spawnHeight = [8, 16],
    camera,
    ctx,
  } = Entity(spec, name)

  const particles = []

  let countdown = 3

  for (let i = 0; i < maxParticles; i++)
    particles.push(
      Flake({
        ctx,
        camera,
        spawnHeight,
      }),
    )

  function tick() {
    if (countdown) {
      countdown--
      return
    }

    // particles[0].log()

    for (let i = 0; i < maxParticles; i++) {
      particles[i].tick()
    }
  }

  function drawLocal() {
    ctx.fillStyle = 'white'

    for (let i = 0; i < maxParticles; i++) {
      particles[i].draw()
    }
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal)
  }

  return self.mix({ tick, draw })
}
