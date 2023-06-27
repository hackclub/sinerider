function SpawnerPanel(spec) {
  const { self, screen, camera, ctx } = Entity(spec, 'EditorSpawner')

  const { globalScope } = spec

  // 1 -> 50px
  const width = 10
  const height = 2
  const hPadding = 0
  const vPadding = 0.1
  const marginTop = 0.3
  const gap = 0.5

  const rectTransform = Transform({
    x: 0,
    y: 0,
  })

  const rect = Rect({
    transform: rectTransform,
    width: 1,
    heigth: 1,
  })

  const uiCamera = Camera({
    screen,
  })

  const prototypes = [
    // DynamicGoal({
    //   // default spec
    // }),
    // FixedGoal({
    //   // default spec
    // }),
    {
      generator: PathGoal,
      parameters: {
        type: 'path',
        expression: 'x',
        pathX: 4,
        x: 0,
        y: 0,
      },
    },
  ]

  const spawners = []

  const spawnerWidth =
    (width - 2 * hPadding - gap * (prototypes.length - 1)) / prototypes.length
  const spawnerHeight = height - 2 * vPadding

  for (const prototype of prototypes) {
    if (prototype.tick) prototype.tick()
    const spawner = Spawner({
      parent: self,
      screen,
      uiCamera,
      globalScope,
      spawnerWidth,
      spawnerHeight,
      prototype,
    })
    spawners.push(spawner)
  }

  adjust()

  function resize() {
    adjust()
  }

  function adjust() {
    // HACK: Define custom camera such that 1 unit -> 50px fixed in screen
    uiCamera.fov = 0.015 * Math.min(screen.width, screen.height)
    // uiCamera.fov = Math.min(screen.width, screen.height)

    // 1 unit -> 5000px

    uiCamera.tick()

    rect.width = width
    rect.height = height

    const panelCenter = Vector2(
      0,
      uiCamera.upperRight.y - marginTop - rect.height / 2,
    )

    // 1 unit -> 50px
    rect.center = panelCenter

    spawners.forEach((spawner, i) => {
      const leftX = -width / 2 + hPadding + i * (spawnerWidth + gap)
      const middleX = leftX + spawnerWidth / 2
      const middleY = panelCenter.y

      spawner.transform.position.set(middleX, middleY)
    })

    self.sendEvent('adjust')
  }

  function draw() {
    // TODO: Figure out coordinate system

    // Calculate center (x is middle of screen, y is fixed # of pixels below top)
    // const centerScreen = Vector2(screen.width / 2, 1 - 10 / (screen.height / 2))

    // HACK: Rescale custom camera FOV so "UI" + Entity elements are fixed in screen

    rect.draw(ctx, uiCamera)

    // goal.draw(ctx, uiCamera)

    // for (let i = 0; i < draggers.length; i++) {
    //   const dragger = draggers[i]
    //   const leftX = -width / 2 + hPadding + i * (spawnerWidth + gap)
    //   const middleX = leftX + spawnerWidth / 2
    //   const middleY = 8

    //   // TODO: Convert to worldX/worldY

    //   dragger.transform.x = worldX
    //   dragger.transform.y = worldY
    // }
  }

  return self.mix({
    adjust,
    resize,
    draw,
  })
}
