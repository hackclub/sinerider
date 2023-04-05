/**
 * Volcano scene shader
 */
function VolcanoQuad(spec) {
  const ctx = screen.ctx

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

  const quadNoUV = utils.quadNoUV

  const shaders = assets.shaders

  const sourceProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.source,
  })

  const gaussianXProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.gaussian_x,
  })

  const gaussianYProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.gaussian_y,
  })

  const outputProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.output,
  })

  let sourceBuffer = utils.Texture([local.width, local.height], gl.RGBA)
  let gaussianXBuffer = utils.Texture([local.width, local.height], gl.RGBA)
  let gaussianYBuffer = utils.Texture([local.width, local.height], gl.RGBA)

  const fb = utils.Framebuffer()

  function resize(width, height) {
    local.width = width
    local.height = height

    sourceBuffer.destroy()
    sourceBuffer = utils.Texture([width, height], gl.RGBA)
    gaussianXBuffer.destroy()
    gaussianXBuffer = utils.Texture([width, height], gl.RGBA)
    gaussianYBuffer.destroy()
    gaussianYBuffer = utils.Texture([width, height], gl.RGBA)
  }

  let time = 0
  let kernelWidth = 0

  let frame = utils.Texture([canvas.width, canvas.height], gl.RGBA)

  function render() {
    time += 0.1

    const x = world.level.cutsceneDistanceParameter
    const sunsetTime = (x / 150) * 12

    frame.image(canvas, gl.RGBA)

    fb.bind()
    fb.setColorAttachment(sourceBuffer)

    frame.bind(0)
    sourceProgram
      .use()
      .vertices(quad)
      .uniform('resolution', [local.width, local.height])
      .uniform('time', sunsetTime)
      .uniformi('frame', 0)
      .viewport(local.width, local.height)
      .draw(gl.TRIANGLE_STRIP, 4)

    fb.bind()
    fb.setColorAttachment(gaussianXBuffer)

    sourceBuffer.bind(0)

    gaussianXProgram
      .use()
      .vertices(quad)
      .uniform('resolution', [local.width, local.height])
      .uniform('time', time)
      .uniform('kernelWidth', kernelWidth)
      .uniformi('source', 0)
      .viewport(local.width, local.height)
      .draw(gl.TRIANGLE_STRIP, 4)

    fb.bind()
    fb.setColorAttachment(gaussianYBuffer)

    gaussianXBuffer.bind(0)

    gaussianYProgram
      .use()
      .vertices(quad)
      .uniform('resolution', [local.width, local.height])
      .uniform('time', time)
      .uniform('kernelWidth', kernelWidth)
      .uniformi('gaussianX', 0)
      .viewport(local.width, local.height)
      .draw(gl.TRIANGLE_STRIP, 4)

    utils.bindDisplay()
    gaussianYBuffer.bind(0)

    const _sunsetTime = 12 * Math.exp(-(((x - 221) / 100) ** 2))

    outputProgram
      .use()
      .vertices(quadNoUV)
      .uniform('resolution', [local.width, local.height])
      .uniform('time', time)
      .uniform('progress', _sunsetTime)
      .uniform('opacity', 1)
      .uniformi('gaussianY', 0)
      .viewport(local.width, local.height)
      .draw(gl.TRIANGLE_STRIP, 4)
  }

  return {
    render,
    resize,

    set kernelWidth(v) {
      kernelWidth = v
    },
    get localCanvas() {
      return local
    },
  }
}
