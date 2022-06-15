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
    camera,
    assets,
    fullscreen = false,
    shaderSource = 'default',
    xRes = 320,
    yRes = 320,
    xSize = 100,
    ySize = 100,
  } = Entity(spec, 'Shader')

  const ctx = screen.ctx

  const transform = Transform(spec, self)

  const framebuffer = document.createElement('canvas')

  framebuffer.width = xRes
  framebuffer.height = yRes
  framebuffer.display = 'none' // Hidden

  framebuffer.id = 'framebuffer'

  const quad = new Quad(assets.shaders[shaderSource], framebuffer)

  function drawLocal() {
    quad.draw()
    ctx.drawImage(framebuffer, -xSize/2, -ySize/2, xSize, ySize)
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

  // TODO: Refactor mix()/_.mixIn() calls to use spread op?
  return self.mix({
    draw,
    resize,

    transform,
  })
}