function Shader(spec) {
  const {
    self,
    screen,
  } = Entity(spec, 'Shader')

  const {
    fullscreen = false,
    quad,
    walkerPosition,
    defaultExpression,
  } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  let evaluator = math.compile(defaultExpression)

  function vectorField(x, y, t) {
    const c = evaluator.evaluate({ x, y, t })
    
    try {
      // Either real or complex
      return typeof c === 'number'
        ? [ c, 0 ]
        : [ math.re(c), math.im(c) ]
    }
    catch (ex) {
      return [0, 0]
    }
  }

  function setVectorFieldExpression(text) {
    try {
      const e = math.compile(text)
      e.evaluate({ x: 0, y: 0 }) // Make sure can evaluate properly
      evaluator = e
    } catch (err) {}
  }

  function tick() {
    quad.update(vectorField)
  }

  function draw() {
    // quad.draw(Math.max(0, walkerPosition.x / 20))
    quad.draw(walkerPosition.x / 20)
    ctx.drawImage(quad.canvas, 0, 0, screen.width, screen.height)
  }

  function resize() {
    if (fullscreen) {
      xRes = screen.size.x
      yRes = screen.size.y
    }
  }

  return _.mixIn(self, {
    tick,
    draw,
    resize,

    transform,

    setVectorFieldExpression,
  })
}