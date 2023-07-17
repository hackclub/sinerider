function WaterQuad(spec) {
  const { assets } = spec

  const canvas = document.createElement('canvas')

  canvas.width = 1024
  canvas.height = 1024

  gl = canvas.getContext('webgl')
  if (!gl) {
    return alert(
      'Your browser does not support WebGL. Try switching or updating your browser!',
    )
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const utils = GLUtils(gl)

  const quad = utils.Vertices(gl.STATIC_DRAW, {
    aCoords: {
      type: 'vec2',
      data: [-1, -1, -1, 1, 1, -1, 1, 1],
    },
    aTexCoords: {
      type: 'vec2',
      data: [0, 0, 0, 1, 1, 0, 1, 1],
    },
  })

  const shaders = assets.shaders

  const ctx = screen.ctx

  const waterProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.lake_frag,
  })

  let t = 0

  function update() {
    t += 0.01
  }

  function draw() {
    waterProgram
      .use()
      .vertices(quad)
      .uniform('time', t)
      .viewport(canvas.width, canvas.height)
      .draw(gl.TRIANGLE_STRIP, 4)
  }

  return {
    update,
    draw,
    name: 'WaterQuad',
    get canvas() {
      return canvas
    },
  }
}
