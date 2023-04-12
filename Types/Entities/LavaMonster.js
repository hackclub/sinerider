function LavaMonster(spec) {
  const { self, camera, screen } = Entity(spec, 'LavaMonster')

  const { world, globalScope } = spec

  const transform = Transform(spec, self)

  const roar = _.get(assets, 'sounds.lava_monster_roar')

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
    x: 3.5,
    y: 0,
    size: 6,
  })

  let roarPlayed = false

  function draw() {}

  function tick() {
    transform.position.x = 0
    transform.position.y = 110

    if (world.level?.sledders) {
      const x = world.level.sledders[0].transform.x

      const tangentAngle = Math.atan(-(x - 250) / 150)
      transform.rotation = tangentAngle
      transform.position.y = 40 - ((x - 200) / 6) ** 2
      transform.position.x = (x - 5) * 1.01

      const t = 1 / (1 + Math.exp(-0.3 * (x - 195)))

      jaw.transform.y = -4 + 4 * t

      if (x > 170 && !roarPlayed) {
        roar.play()
        roarPlayed = true
      }
    }
  }

  return self.mix({
    transform,
    tick,
    draw,
  })
}
