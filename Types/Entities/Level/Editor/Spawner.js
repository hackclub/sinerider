function Spawner(spec) {
  const { self, ctx } = Entity(spec, 'Spawner')

  const { prototype, uiCamera, globalScope, spawnerWidth, spawnerHeight } = spec

  const { generator, parameters } = prototype

  const transform = Transform()

  const entity = generator({
    parent: self,
    name: `${generator.name} Prototype`,
    drawOrder: LAYERS.ui,
    camera: uiCamera,
    active: false,
    screen,
    globalScope,
    assets,

    ...parameters,
  })

  if (entity.tick) entity.tick()

  const position = transform.position

  const bounds = Rect({
    center: position,
    width: spawnerWidth,
    height: spawnerHeight,
  })

  // const clickable = Clickable({
  //   // TODO
  // })

  function click() {
    // TODO: Clone prototype, pass to new Dragger()
  }

  function draw() {
    bounds.draw(ctx, uiCamera)

    entity.draw(ctx, uiCamera)
  }

  function adjust() {
    entity.transform.x = position.x
    entity.transform.y = position.y
    entity.calculatePositions()
  }

  return self.mix({
    // clickable,

    bounds,

    adjust,

    transform,

    draw,
    click,
  })
}
