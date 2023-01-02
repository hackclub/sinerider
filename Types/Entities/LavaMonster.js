function LavaMonster(spec) {
  const {
    self,
    camera,
    screen,
  } = Entity(spec, 'LavaMonster')

  const {
    world,
    globalScope
  } = spec

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

  const jaw = Sprite({
    parent: self,
    drawOrder: self.drawOrder,
    asset: 'images.lavamonster_jaw',
    camera,
    assets,
    screen,
    x: 2,
    y: -3.2,
    size: 2.5,
  })

  function draw() {

  }

  function tick() {
    transform.position.x = 0
    transform.position.y = 110

    if (world.level?.sledders) {
      const x = world.level.sledders[0].transform.x

      const tangentAngle = Math.atan(-(x-200)/170)
      transform.rotation = tangentAngle
      transform.position.y = 40 - ((x-200)/6)**2
      transform.position.x = (x - 5) * 1.01

      const t = 1/(1 + Math.exp(-2*(x-200)))

      jaw.transform.y = -6.2 + 3*t
    }
  }

  return self.mix({
    transform,
    tick,
    draw,
  })
}