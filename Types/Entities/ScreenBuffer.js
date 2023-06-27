function ScreenBuffer(spec) {
  const { self, screen } = Entity(spec, 'ScreenBuffer')

  let { postProcess = null, canvas: bufferCanvas, parameters } = spec

  if (!bufferCanvas) {
    bufferCanvas = document.createElement('canvas')
  }

  bufferCanvas.width = screen.width
  bufferCanvas.height = screen.height

  const bufferCtx = bufferCanvas.getContext('2d')
  bufferCtx.owner = 'ScreenBuffer' // For debugging

  function resize(width, height) {
    bufferCanvas.width = width
    bufferCanvas.height = height
  }

  function clear() {
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height)
  }

  function draw() {
    if (postProcess)
      postProcess(
        bufferCtx,
        bufferCanvas.width,
        bufferCanvas.height,
        parameters,
      )
    screen.ctx.drawImage(bufferCanvas, 0, 0, screen.width, screen.height)
    clear()
  }

  return _.mixIn(self, {
    draw,
    resize,
    parameters,

    get canvas() {
      return bufferCanvas
    },
  })
}
