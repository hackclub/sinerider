function LavaMonster(spec) {
  const { self, camera, screen, assets } = Entity(spec, 'LavaMonster')

  const { getSledderPosition } = spec

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
    x: 2.5,
    y: 0,
    size: 7,
  })

  let roarPlayed = false

  function tick() {
    transform.position.x = 0
    transform.position.y = 110

    const x = getSledderPosition()

    const tangentAngle = Math.atan(-(x - 250) / 150)
    transform.rotation = tangentAngle
    transform.position.y = 48 - ((x - 200) / 6) ** 2
    transform.position.x = (x - 8) * 1.01

    const t = 1 / (1 + Math.exp(-0.3 * (x - 195)))

    jaw.transform.y = -10 + 4 * t
    jaw.transform.rotation = -10 + t / 2

    if (x > 170 && !roarPlayed) {
      roar.play()
      roarPlayed = true
    }
  }

  return self.mix({
    transform,
    tick,

    roar,
  })
}
