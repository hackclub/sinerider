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

  vectorField = (x, y) => {
    const c = evaluator.evaluate({ x, y })
    
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

  function drawLocal() {
    // quad.draw()
    // ctx.drawImage(quad.getBuffer(), -xSize/2, -ySize/2 - 3, xSize, ySize - 3)
  }

  function draw() {
    
    quad.draw()
    ctx.drawImage(quad.getBuffer(), 0, 0, screen.width, screen.height)

    // drawLocal()
    // camera.drawThrough(ctx, drawLocal, transform)
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