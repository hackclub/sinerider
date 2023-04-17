function ConstantLakeShader(spec) {
  const { self, screen } = Entity(spec, 'Shader')

  const { quad } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  let shouldUpdate = false
  let shouldRenderQuad = false

  function draw() {
    if (shouldRenderQuad) quad.render()
    shouldRenderQuad = !shouldRenderQuad
    ctx.drawImage(quad.localCanvas, 0, 0, screen.width, screen.height)
    // screen.ctx.fillStyle = '#f00'
    // screen.ctx.fillRect(0, 0, 5000, 5000)
  }

  function tick() {
    if (shouldUpdate) quad.update()
    shouldUpdate = !shouldUpdate
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
