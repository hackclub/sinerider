function Sky(spec) {
  const { self, screen, globalScope, assets, ctx } = Entity(spec, 'Sky')

  let { asset } = spec

  const image = _.get(assets, asset, $('#error-sprite'))
  const pos = Vector2()
  const size = Vector2()

  function draw() {
    // Position/scale background image to always cover the screen
    if (image.height / image.width >= screen.height / screen.width) {
      const adjustmentY = (screen.width * image.height) / image.width
      pos.set(0, (screen.height - adjustmentY) / 2)
      size.set(screen.width, adjustmentY)
    } else {
      const adjustmentX = (screen.height * image.width) / image.height
      pos.set((screen.width - adjustmentX) / 2, 0)
      size.set(adjustmentX, screen.height)
    }

    screen.ctx.drawImage(image, pos[0], pos[1], size[0], size[1])
  }

  return self.mix({
    draw,
    asset,

    get width() {
      return image.width
    },
    get height() {
      return image.height
    },
  })
}
