function Sky(spec) {
  const { self, camera, screen, globalScope, assets, ctx } = Entity(spec, 'Sky')

  let { asset, margin } = spec

  let initialBounding
  image = _.get(assets, asset, $('#error-sprite'))
  let pos = [0, 0]
  let size = [0, 0]
  margin *= camera.worldToScreenScalar()

  function drawLocal() {
    if (image.height / image.width >= screen.height / screen.width) {
      pos = [
        0,
        screen.height / 2 - ((image.height / image.width) * screen.width) / 2,
      ]
      size = [screen.width, (image.height / image.width) * screen.width]
    } else {
      pos = [
        screen.width / 2 - ((image.width / image.height) * screen.height) / 2,
        0,
      ]
      size = [(image.width / image.height) * screen.height, screen.height]
    }

    let deltaX = Math.abs(camera.lowerLeft.x - initialBounding[0].x) / 10
    let deltaY = Math.abs(camera.lowerLeft.y - initialBounding[0].y) / 10

    screen.ctx.drawImage(
      image,
      pos[0] - margin - (1 - 1 / (1 + deltaX)) * margin,
      pos[1] - margin - (1 - 1 / (1 + deltaY)) * margin,
      size[0] + 2 * margin,
      size[1] + 2 * margin,
    )
  }

  function tick() {}

  function draw() {
    if (initialBounding == null)
      initialBounding = [{ ...camera.lowerLeft }, { ...camera.upperRight }]

    drawLocal()
  }

  return self.mix({
    tick,
    draw,
    asset,
  })
}
