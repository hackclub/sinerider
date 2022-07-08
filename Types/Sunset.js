/**
 * Sunset shader class for Constant Lake scene
 */
function Sunset(canvas, assets) {
  const gl = canvas.getContext('webgl')
  if (!gl) {
      return alert('Your browser does not support WebGL. Try switching or updating your browser!')
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const utils = GLUtils(gl)
  const ext = utils.InstancingExtension()

  const quad = utils.Vertices(gl.STATIC_DRAW, {
      'aCoords': {
          type: 'vec2',
          data: [
              -1, -1,
              -1,  1,
               1, -1,
               1,  1,
          ]
      },
      'aTexCoords': {
          type: 'vec2',
          data: [
              0, 1,
              0, 0,
              1, 1,
              1, 0,
          ]
      }
  })

  const shaders = assets.shaders

  const quadProgram = utils.Program({
      vert: shaders.quad_vert,
      frag: shaders.quad_frag,
  })

  const blendProgram = utils.Program({
      vert: shaders.quad_vert,
      frag: shaders.quad_frag,
  })

  const pointsProgram = utils.Program({
      vert: shaders.points_vert,
      frag: shaders.points_frag,
  })

  const sunsetProgram = utils.Program({
      vert: shaders.quad_vert,
      frag: shaders.sunset_frag,
  })

  const particleCount = 5000
  
  // [ x, y, lifetime ]
  const particles = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
      const index = 3 * i
      particles[index] = Math.random()
      particles[index + 1] = Math.random()
      particles[index + 2] = Math.random()
  }

  const particlesBuffer = utils.Array(particles, gl.DYNAMIC_DRAW)

  const F = (x, y) => [x, y]

  const eta = 0.0004;

  function updateParticles() {
      for (let i = 0; i < particleCount; i++) {
          const index = 3 * i
          const normX = particles[index]
          const normY = particles[index + 1]
          const livedFor = particles[index + 2]

          const x = (normX - .5) * 10
          const y = (normY - .5) * 10

          const [dx, dy] = F(x, y)

          let newX = eta * dx + normX
          let newY = eta * dy + normY
          let newLivedFor = livedFor + 0.01

          if (Math.abs(newX) > 1 || Math.abs(newY) > 1) {
              newX = Math.random()
              newY = Math.random()
              newLivedFor = 0
          }

          particles[index] = newX
          particles[index + 1] = newY
          particles[index + 2] = newLivedFor
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
  let current = utils.Texture([ canvas.width, canvas.height ], gl.RGBA)
  let acc = utils.Texture([ canvas.width, canvas.height ], gl.RGBA)
  let blend = utils.Texture([ canvas.width, canvas.height ], gl.RGBA)

  const step = utils.Framebuffer()

  let t = 0

  let last = performance.now()

  function update() {
      const now = performance.now()
      const delta = now - last
      last = now

      t += delta * 0.00005

      updateParticles()
      particlesBuffer.data(particles)
  }

  function draw() {
      // Draw points
      step.bind()
      step.setColorAttachment(current)
      pointsProgram.use()
          .vertices(quad)
          .instancedAttribute(particlesBuffer, ext, [
              { type: 'vec3', name: 'particle', perInstance: 1 }
          ])
          .uniform('resolution', [ canvas.width, canvas.height ])
          .viewport(canvas.width, canvas.height)
          .drawInstanced(ext, gl.TRIANGLE_STRIP, 4, particleCount)

      // Blend
      step.bind()
      step.setColorAttachment(blend)
      current.bind(0)
      acc.bind(1)
      blendProgram.use()
          .vertices(quad)
          .uniform('resolution', [ canvas.width, canvas.height ])
          .uniformi('current', 0)
          .uniformi('acc', 1)
          .viewport(canvas.width, canvas.height)
          .draw(gl.TRIANGLE_STRIP, 4)

      // Swap acc and blend
      const tmp = acc
      acc = blend
      blend = tmp

      // Draw acc
      utils.bindDisplay()
      acc.bind(0)
      quadProgram.use()
          .vertices(quad)
          .uniform('resolution', [ canvas.width, canvas.height ])
          .uniform('time', t)
          .uniformi('texture', 0)
          .viewport(canvas.width, canvas.height)
          .draw(gl.TRIANGLE_STRIP, 4)


      // utils.bindDisplay()
      // acc.bind(0)
      // sunsetProgram.use()
      //     .vertices(quad)
      //     .uniform('resolution', [ canvas.width, canvas.height ])
      //     .uniform('time', t)
      //     .uniformi('texture', 0)
      //     .viewport(canvas.width, canvas.height)
      //     .draw(gl.TRIANGLE_STRIP, 4)
  }

  function getBuffer() {
    return canvas
  }

  return {
    update,
    draw,
    getBuffer,
  }
}