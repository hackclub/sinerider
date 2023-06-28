function Editor() {
  const { ui, level } = spec

  let editingPath = false

  let selection = null
  let selectionIsDeletable = false

  const {
    order: orderUI,
    timer: timerUI,
    position: positionUI,
  } = ui.editorInspector.editableAttributes

  function addFixedClicked() {
    level.sendEvent('addedGoalFromEditor', ['fixed'])
  }

  function addDynamicClicked() {
    level.sendEvent('addedGoalFromEditor', ['dynamic'])
  }

  function addPathClicked() {
    level.sendEvent('addedGoalFromEditor', ['path'])
  }

  function deleteSelectionButtonClicked() {
    if (selection && selectionIsDeletable) {
      selection.remove()
      deselect()
    }
  }

  function hide() {
    ui.editorSpawner.panel.setAttribute('hide', true)
    ui.editorInspector.panel.setAttribute('hide', true)
  }

  function showSpawnerPanel() {
    ui.editorSpawner.panel.setAttribute('hide', false)
    ui.editorInspector.panel.setAttribute('hide', true)
  }

  function showInspectorPanel() {
    ui.editorSpawner.panel.setAttribute('hide', true)
    ui.editorInspector.panel.setAttribute('hide', false)
  }

  function select(
    newSelection,
    attributes = ['order', 'timer', 'x', 'y'],
    newSelectionIsDeletable = true,
  ) {
    selection = newSelection
    selectionIsDeletable = newSelectionIsDeletable

    showInspectorPanel()

    const hideOrder = !attributes.includes('order')
    orderUI.input.setAttribute('hide', hideOrder)
    orderUI.label.setAttribute('hide', hideOrder)

    const hideTimer = !attributes.includes('timer')
    timerUI.input.setAttribute('hide', hideTimer)
    timerUI.input.setAttribute('hide', hideTimer)

    const hideX = !attributes.includes('x')
    const hideY = !attributes.includes('y')
    positionUI.x.setAttribute('hide', hideX)
    positionUI.y.setAttribute('hide', hideY)
    positionUI.label.setAttribute('hide', hideX && hideY)

    orderUI.input.value = selection.order ?? ''
    positionUI.x.value = selection.x ? selection.x.toFixed(2) : ''
    positionUI.y.value = selection.y ? selection.y.toFixed(2) : ''
    timerUI.input.value = selection.timer ?? ''
  }

  function selectionChange() {
    // Update UI
    orderUI.input.value = selection.order ?? ''
    positionUI.x.value = selection.x ? selection.x.toFixed(2) : ''
    positionUI.y.value = selection.y ? selection.y.toFixed(2) : ''
    timerUI.input.value = selection.timer ?? ''
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

  function awake() {
    ui.nextButton.setAttribute('hide', true)
    showSpawnerPanel()
  }

  function destroy() {
    ui.nextButton.setAttribute('hide', false)
    hide()
  }

  function show() {
    showing = true
  }

  function hide() {
    showing = false
  }

  function orderInputEdited(event) {
    let data = event.data ? event.data.toUpperCase() : null
    if (!/[a-z]/i.test(data)) {
      event.preventDefault()
      order.value = ''
      return
    }
    order.value = data
    if (selection?.setOrder) selection.setOrder(data)
  }

  function timerInputEdited(event) {
    let value
    try {
      value = Number(timer.value)
    } catch (err) {
      return
    }
    if (selection?.setTimer) selection.setTimer(value)
  }

  function positionXInputEdited(event) {
    let value
    try {
      value = Number(x.value)
    } catch (err) {
      return
    }
    if (selection?.setX) selection.setX(value)
  }

  function positionYInputEdited(event) {
    let value
    try {
      value = Number(y.value)
    } catch (err) {
      return
    }
    if (selection?.setY) selection?.setY(value)
  }

  function onSetActive(active) {
    if (active) show()
    else hide()
  }

  return self.mix({
    awake,
    destroy,

    onSetActive,

    get editingPath() {
      return editingPath
    },
    set editingPath(v) {
      editingPath = v
    },

    deselect,
    select,

    addDynamicClicked,
    addFixedClicked,
    addPathClicked,
    deleteSelectionButtonClicked,

    orderInputEdited,
    timerInputEdited,
    positionXInputEdited,
    positionYInputEdited,

    selectionChange,
  })
}
