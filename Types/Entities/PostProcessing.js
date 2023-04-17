function PostProcessing(spec) {
  const { self, screen } = Entity(spec, 'Post-processing Layer')

  const { process } = spec

  const ctx = screen.ctx

  function draw() {
    ctx.save()
    process(ctx)
    ctx.drawImage(screen.canvas, 0, 0, screen.width, screen.height)
    ctx.restore()
  }

  return _.mixIn(self, {
    draw,
  })
}
