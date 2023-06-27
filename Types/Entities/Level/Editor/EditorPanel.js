function EditorPanel(spec) {
  const { self } = Entity(spec, 'EditorPanel')

  const spawner = SpawnerPanel({
    parent: self,
    drawOrder: 10000000,
    globalScope,
  })

  const inspector = InspectorPanel({})

  let activePanel = spawner

  return self.mix({})
}
