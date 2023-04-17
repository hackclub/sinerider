function Editor(ui) {
  const { editorInspector, order, timer, x, y, deleteSelection } =
    ui.editorInspector

  const { editorSpawner, addFixed, addDynamic, addPath } = ui.editorSpawner

  let showing = true

  addFixed.addEventListener('click', () => {
    world.level.sendEvent('goalAdded', ['fixed'])
  })

  addDynamic.addEventListener('click', () => {
    world.level.sendEvent('goalAdded', ['dynamic'])
  })

  addPath.addEventListener('click', () => {
    ui.editorInspector.x.value = point.x.toFixed(2)
    ui.editorInspector.y.value = point.y.toFixed(2)
    world.level.sendEvent('goalAdded', ['path'])
  })

  let editingPath = false

  let selection
  let selectionType

  let active = false

  deleteSelection.addEventListener('click', () => {
    if (
      selectionType == 'fixed' ||
      selectionType == 'path' ||
      selectionType == 'dynamic' ||
      selectionType == 'sledder'
    ) {
      selection.remove()
    }
  })

  function select(_selection, _selectionType, attributes = null) {
    if (!active) return

    editorSpawner.setAttribute('hide', true)
    editorInspector.setAttribute('hide', false)

    selection = _selection
    selectionType = _selectionType

    // TODO: Resolve source of truth as either consumer or branching in Editor
    // from passed type
    if (attributes) {
      for (input of ['order', 'timer', 'x', 'y'])
        ui.editorInspector[input].setAttribute('hide', true)
      for (input of attributes)
        ui.editorInspector[input].setAttribute('hide', false)
    }

    order.value = selection.order ?? ''
    x.value = selection.x ? selection.x.toFixed(2) : ''
    y.value = selection.y ? selection.y.toFixed(2) : ''
    timer.value = selection.timer ?? ''
  }

  function deselect() {
    if (!active) return

    world.level.save()

    for (input of ['order', 'timer', 'x', 'y'])
      ui.editorInspector[input].setAttribute('hide', false)

    editorSpawner.setAttribute('hide', false)

    // If level editor is still active,
    // show inspector in place of spawner, otherwise hide
    editorInspector.setAttribute('hide', showing)
  }

  function show() {
    showing = true
    ui.nextButton.setAttribute('hide', true)
    editorSpawner.setAttribute('hide', false)
    editorInspector.setAttribute('hide', true)
  }

  function hide() {
    showing = false
    ui.nextButton.setAttribute('hide', false)
    editorSpawner.setAttribute('hide', true)
    editorInspector.setAttribute('hide', true)
  }

  order.addEventListener('input', (event) => {
    let data = event.data ? event.data.toUpperCase() : null
    if (!/[a-z]/i.test(data)) {
      event.preventDefault()
      order.value = ''
      return
    }
    order.value = data
    if (selection?.setOrder) selection.setOrder(data)
  })

  timer.addEventListener('input', (event) => {
    let value
    try {
      value = Number(timer.value)
    } catch (err) {
      return
    }
    if (selection?.setTimer) selection.setTimer(value)
  })

  x.addEventListener('input', (event) => {
    let value
    try {
      value = Number(x.value)
    } catch (err) {
      return
    }
    if (selection?.setX) selection.setX(value)
  })

  y.addEventListener('input', (event) => {
    let value
    try {
      value = Number(y.value)
    } catch (err) {
      return
    }
    if (selection?.setY) selection?.setY(value)
  })

  return {
    show,
    hide,

    get active() {
      return active
    },
    set active(v) {
      active = v
      if (v) {
        show()
      } else {
        hide()
      }
    },

    get editingPath() {
      return editingPath
    },
    set editingPath(v) {
      editingPath = v
    },

    deselect,
    select,
  }
}
