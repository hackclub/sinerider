function LavaQuad(assets) {
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

  const shaders = assets.shaders

  const lavaProgram = utils.Program({
    vert: shaders.quad_vert,
    frag: shaders.volcano.lava,
  })

  let t = 0

  function update() {
    t += 0.01
  }

  function draw() {
    // TODO: Move to shared state
    // TODO: Fix and reuse quad logic/entity wrapper
    const x = world.level.sledders[0].transform.x
    const sunsetTime = 12 * Math.exp(-(((x - 221) / 100) ** 2))
    lavaProgram
      .use()
      .vertices(utils.quad)
      .uniform('t', t)
      .uniform('progress', sunsetTime)
      .viewport(canvas.width, canvas.height)
      .draw(gl.TRIANGLE_STRIP, 4)
  }

  return {
    update,
    draw,
    name: 'LavaQuad',
    get canvas() {
      return canvas
    },
  }
}
