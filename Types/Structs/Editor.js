function Editor(ui) {
  const {
    editorInspector,
    order,
    timer,
    x,
    y,
  } = ui.editorInspector

  const {
    editorSpawner,
    addFixed,
    addDynamic,
    addPath,
  } = ui.editorSpawner

  addFixed.onclick = () => {
    world.level.sendEvent('goalAdded', ['fixed'])
  }

  addDynamic.onclick = () => {
    world.level.sendEvent('goalAdded', ['dynamic'])
  }

  addPath.onclick = () => {
    ui.editorInspector.x.value = point.x.toFixed(2)
    ui.editorInspector.y.value = point.y.toFixed(2)
    world.level.sendEvent('goalAdded', ['path'])
  }

  let selection
  let selectionType

  function select(_selection, _selectionType) {
    editorSpawner.setAttribute('hide', true)
    editorInspector.setAttribute('hide', false)

    selection = _selection
    selectionType = _selectionType

    order.value = selection.order ?? ''
    x.value = selection.x ? selection.x.toFixed(2) : ''
    y.value = selection.y ? selection.y.toFixed(2) : ''
    timer.value = selection.timer ?? ''
  }

  function deselect() {
    world.level.save()
    editorSpawner.setAttribute('hide', false)
    editorInspector.setAttribute('hide', true)
  }

  function show() {
    editorSpawner.setAttribute('hide', false)
    editorInspector.setAttribute('hide', true)
  }

  function hide() {
    editorSpawner.setAttribute('hide', true)
    editorInspector.setAttribute('hide', true)
  }

  order.oninput = event => {
    let data = event.data ? event.data.toUpperCase() : null
    if (!/[a-z]/i.test(data)) {
      event.preventDefault()
      order.value = ''
      return
    }
    order.value = data
    if (selection?.setOrder) selection.setOrder(data)
  }

  timer.oninput = event => {
    let value
    try {
      value = Number(timer.value)
    } catch (err) {
      return
    }
    if (selection?.setTimer) selection.setTimer(value)
  }

  x.oninput = event => {
    let value
    try {
      value = Number(x.value)
    } catch (err) {
      return
    }
    if (selection?.setX) selection.setX(value)
  }

  y.oninput = event => {
    let value
    try {
      value = Number(y.value)
    } catch (err) {
      return
    }
    if (selection?.setY) selection?.setY(value)
  }

  return {
    show,
    hide,

    deselect,
    select,
  }
}