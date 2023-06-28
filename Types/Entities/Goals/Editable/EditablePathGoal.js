function EditablePathGoal(spec) {
  const { self } = PathGoal(spec)

  const { editor } = spec

  const base = _.mix(self)

  function dragMove(event) {
    // Change goal position
  }

  function select() {
    editor.select(self, 'dynamic', ['x'])
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
