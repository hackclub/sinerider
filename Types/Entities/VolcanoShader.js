function VolcanoShader(spec) {
  const { self, screen } = Entity(spec, 'Shader')

  const { quad, sledders } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  function draw() {
    quad.render()
    ctx.drawImage(quad.localCanvas, 0, 0, screen.width, screen.height)
    // screen.ctx.fillStyle = '#f00'
    // screen.ctx.fillRect(0, 0, 5000, 5000)
  }

  function tick() {
    if (quad.tick) quad.tick()
    const vel = sledders[0]?.velocity ?? 20
    // quad.kernelWidth = Math.min(vel/40 * 4, 10)
  }

  function resize(width, height) {
    if (quad.resize) quad.resize(width, height)
  }

  return _.mixIn(self, {
    draw,
    resize,
    tick,

    transform,
  })
}
