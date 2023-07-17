let sunsetTime = 0
function VolcanoSunsetQuad(spec) {
  const { defaultExpression, getSledderPosition, assets } = spec

  let local = document.createElement('canvas')

  local.width = innerWidth
  local.height = innerHeight

  gl = local.getContext('webgl')
  if (!gl) {
    return alert(
      'Your browser does not support WebGL. Try switching or updating your browser!',
    )
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const utils = GLUtils(gl)
  const ext = utils.InstancingExtension()

  const line = utils.Vertices(gl.STATIC_DRAW, {
    vertexId: {
      type: 'float',
      data: [0, 1, 2, 3],
    },
  })

  const shaders = assets.shaders

  const quad = utils.quad

  const blendProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.volcano_blend,
  })

  const pointsProgram = utils.Program({
    vert: shaders.volcano.volcano_stars_vert,
    frag: shaders.volcano.volcano_stars_frag,
  })

  const sunsetProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.volcano_sunset,
  })

  const particleCount = 1000

  // [ x, y ]
  const oldParticlePositions = new Float32Array(particleCount * 2)
  const newParticlePositions = new Float32Array(particleCount * 2)
  const particleColors = new Float32Array(particleCount * 3)
  const percentLifeLived = new Float32Array(particleCount)

  const lifetimes = new Float32Array(particleCount) // Only used CPU side

  function genParticleColor() {
    // const c = Math.random() * 0.5 + 0.5
    const c1 = Math.random() * 0.3 + 0.7
    const c2 = Math.random() * 0.2 + 0.1
    const c3 = Math.random() * 0.1
    const scale = 1.0 // Math.pow(Math.random(), 2.0) * 0.8 + 0.2
    return [c1 * scale, c2 * scale, c3 * scale]
  }

  function createParticleAt(index) {
    const posIndex = 2 * index
    const colIndex = 3 * index

    const x = Math.random()
    const y = Math.random()

    oldParticlePositions[posIndex] = x
    oldParticlePositions[posIndex + 1] = y

    newParticlePositions[posIndex] = x
    newParticlePositions[posIndex + 1] = y

    const col = genParticleColor()

    particleColors[colIndex] = col[0]
    particleColors[colIndex + 1] = col[1]
    particleColors[colIndex + 2] = col[2]

    const lifetime = Math.random() * 4 + 4 // 5-10

    lifetimes[index] = lifetime
    percentLifeLived[index] = 0
  }

  for (let i = 0; i < particleCount; i++) {
    createParticleAt(i)
  }

  const oldParticlePositionsBuffer = utils.Array(
    oldParticlePositions,
    gl.DYNAMIC_DRAW,
  )
  const newParticlePositionsBuffer = utils.Array(
    newParticlePositions,
    gl.DYNAMIC_DRAW,
  )
  const percentLifeLivedBuffer = utils.Array(percentLifeLived, gl.DYNAMIC_DRAW)
  const particleColorBuffer = utils.Array(particleColors, gl.DYNAMIC_DRAW)

  // const input = document.querySelector('input')

  const eta = 0.004
  t = 0

  function updateParticlePositions(vectorField) {
    for (let i = 0; i < particleCount; i++) {
      const index = 2 * i

      const normX = newParticlePositions[index]
      const normY = newParticlePositions[index + 1]

      // If out of bounds of canvas or end of life then reset
      if (
        percentLifeLived[i] > 1 ||
        Math.abs(normX) > 1 ||
        Math.abs(normY) > 1
      ) {
        createParticleAt(i)
        continue
      }

      const x = (normX - 0.5) * 10
      const y = (normY - 0.5) * 10

      const [dx, dy] = vectorField(x, y, t)

      const newX = eta * tickDelta * dx + normX
      const newY = eta * tickDelta * dy + normY

      // otherwise nudge w/ gradient
      oldParticlePositions[index] = normX
      oldParticlePositions[index + 1] = normY

      newParticlePositions[index] = newX
      newParticlePositions[index + 1] = newY

      percentLifeLived[i] += 1 / (lifetimes[i] * ticksPerSecond)
    }
  }

  /*
  triple buffer swap:
  render new frame to current
  store old in acc
  blend current and acc to blend
  swap blend and acc
  display acc
  */

  // TODO: Handle resizing
  let current = utils.Texture([local.width, local.height], gl.RGBA)
  let acc = utils.Texture([local.width, local.height], gl.RGBA)
  let blend = utils.Texture([local.width, local.height], gl.RGBA)

  const step = utils.Framebuffer()

  function resize(width, height) {
    local.width = width
    local.height = height

    current.destroy()
    current = utils.Texture([width, height], gl.RGBA)
    acc = acc.resize(width, height, gl.RGBA)
    blend.destroy()
    blend = utils.Texture([width, height], gl.RGBA)
  }

  let last = null

  let evaluator = math.compile(defaultExpression)

  function setVectorFieldExpression(text) {
    try {
      const e = math.compile(text)
      e.evaluate({ x: 0, y: 0 }) // Make sure can evaluate properly
      evaluator = e
    } catch (err) {}
  }

  function vectorField(x, y, t) {
    const c = evaluator.evaluate({ x, y, t })

    try {
      // Either real or complex
      return typeof c === 'number' ? [c, 0] : [math.re(c), math.im(c)]
    } catch (ex) {
      return [0, 0]
    }
  }

  function update() {
    const now = performance.now()
    const delta = last ? now - last : 0
    last = now

    t += delta * 0.00005

    // console.log(vectorField)
    updateParticlePositions(vectorField)
    oldParticlePositionsBuffer.data(oldParticlePositions)
    newParticlePositionsBuffer.data(newParticlePositions)
    percentLifeLivedBuffer.data(percentLifeLived)
    particleColorBuffer.data(particleColors)

    // sunsetTime = world.level.sledders[0].transform.x/221 * 12
    const x = getSledderPosition()
    sunsetTime = 12 * Math.exp(-(((x - 221) / 100) ** 2))
  }

  // `START_STARS_FADE_IN` constant as defined in sunset.frag
  const START_STARS_FADE_IN = 0.0

  // Pass in progress parameter (x distance)
  function render() {
    // console.log('time', progress, 'iTime', 5 * progress)

    // const iTime = (world.level.firstWalkerX / 20.0 + 0.7) * 5
    const iTime = 10

    // Only bother rendering stars if faded in at all
    // subtract 1 b/c uv and length(skyCol)
    // Draw points
    step.bind()
    step.setColorAttachment(current)
    pointsProgram
      .use()
      .vertices(line)
      .instancedAttributes(ext, oldParticlePositionsBuffer, [
        { type: 'vec2', name: 'oldParticlePos', perInstance: 1 },
      ])
      .instancedAttributes(ext, newParticlePositionsBuffer, [
        { type: 'vec2', name: 'newParticlePos', perInstance: 1 },
      ])
      .instancedAttributes(ext, particleColorBuffer, [
        { type: 'vec3', name: 'particleColor', perInstance: 1 },
      ])
      .instancedAttributes(ext, percentLifeLivedBuffer, [
        { type: 'float', name: 'percentLifeLived', perInstance: 1 },
      ])
      .uniform('resolution', [local.width, local.height])
      .viewport(local.width, local.height)
      .drawInstanced(ext, gl.TRIANGLE_STRIP, 4, particleCount)

    // Blend
    step.bind()
    step.setColorAttachment(blend)
    current.bind(0)
    acc.bind(1)
    blendProgram
      .use()
      .resetVerticesInstancing(ext, quad)
      .vertices(quad)
      .uniform('resolution', [local.width, local.height])
      .uniformi('current', 0)
      .uniformi('acc', 1)
      .viewport(local.width, local.height)
      .draw(gl.TRIANGLE_STRIP, 4)

    // Swap blend and acc
    let tmp = acc
    acc = blend
    blend = tmp

    // Draw acc
    utils.bindDisplay()
    acc.bind(0)
    sunsetProgram
      .use()
      .vertices(quad)
      .uniform('resolution', [innerWidth, innerHeight])
      .uniform('time', sunsetTime)
      .uniformi('stars', 0)
      .viewport(local.width, local.height)
      .draw(gl.TRIANGLE_STRIP, 4)
  }

  return {
    render,
    resize,
    update,
    setVectorFieldExpression,
    resize,

    get localCanvas() {
      return local
    },
  }
}
