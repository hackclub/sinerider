function ConstantLakeShader(spec) {
  const { self, screen } = Entity(spec, 'ConstantLakeShader')

  const { quad } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  let shouldUpdate = 0
  let shouldRenderQuad = 0

  function draw() {
    if (shouldRenderQuad++ % 3 == 0) quad.render()
    ctx.drawImage(quad.localCanvas, 0, 0, screen.width, screen.height)
    // screen.ctx.fillStyle = '#f00'
    // screen.ctx.fillRect(0, 0, 5000, 5000)
  }

  function tick() {
    if (shouldUpdate++ % 3 == 0) quad.update()
  }

  function resize(width, height) {
    quad.resize(width, height)
  }

  return _.mixIn(self, {
    draw,
    resize,
    tick,

    transform,
  })
}
