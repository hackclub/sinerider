// Welcome to main.js, where we set up the SineRider engine basics

const stepping = false

// "The poor man's jquery" —Nicky Case
const $ = document.querySelector.bind(document)

// Core constants

const ui = {
  menuBar: $('#menu-bar'),
  editButton: $('#edit-button'),
  levelText: $('#level-text'),
  levelButton: $('#level-button'),
  levelButtonString: $('#level-button > .string'),
  resetButton: $('#reset-button'),
  
  victoryBar: $('#victory-bar'),
  victoryLabel: $('#victory-label'),
  victoryLabelString: $('#victory-label > .string'),
  nextButton: $('#next-button'),
  
  messageBar: $('#message-bar'),
  messageBarString: $('#message-bar > .string'),

  controlBar: $('#controls-bar'),
  expressionText: $('#expression-text'),
  variableLabel: $('#variable-label'),
  runButton: $('#run-button') 
}

ui.levelText.setAttribute('hide', true)

const canvas = $('#canvas')

let canvasIsDirty = true

const ticksPerSecond = 30
const tickDelta = 1/ticksPerSecond

const screen = Screen({
  canvas
})

const world = World({
  ui,
  screen,
  requestDraw,
  tickDelta,
  ...worldData[0],
})

// Core methods

function tick() {
  //console.log(`Ticking! t=${math.floor(runTime*100)/100}`)
  
  world.sendEvent('tick', [])

  requestDraw()
}

function draw() {
  //console.log(`Drawing!`)
  
  if (!canvasIsDirty) return
  canvasIsDirty = false
  
  world.sendEvent('draw', [])
}

function requestDraw() {
  if (!canvasIsDirty) {
    canvasIsDirty = true
    requestAnimationFrame(draw)
  }
}

tick()
draw()

if (!stepping) {
  setInterval(tick, 1000/ticksPerSecond)
}

// HTML events

function onKeyUp(event) {
  if (event.keyCode === 13) {
    world.toggleRunning()
  }
}

window.addEventListener("keyup", onKeyUp)

function onExpressionTextChanged(event) {
  console.log(`Expression text changed to: `, ui.expressionText.value)
  
  world.level.setGraphExpression(ui.expressionText.value)
}

ui.expressionText.addEventListener('input', onExpressionTextChanged)

function onClickLevelButton(event) {
  world.navigating = !world.navigating
  requestDraw()
}

ui.levelButton.addEventListener('click', onClickLevelButton)

function onClickNextButton(event) {
  world.nextLevel()
}

ui.nextButton.addEventListener('click', onClickNextButton)

function onClickRunButton(event) {
  world.toggleRunning()
}

ui.runButton.addEventListener('click', onClickRunButton)

function onClickEditButton(event) {
  world.editing = !world.editing
}

ui.editButton.addEventListener('click', onClickEditButton)

function onResizeWindow(event) {
  screen.resize()
  canvasIsDirty = true
  draw()
}

window.addEventListener('resize', onResizeWindow)

function onClickCanvas() {
  if (stepping) {
    tick()
  }
}

canvas.addEventListener('click', onClickCanvas)

function onMouseMoveCanvas(event) {
  let mousePoint = Vector2(event.offsetX, event.offsetY)
  
  world.sendEvent('mouseMove', [mousePoint])
}

canvas.addEventListener('mousemove', onMouseMoveCanvas)
canvas.addEventListener('pointermove', onMouseMoveCanvas)

function onMouseDownCanvas(event) {
  let mousePoint = Vector2(event.offsetX, event.offsetY)
  
  world.sendEvent('mouseDown', [mousePoint])
}

canvas.addEventListener('mousedown', onMouseDownCanvas)
canvas.addEventListener('pointerdown', onMouseDownCanvas)

function onMouseUpCanvas(event) {
  let mousePoint = Vector2(event.offsetX, event.offsetY)
  
  world.sendEvent('mouseUp', [mousePoint])
}

canvas.addEventListener('mouseup', onMouseUpCanvas)
canvas.addEventListener('pointerup', onMouseUpCanvas)