/**
 * Sunset shader class for Constant Lake scene
 */
function Sunset(canvas, assets) {
  gl = canvas.getContext('webgl')
  if (!gl) {
      return alert('Your browser does not support WebGL. Try switching or updating your browser!')
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const utils = GLUtils(gl)
  const ext = utils.InstancingExtension()

  const line = utils.Vertices(gl.STATIC_DRAW, {
      'vertexId': {
          type: 'float',
          data: [ 0, 1, 2, 3 ]
      }
  })

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
              0, 0,
              0, 1,
              1, 0,
              1, 1,
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
      frag: shaders.blend_frag,
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
  
  // [ x, y ]
  const oldParticlePositions = new Float32Array(particleCount * 2)
  const newParticlePositions = new Float32Array(particleCount * 2)
  const particleColors = new Float32Array(particleCount * 3)
  const livedFor = new Float32Array(particleCount)

  function genParticleColor() {
      return [ Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.5 + 0.5 ]
  }

  for (let i = 0; i < particleCount; i++) {
      const posIndex = 2 * i
      const colIndex = 3 * i

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

      livedFor[i] = 0
  }

  const oldParticlePositionsBuffer = utils.Array(oldParticlePositions, gl.DYNAMIC_DRAW)
  const newParticlePositionsBuffer = utils.Array(newParticlePositions, gl.DYNAMIC_DRAW)
  const livedForBuffer = utils.Array(livedFor, gl.DYNAMIC_DRAW)
  const particleColorBuffer = utils.Array(particleColors, gl.DYNAMIC_DRAW)

  const input = document.querySelector('input')

  input.value = '[x, y]'

  let F = new Function('x', 'y', 't', `return ${input.value}`)

  input.onkeyup = () => {
      try {
          const func = new Function('x', 'y', 't', `return ${input.value}`)
          func(0, 0, 0)
          F = func
      } catch (err) {
      }
  }

  const eta = 0.0009;
  t = 0

  function updateParticlePositions() {
      for (let i = 0; i < particleCount; i++) {
          const index = 2 * i

          const normX = newParticlePositions[index]
          const normY = newParticlePositions[index + 1]

          const x = (normX - .5) * 10
          const y = (normY - .5) * 10

          const [dx, dy] = F(x, y, t)

          const newX = eta * dx + normX
          const newY = eta * dy + normY

          // If out of bounds of canvas then reset
          if (Math.abs(newX) > 1 || Math.abs(newY) > 1) {
              const resetX = Math.random()
              const resetY = Math.random()
              
              oldParticlePositions[index] = resetX
              oldParticlePositions[index + 1] = resetY

              newParticlePositions[index] = resetX
              newParticlePositions[index + 1] = resetY

              const colIndex = 3 * i
              const col = genParticleColor()

              particleColors[colIndex] = col[0]
              particleColors[colIndex + 1] = col[1]
              particleColors[colIndex + 2] = col[2]

              livedFor[i] = 0
          } else {
              // otherwise nudge w/ gradient
              oldParticlePositions[index] = normX
              oldParticlePositions[index + 1] = normY

              newParticlePositions[index] = newX
              newParticlePositions[index + 1] = newY

              livedFor[i] += 0.03
          }
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
  const current = utils.Texture([ canvas.width, canvas.height ], gl.RGBA)
  let acc = utils.Texture([ canvas.width, canvas.height ], gl.RGBA)
  let blend = utils.Texture([ canvas.width, canvas.height ], gl.RGBA)

  const step = utils.Framebuffer()


  let last = performance.now()

  function update() {
      const now = performance.now()
      const delta = now - last
      last = now

      t += delta * 0.00005

      updateParticlePositions()
      oldParticlePositionsBuffer.data(oldParticlePositions)
      newParticlePositionsBuffer.data(newParticlePositions)
      livedForBuffer.data(livedFor)
      particleColorBuffer.data(particleColors)
  }

  function draw() {
      const start = performance.now()

      // draw points
      step.bind()
      step.setColorAttachment(current)
      pointsProgram.use()
          .vertices(line)
          .instancedAttributes(oldParticlePositionsBuffer, ext, [
              { type: 'vec2', name: 'oldParticlePos', perInstance: 1 }
          ])
          .instancedAttributes(newParticlePositionsBuffer, ext, [
              { type: 'vec2', name: 'newParticlePos', perInstance: 1 }
          ])
          .instancedAttributes(livedForBuffer, ext, [
              { type: 'float', name: 'livedFor', perInstance: 1 }
          ])
          .instancedAttributes(particleColorBuffer, ext, [
              { type: 'vec3', name: 'particleColor', perInstance: 1 }
          ])
          .viewport(canvas.width, canvas.height)
          // .drawInstanced(ext, gl.TRIANGLE_STRIP, 4, particleCount)
          .drawInstanced(ext, gl.TRIANGLE_STRIP, 4, particleCount)

      // blend
      step.bind()
      step.setColorAttachment(blend)
      current.bind(0)
      acc.bind(1)
      blendProgram.use()
          .resetVerticesInstancing(ext, quad)
          .vertices(quad)
          .uniform('resolution', [ canvas.width, canvas.height ])
          .uniformi('current', 0)
          .uniformi('acc', 1)
          .viewport(canvas.width, canvas.height)
          .draw(gl.TRIANGLE_STRIP, 4)

      let tmp = acc
      acc = blend
      blend = tmp

      // draw acc
      utils.bindDisplay()
      acc.bind(0)
      sunsetProgram.use()
          .vertices(quad)
          .uniform('resolution', [ canvas.width, canvas.height ])
          .uniform('time', t)
          .uniformi('texture', 0)
          .viewport(canvas.width, canvas.height)
          .draw(gl.TRIANGLE_STRIP, 4)
      
      const end = performance.now()

  }

  function getBuffer() {
    return canvas
  }

  return {
    draw,
    update,
    getBuffer
  }
}