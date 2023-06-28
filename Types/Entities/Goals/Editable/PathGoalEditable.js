function PathGoalEditable(spec) {
  const { self, parent } = Entity(spec, 'PathGoalEditable')

  const { editor } = spec

  function dragMove(event) {
    // Change goal position
  }

  function select() {
    editor.select(parent, 'dynamic', ['x'])
  }

  function unselect() {
    editor.unselect()
  }

  return self.mix({
    dragMove,
    select,
    unselect,
  })
}
