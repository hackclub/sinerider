function Text(spec) {
  const { self, screen } = Entity(spec, 'Text')

  const transform = Transform(spec)

  const {
    camera,
    size = 1,
    fill = '#222',
    stroke = false,
    align = 'center',
    baseline = 'middle',
    font = 'Edu QLD Beginner',
  } = spec

  let { content = 'Hello' } = spec

  const ctx = screen.ctx

  function drawLocal() {
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.scale(size, size)

    ctx.font = `1px ${font}`

    if (fill) {
      ctx.fillStyle = fill
      ctx.fillText(content, 0, 0)
    }
    if (stroke) {
      ctx.fillStyle = stroke
      ctx.strokeText(content, 0, 0)
    }
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }

  return self.mix({
    draw,
  })
}
