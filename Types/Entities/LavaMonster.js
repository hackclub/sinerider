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

  const bottomJaw = Sprite({
    parent: self,
    drawOrder: self.drawOrder,
    asset: 'images.lavamonster_bottom_jaw',
    camera,
    assets,
    screen,
    x: 2,
    y: -3.2,
    size: 2.5,
  })

  const topJaw = Sprite({
    parent: self,
    drawOrder: self.drawOrder,
    asset: 'images.lavamonster_top_jaw',
    camera,
    assets,
    screen,
    x: 2,
    y: -2,
    size: 2.5,
  })

  function draw() {

  }

  function tick() {
    transform.position.x = 0
    transform.position.y = 110

    const x = world.level.sledders[0]?.transform.x
    const t = 2.5*(1 - 1/(1 + Math.exp(-4*(x-190))))

    const theta = Math.PI/4 * Math.sin(t - Math.PI/2)

    topJaw.transform.rotation = theta * 0.7
    topJaw.transform.x = 1.7 + Math.cos(theta * 0.7) * 2.5/2
    topJaw.transform.y = -1.5 + Math.sin(theta * 0.7) * 2.5/2

    bottomJaw.transform.rotation = -theta * 0.5
    bottomJaw.transform.x = 1.5 + Math.cos(-theta * 0.5) * 2.5/2
    bottomJaw.transform.y = -3.2 + Math.sin(-theta * 0.5) * 2.5/2

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