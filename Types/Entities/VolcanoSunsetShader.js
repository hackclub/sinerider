function VolcanoSunsetShader(spec) {
  const { self, screen, assets } = Entity(spec, 'VolcanoSunsetShader')

  const { getSledderPosition, defaultExpression } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  const quad = VolcanoSunsetQuad({
    defaultExpression,
    assets,
    getSledderPosition,
  })

  function draw() {
    quad.render()
    ctx.drawImage(quad.localCanvas, 0, 0, screen.width, screen.height)
  }

  function tick() {
    quad.update()
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
