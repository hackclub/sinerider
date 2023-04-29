function Cloud(spec) {
  const {
    ctx,
    camera,
    heightRange,
    speedRange,
    sizeRange,
    aspectRange,
    assets,
  } = spec

  let size
  let asset
  let speed
  let flipX
  let flipY
  let aspect
  let assetAspect
  let opacity
  let distance
  let progress = 0
  let spawned = false
  let initialized = false

  const startPosition = Vector2()
  const endPosition = Vector2()
  const deltaPosition = Vector2()

  const position = Vector2()

  function spawn() {
    startPosition.x = math.lerp(
      camera.lowerLeft.x,
      camera.upperRight.x,
      Math.random(),
    )

    startPosition.y = math.lerp(
      heightRange[0],
      heightRange[1],
      Math.pow(Math.random(), 1.5),
    )

    endPosition.set(startPosition)
    distance = math.lerp(12, 24, Math.random())
    endPosition.x += Math.random() < 0.5 ? -distance : distance

    endPosition.subtract(startPosition, deltaPosition)

    aspect = math.lerp(aspectRange[0], aspectRange[1], Math.random())

    size = math.lerp(sizeRange[0], sizeRange[1], Math.random())
    speed = math.lerp(speedRange[0], speedRange[1], Math.random())
    asset = assets.images['cloud_' + (Math.floor(Math.random() * 9.9999) + 1)]
    assetAspect = asset.width / asset.height

    flipX = Math.random() < 0.5 ? 1 : 1
    flipY = Math.random() < 0.5 ? 1 : 1

    progress = 0

    spawned = true
    initialized = true
  }

  function tick() {
    // if (!spawned) return

    // if (position.x > camera.upperRight.x + 1) spawned = false
    // else if (position.x < camera.lowerLeft.x - 1) spawned = false
    // else if (position.y < camera.lowerLeft.y - 1) spawned = false
    // else if (position.y > camera.upperRight.y + 1) spawn()

    if (!spawned) spawn()

    progress += (speed * tickDelta) / distance
    startPosition.lerp(endPosition, progress, position)

    if (progress >= 1) spawn()
  }

  function draw() {
    if (!spawned) return

    // ctx.beginPath()
    // ctx.moveTo(startPosition.x, -startPosition.y)
    // ctx.lineTo(endPosition.x, -endPosition.y)
    // ctx.lineWidth = camera.screenToWorldScalar()
    // ctx.stroke()

    ctx.globalAlpha = (0.5 * Math.pow(1 - Math.cos(TAU * progress), 1)) / 2
    ctx.drawImage(
      asset,
      position.x - (aspect * flipX * size) / 2,
      -position.y - (flipY * size) / 2,
      assetAspect * aspect * size * flipX,
      size * flipY,
    )
  }

  function log() {
    console.log(
      `Cloud size ${Math.round(
        size,
      )} moving from ${startPosition.toString()} to ${endPosition.toString()} at speed ${math.truncate(
        speed,
      )} — ${math.truncate(progress)}`,
    )
  }

  function randomizeProgress() {
    progress = Math.random()
  }

  return {
    position,

    tick,
    draw,

    spawn,
    log,

    randomizeProgress,
  }
}

function Clouds(spec, name = 'Clouds') {
  const {
    self,
    screen,
    assets,
    density = 0.5,
    maxParticles = 5,
    sizeRange = [6, 12],
    heightRange = [8, 18],
    speedRange = [0.2, 0.8],
    aspectRange = [0.6, 1],
    camera,
    ctx,
  } = Entity(spec, name)

  const particles = []

  let countdown = 3

  let targetParticleCount = 0

  for (let i = 0; i < maxParticles; i++)
    particles.push(
      Cloud({
        ctx,
        camera,
        assets,
        sizeRange,
        speedRange,
        heightRange,
        aspectRange,
      }),
    )

  function tick() {
    targetParticleCount = Math.min(camera.fov * density, maxParticles)

    countdown--
    if (countdown > 0) return

    // particles[0].log()

    for (let i = 0; i < maxParticles; i++) {
      particles[i].tick()
    }

    if (countdown == 0) particles.forEach((v) => v.randomizeProgress())
  }

  function drawLocal() {
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'green'
    // ctx.globalCompositeOperation = 'lighten'

    for (let i = 0; i < maxParticles; i++) {
      particles[i].draw()
    }
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal)
  }

  return self.mix({ tick, draw })
}
