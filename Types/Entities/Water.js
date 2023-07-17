function Water(spec) {
  const { self, screen, camera } = Entity(spec, 'Water')

  let { size, lava = false } = spec

  const waterQuad = (lava ? LavaQuad : WaterQuad)({
    assets,
  })

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  function tick() {
    waterQuad.update()
  }

  function drawLocal() {
    waterQuad.draw()
    ctx.drawImage(waterQuad.canvas, 0, 0, size, size)
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }

  return _.mixIn(self, {
    tick,
    draw,
    transform,
    waterQuad,
    set size(_size) {
      size = _size
    },
  })
}
