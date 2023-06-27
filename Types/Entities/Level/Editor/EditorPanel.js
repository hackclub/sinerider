function EditorPanel(spec) {
  const { self } = Entity(spec, 'EditorPanel')

  const spawner = EditorSpawner({})

  const inspector = EditorInspector({})

  let activePanel = spawner

  return self.mix({})
}
