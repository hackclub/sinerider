let evaluator
let vectorField

function Shader(spec) {
  const {
    self,
    screen,
  } = Entity(spec, 'Shader')

  const {
    fullscreen = false,
    xSize = 10,
    ySize = 10,
    quad,
  } = spec

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  evaluator = math.compile('x + y * i')

  vectorField = (x, y, t) => {
    const c = evaluator.evaluate({ x, y, t })
    
    // Either real or complex
    return typeof c === 'number'
      ? [ c, 0 ]
      : [ c.re, c.im ]
  }

  function setVectorFieldExpression(text) {
    console.log('text', text)

    try {
      const e = math.compile(text)
      e.evaluate({ x: 0, y: 0 }) // Make sure can evaluate properly
      evaluator = e
      console.log('Set new evaluator to: ', text, evaluator)
    } catch (err) {}
  }

  function tick() {
    quad.update(vectorField)
  }

  function draw() {
    quad.draw()
    ctx.drawImage(quad.getBuffer(), 0, 0, screen.width, screen.height)
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