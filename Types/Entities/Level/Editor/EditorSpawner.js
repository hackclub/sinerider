function EditorSpawner(spec) {
  const { self } = Entity(spec, 'EditorSpawner')

  const width = 10
  const height = 4
  const hPadding = 2
  const vPadding = 1
  const gap = 1

  const prototypes = [
    DynamicGoal({
      // default spec
    }),
    FixedGoal({
      // default spec
    }),
    PathGoal({
      // default spec
    }),
  ]

  const draggers = []

  const spawnerWidth =
    (width - 2 * hPadding - gap * (prototypes.length - 1)) / prototypes.length
  const spawnerHeight = height - 2 * vPadding

  for (const prototype of prototypes) {
    const dragger = Spawner({
      prototype,
      width: spawnerWidth,
      height: spawnerHeight,
    })
    draggers.push(dragger)
  }

  function draw() {
    // TODO: Figure out coordinate system

    // Calculate center (x is middle of screen, y is slightly below top)
    const center = Vector2()

    for (let i = 0; i < draggers.length; i++) {
      const dragger = draggers[i]
      const leftX = -width / 2 + hPadding + i * (spawnerWidth + gap)
      const middleX = leftX + spawnerWidth / 2
      const middleY = 8

      // TODO: Convert to worldX/worldY

      dragger.transform.x = worldX
      dragger.transform.y = worldY
    }
  }

  return self.mix({
    draw,
  })
}
