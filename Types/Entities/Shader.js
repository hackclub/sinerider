function Shader(spec) {
  const { self, screen } = Entity(spec, 'Shader')

  const { quad } = spec

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
  }

<<<<<<< HEAD
  function draw() {
    // quad.draw(Math.max(0, walkerPosition.x / 20))
    sunsetQuad.draw(walkerPosition.x / 20)
    ctx.drawImage(sunsetQuad.canvas, 0, 0, screen.width, screen.height)
  }

  function resize() {
    sunsetQuad.resize(innerWidth, innerHeight)
=======
  function resize(width, height) {
    if (quad.resize) quad.resize(width, height)
>>>>>>> main
  }

  return _.mixIn(self, {
    draw,
    resize,
    tick,

    transform,
  })
}
