/*

Shader "class" has to do:
  * create and own canvas object (off-screen framebuffer)
  * create Regl/WebGL context using off-screen canvas
  * render quad with specified shaderSource onto canvas
  * read canvas to JS Image object
  * render Image onto game canvas

*/

function Shader(spec) {
  const {
    self,
    screen,
  } = Entity(spec, 'Shader')

  const {
    fullscreen = false,
    xSize = 100,
    ySize = 100,
    quad,
  } = spec

  // console.log('screen', screen)

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  // console.log('quad in shader construction', quad)

  function drawLocal() {
    quad.draw()
    ctx.drawImage(quad.getBuffer(), -xSize/2, -ySize/2, xSize, ySize)
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }

  function resize() {
    if (fullscreen) {
      xRes = screen.size.x
      yRes = screen.size.y
    }
  }

  return _.mixIn(self, {
    draw,
    resize,

    transform,
  })
}