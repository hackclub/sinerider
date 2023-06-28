function FixedGoalEditable(spec) {
  const { self, parent } = Entity(spec, 'FixedGoalEditable')

  const { editor } = spec

  function dragMove(event) {
    // Change goal position
  }

  function select() {
    editor.select(parent, 'dynamic', ['order', 'x', 'y'])
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
