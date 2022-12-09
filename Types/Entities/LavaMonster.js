function LavaMonster(spec) {
  const {
    self,
    camera,
    screen,
  } = Entity(spec, 'LavaMonster')

  const transform = Transform(spec, self)

  transform.position.x = 150 // Lava x
  transform.position.y = 0

  const sprite = Sprite({
    parent: self,
    drawOrder: self.drawOrder,
    asset: 'images.lavamonster',
    camera,
    assets,
    screen,
    size: 15,
  })

  function draw() {

  }

  function tick() {
    if (world.level?.sledders) {
      const x = world.level.sledders[0].transform.x
      transform.position.y = 40 - ((x-200)/6)**2
      transform.position.x = (x - 5) * 1.01
    }
  }

  return self.mix({
    transform,
    tick,
    draw,
  })
}