function Flake(spec) {
  const { ctx, camera, spawnHeight, colorRange } = spec

  let growth
  let size
  let sizeCoefficient
  let spawned = false
  const position = Vector2()
  const color = Color()

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

    // colorRange[0].lerp(colorRange[1], Math.random(), color)
    color.set(Math.random() < 0.7 ? colorRange[0] : colorRange[1])

    spawned = true
  }

  function tick() {
    if (position.x > camera.upperRight.x + 1) spawned = false
    else if (position.x < camera.lowerLeft.x - 1) spawned = false
    else if (position.y < camera.lowerLeft.y - 1) spawned = false
    // else if (position.y > camera.upperRight.y + 1) spawned = false

    if (!spawned) {
      if (Math.random() < 0.00001 * camera.fov * camera.fov) spawn()
      return
    }

    if (growth < 1) growth += 0.01

    position.y -= 0.015 / (1 + sizeCoefficient)
  }

  function draw() {
    if (!spawned) return

    ctx.moveTo(position.x, -position.y)
    ctx.arc(position.x, -position.y, size * growth, 0, TAU)
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
    colorRange = [Color('#b8bdda'), Color('#e1b0f0')],
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
        colorRange,
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
    ctx.beginPath()
    for (let i = 0; i < maxParticles; i++) {
      particles[i].draw()
    }
    ctx.fillStyle = colorRange[0].hex
    ctx.globalAlpha = 0.7
    ctx.fill()
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal)
  }

  return self.mix({ tick, draw })
}
