// TODO: Might be better to wrap editor-related behavior
// (e.g. select or mouse events) in Editable object which
// classes can wrap like Clickable
function Editable(spec) {
  const { self } = Entity(spec, 'Editable')

  const { mouseMove } = spec

  const editorEnabled = false

  function editorToggled(_editorEnabled) {
    editorEnabled = _editorEnabled
  }
}
