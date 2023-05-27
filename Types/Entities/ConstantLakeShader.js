function ConstantLakeShader(spec) {
  const { self, screen } = Entity(spec, 'ConstantLakeShader')

  const { quad } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  let shouldUpdate = 0
  let shouldRenderQuad = 0

  let shouldTick = false

  function draw() {
    quad.render()
    ctx.drawImage(quad.localCanvas, 0, 0, screen.width, screen.height)
    shouldTick = true
  }

  function tick() {
    if (shouldTick) {
      quad.update()
      shouldTick = false
    }
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
