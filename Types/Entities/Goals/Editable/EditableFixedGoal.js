function EditableFixedGoal(spec) {
  const { self } = FixedGoal(spec)

  const { editor } = spec

  const base = _.mix(self)

  function dragMove(event) {
    // Change goal position
  }

  function select() {
    editor.select(self, 'dynamic', ['order', 'x', 'y'])
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
