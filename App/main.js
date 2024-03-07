// Welcome to main.js, where we set up the SineRider engine basics

const stepping = false

// Core constants

const ui = {
  menuBar: $('#menu-bar'),
  editButton: $('#edit-button'),
  levelText: $('#level-text'),
  levelButton: $('#level-button'),
  levelButtonString: $('#level-button > .string'),
  resetButton: $('#reset-button'),

  resetProgressConfirmationDialog: $('#reset-progress-confirmation-dialog'),
  resetProgressConfirmButton: $('#reset-progress-confirmation-yes'),
  resetProgressCancelButton: $('#reset-progress-confirmation-no'),

  resetConfirmationDialog: $('#reset-confirmation-dialog'),
  resetConfirmButton: $('#reset-confirmation-yes'),
  resetCancelButton: $('#reset-confirmation-no'),

  tryAgainButton: $('#try-again-button'),

  veil: $('#veil'),
  loadingVeil: $('#loading-veil'),
  loadingVeilString: $('#loading-string'),
  levelLoadingVeil: $('#level-loading-veil'),
  resetSolutionsString: $('#reset-string'),
  loadingProgressBarContainer: $('#loading-progress-bar-container'),
  loadingProgressBar: $('#loading-progress-bar'),
  twitterLinkRedirect: $('#twitter-link'),
  redditLinkRedirect: $('#reddit-link'),
  githubLinkRedirect: $('#github-link'),

  bubblets: $('.bubblets'),

  topBar: $('#top-bar'),
  navigatorButton: $('#navigator-button'),

  victoryBar: $('#victory-bar'),
  victoryLabel: $('#victory-label'),
  victoryLabelString: $('#victory-label > .string'),
  timeTaken: $('#time-taken'),
  charCount: $('#character-count'),
  nextButton: $('#next-button'),
  nextButtonText: $('#next-button-text'),

  messageBar: $('#message-bar'),
  messageBarString: $('#message-bar > .string'),

  tSliderContainer: $('#t-variable-container'),
  tSlider: $('#t-variable-slider'),

  variablesBar: $('#variables-bar'),
  timeString: $('#time-string'),
  completionTime: $('#completion-time'),

  redditOpenModal: $('#reddit-open-bar'),
  redditOpenCommand: $('#reddit-open-command'),
  redditOpenCloseButton: $('#close-reddit-open-button'),

  controlBar: $('#controls-bar'),
  expressionText: $('#expression-text'),
  expressionEnvelope: $('#expression-envelope'),

  mathFieldLabel: $('#variable-label > .string'),
  _mathField: $('#math-field'),
  mathField: $('#math-field'),
  mathFieldStatic: $('#math-field-static'),

  dottedMathContainer: $('#dotted-math-container'),
  dottedMathFieldStatic: $('#dotted-math-field-static'),
  dottedMathField: $('#dotted-math-field-static'),
  dottedSlider: $('#dotted-slider'),
  dottedHintButton: $('#dotted-math-button'),

  volumeSlider: $('#volume-slider'),

  variableLabel: $('#variable-label'),

  runButton: $('#run-button'),
  runButtonString: $('#run-button > .string'),
  stopButton: $('#stop-button'),
  stopButtonString: $('#stop-button > .string'),

  navigatorFloatingBar: $('#navigator-floating-bar'),

  showAllButton: $('#show-all-button'),

  showAllConfirmationDialog: $('#show-all-confirmation-dialog'),
  showAllConfirmButton: $('#show-all-yes'),
  showAllCancelButton: $('#show-all-no'),

  editorInspector: {
    panel: $('#editor-inspector'),
    inputs: {
      order: $('#editor-order-input'),
      timer: $('#editor-timer-input'),
      x: $('#editor-x-input'),
      y: $('#editor-y-input'),
      start: $('#editor-start-input'),
      end: $('#editor-end-input'),
    },
    labels: {
      order: $('#editor-order-label'),
      timer: $('#editor-timer-label'),
      position: $('#editor-position-label'),
      start: $('#editor-start-label'),
      end: $('#editor-end-label'),
    },
    deleteSelectionButton: $('#editor-inspector-delete'),
  },

  editorSpawner: {
    panel: $('#editor-spawner'),
    addFixed: $('#editor-spawner-fixed'),
    addDynamic: $('#editor-spawner-dynamic'),
    addPath: $('#editor-spawner-path'),
  },

  editorLevelConfigurationButton: $('#editor-level-configuration-button'),
  editorLevelConfigurationDialog: $('#editor-level-configuration-dialog'),
  // editorLevelConfigurationIsPolarCheckbox: $(
  //   '#editor-level-configuration-is-polar-checkbox',
  // ),
  editorLevelConfigurationBiomeSelect: $(
    '#editor-level-configuration-biome-select',
  ),
  editorLevelConfigurationSledderSelect: $(
    '#editor-level-configuration-sledder-select',
  ),

  settingsButton: $('#settings-button'),
  graphicsSettingsDialog: $('#graphics-settings-dialog'),
  graphicsSettingsCloseButton: $('#graphics-settings-close-button'),
  setResolutionButton: $('#set-resolution-button'),
  setSampleDensityButton: $('#set-sample-density-button'),
  setTerrainLayersButton: $('#set-terrain-layers-button'),
  // closeGraphicsButton: $('#close-graphics-button'),

  levelInfoDiv: $('#lvl-debug-info'),
  levelInfoNameStr: $('#lvl-name-str'),
  levelInfoNickStr: $('#lvl-nick-str'),
  levelInfoFpsStr: $('#lvl-fps-str'),
  hideLevelInfoButton: $('#button-hide-level-info'),

  skipCutsceneButton: $('#skip-cutscene-button'),

  editorSharingLinkDialog: $('#editor-share-dialog'),

  // editorSharingLink: $('#editor-sharing-link'),
  // editorCopySharingLinkButton: $('#editor-copy-sharing-link-button'),

  shareButton: $('#share-button'),

  puzzleLink: $('#puzzle-link'),
  copyEditorLinkButton: $('#editor-copy-editor-link'),
  copyPuzzleLinkButton: $('#editor-copy-puzzle-link'),
}

ui.levelText.setAttribute('hide', true)
ui.veil.setAttribute('hide', true)

// Detect mobile devices and show the warning
const ua = navigator.userAgent || navigator.vendor || window.opera
let MOBILE = false

if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
    ua,
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    ua.substr(0, 4),
  )
) {
  MOBILE = true
}

if (MOBILE) {
  alert(
    "This beta does not yet support mobile devices (we are working on that). Please use a device with a keyboard. We promise it's worth it!",
  )
}

const canvas = $('#canvas')

let canvasIsDirty = true

const urlParams = new URLSearchParams(window.location.search)

const ticksPerSecondOverridden = urlParams.has('ticksPerSecond')

// 60 ticks per second default, but overridable via query param
const ticksPerSecond = ticksPerSecondOverridden
  ? urlParams.get('ticksPerSecond')
  : 60

// This is deliberately decoupled from 'ticksPerSecond' such that we can keep consistent
// predictable results while replaying the game simulation at higher-than-realtime speeds.
const tickDelta = 1.0 / 60.0

const startTime = Date.now()

// A positive integer that modifies how much the game draws.  A setting of 1 would result
// in all frames rendered, 2 would draw every other, etc...
const drawModulo = urlParams.has('drawModulo') ? urlParams.get('drawModulo') : 1

const screen = Screen({
  canvas,
})

let w = worldData[0]

const IS_PRODUCTION = window.location.hostname === 'sinerider.com'
const IS_DEVELOPMENT = !IS_PRODUCTION

// Don't show debug info in production
if (IS_PRODUCTION) ui.levelInfoDiv.setAttribute('hide', true)

let DEBUG_LEVEL_NICK = null

// Stupid branch here to make sure DEBUG_LEVEL isn't set in prod
if (IS_DEVELOPMENT) {
  // DEBUG_LEVEL_NICK = 'Level Editor'
  // DEBUG_LEVEL_NICK = 'VOLCANO'
  // DEBUG_LEVEL_NICK = 'CONSTANT_LAKE'
  // DEBUG_LEVEL_NICK = 'Two Below'
  // DEBUG_LEVEL_NICK = 'Time Hard'
}

const world = World({
  ui,
  screen,
  requestDraw,
  tickDelta,
  drawOrder: NINF,
  ...worldData[0],
})

var numTicks = 0

// Core methods
function tick() {
  tickInternal()

  // setTimeout and rendering impose some minimum overhead as the delay approaches 0, and thus
  // it becomes very likely that our timer loop will fall behind our desired tick rate.
  // we will check that here and tick repeatedly until we catch up
  const elapsedMs = Date.now() - startTime
  const expectedTicks = (elapsedMs / 1000.0) * ticksPerSecond
  while (numTicks < expectedTicks) {
    tickInternal()
  }
}

function tickInternal() {
  numTicks++
  world.awake()
  world.start()

  world.sendEvent('tick')

  if (numTicks % drawModulo == 0) {
    requestDraw()
  }
}

let timeOfLastDraw = null
let currentFps = 60

function draw() {
  if (!canvasIsDirty) return
  canvasIsDirty = false

  let entity
  for (let i = 0; i < world.drawArray.length; i++) {
    entity = world.drawArray[i]

    if (entity.activeInHierarchy && entity.draw) {
      screen.ctx.save()
      if (entity.predraw) entity.predraw()
      entity.draw()
      screen.ctx.restore()
    }
  }

  let now = performance.now()
  if (timeOfLastDraw) {
    let frameFps = 1000 / (now - timeOfLastDraw)
    // Avoid counting double-ticks
    if (frameFps != Infinity) {
      currentFps = 0.9 * currentFps + 0.1 * frameFps
      ui.levelInfoFpsStr.innerText = 'FPS: ' + currentFps.toFixed(2)
    }
  }
  timeOfLastDraw = now
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
  setInterval(tick, 1000 / ticksPerSecond)
}

// T Parameter Slider
ui.tSlider.addEventListener('input', refreshTSlider)
function refreshTSlider() {
  if (world.globalScope && !world.running) {
    const newT = math.remap(0, 100, 0, 10, Number(ui.tSlider.value))

    world.level?.sendEvent('tVariableChanged', [newT])
  }
}

// MathQuill

ui.mathFieldStatic = MQ.StaticMath(ui.mathFieldStatic)

function createMathField(field, eventNameOnEdit) {
  field = MQ.MathField(field, {
    handlers: {
      edit: function () {
        const text = field.getPlainExpression()
        const latex = field.latex()
        world.level.sendEvent(eventNameOnEdit, [text, latex])
      },
    },
  })

  field.getPlainExpression = function () {
    var tex = field.latex()
    return mathquillToMathJS(tex)
  }

  return field
}

ui.mathField = createMathField(ui.mathField, 'setGraphExpression')
ui.mathField.focused = () => ui._mathField.classList.contains('mq-focused')

ui.dottedMathFieldStatic = MQ.StaticMath(ui.dottedMathFieldStatic)

function onMathFieldFocus(event) {
  world.onMathFieldFocus()
}

ui.expressionEnvelope.addEventListener('focusin', onMathFieldFocus)

function onMathFieldBlur(event) {
  world.onMathFieldBlur()
}

ui.expressionEnvelope.addEventListener('blurout', onMathFieldBlur)

// HTML events

function onKeyUp(event) {
  if (event.key === 'Enter') {
    if (!world.navigating && !world.level?.isCutscene) world.toggleRunning()
  }
  world.sendEvent('keyup', [event.key])
}

window.addEventListener('mousewheel', (event) => {
  world.sendEvent('onMouseWheel', [event])
})

window.addEventListener('keydown', (event) => {
  if (ui.mathField.focused()) return
  // world.level?.sendEvent('keydown', [event.key])
  world.sendEvent('keydown', [event.key])
})

window.addEventListener('keyup', onKeyUp)

function onExpressionTextChanged(event) {
  world.level.sendEvent('setGraphExpression', [ui.expressionText.value])
}

function setGlobalVolumeLevel(i) {
  Howler.volume(i)
  window.localStorage.setItem('volume', i)
}

function onSetVolume(event) {
  let volume = event.target.value / 100
  setGlobalVolumeLevel(volume)
}

ui.volumeSlider.addEventListener('change', onSetVolume)
ui.volumeSlider.addEventListener('mouseup', onSetVolume)
ui.volumeSlider.addEventListener('input', onSetVolume)

function onClickHint() {
  ui.dottedHintButton.style.display = 'none'

  ui.dottedSlider.hidden = false
  ui.dottedSlider.style.innerHeight = '200px'
  ui.dottedMathField.style.display = 'block'

  world.level.sendEvent('displayDottedGraph')
}

ui.dottedHintButton.addEventListener('click', onClickHint)

// // prevent twitter link click from triggering level click
// ui.twitterLinkRedirect.addEventListener('click', function (event) {
//   event.stopPropagation()
// })

// // prevent reddit link click from triggering level click
// ui.redditLinkRedirect.addEventListener('click', function (event) {
//   event.stopPropagation()
// })

// prevent github link click from triggering level click
ui.githubLinkRedirect.addEventListener('click', function (event) {
  event.stopPropagation()
})

// Initial page state
function initPageState() {
  let volume = window.localStorage.getItem('volume')
  if (volume) {
    setGlobalVolumeLevel(window.localStorage)
    ui.volumeSlider.value = volume * 100
  }

  setGlobalVolumeLevel(ui.volumeSlider.value / 100)
}

function onClickMapButton(event) {
  world.onClickMapButton()
  requestDraw()
}

ui.levelButton.addEventListener('click', onClickMapButton)
ui.navigatorButton.addEventListener('click', onClickMapButton)

function onClickNextButton(event) {
  world.onClickNextButton()
}

ui.nextButton.addEventListener('click', onClickNextButton)

function onClickRunButton(event) {
  if (!world.level?.isRunningAsCutscene && !world.navigating)
    world.toggleRunning()

  return true
}

// TODO: Encapsulate run/stop/victory button behavior (Entity?)
ui.runButton.addEventListener('click', onClickRunButton)
ui.stopButton.addEventListener('click', onClickRunButton)
ui.tryAgainButton.addEventListener('click', onClickRunButton)

function onClickShowAllButton(event) {
  let showall = localStorage.getItem('ShowAll')
  if (showall != 'True') {
    showDialog(ui.showAllConfirmationDialog)
  } else {
    onShowAllConfirm()
  }
}

ui.showAllButton.addEventListener('click', onClickShowAllButton)

/* Dialogs */

function makeDialogCloseable(dialog) {
  dialog.addEventListener('click', (event) => {
    const x = event.clientX
    const y = event.clientY
    //access the visible element's bounding rectangle
    const rect = dialog.getBoundingClientRect()
    const outsideModal = !pointInRect(x, y, rect)
    if (outsideModal) {
      closeDialog(dialog)
    }
  })
}
function pointInRect(x, y, rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  )
}

function makeButtonToggleDialog(button, dialog) {
  button.addEventListener('click', () => {
    if (dialog.open) {
      closeDialog(dialog)
    } else {
      showDialog(dialog)
    }
  })
}
function showDialog(dialog) {
  dialog.classList.remove('hidden')
  dialog.showModal()
}
function closeDialog(dialog) {
  dialog.classList.add('hidden')
  dialog.close()
}

function makeButtonOpenDialog(button, dialog) {
  button.addEventListener('click', () => showDialog(dialog))
}

function makeButtonCloseDialog(button, dialog) {
  button.addEventListener('click', () => closeDialog(dialog))
}

makeDialogCloseable(ui.editorSharingLinkDialog)
makeDialogCloseable(ui.graphicsSettingsDialog)
makeDialogCloseable(ui.editorLevelConfigurationDialog)

makeButtonCloseDialog(ui.graphicsSettingsCloseButton, ui.graphicsSettingsDialog)

makeButtonOpenDialog(ui.settingsButton, ui.graphicsSettingsDialog)
// makeButtonCloseDialog(ui.closeGraphicsButton, ui.graphicsSettingsDialog)

makeButtonOpenDialog(
  ui.editorLevelConfigurationButton,
  ui.editorLevelConfigurationDialog,
)

function onClickEditButton(event) {
  world.editing = !world.editing
}

ui.editButton.addEventListener('click', onClickEditButton)

function onClickResetButton(event) {
  showDialog(ui.resetConfirmationDialog)
}

ui.resetButton.addEventListener('click', onClickResetButton)

function onResetConfirm() {
  world.onResetConfirm()
  closeDialog(ui.resetConfirmationDialog)
}

ui.resetConfirmButton.addEventListener('click', onResetConfirm)

function onResetCancel() {
  closeDialog(ui.resetConfirmationDialog)
}

ui.resetCancelButton.addEventListener('click', onResetCancel)

function onShowAllConfirm() {
  world.navigator.showAll = !world.navigator.showAll
  closeDialog(ui.showAllConfirmationDialog)
  window.localStorage.setItem('ShowAll', 'True')
}

ui.showAllConfirmButton.addEventListener('click', onShowAllConfirm)

function onShowAllCancel() {
  closeDialog(ui.showAllConfirmationDialog)
}

ui.showAllCancelButton.addEventListener('click', onShowAllCancel)

function onResizeWindow(event) {
  world.sendEvent('resize', [window.innerWidth, window.innerHeight])
  screen.resize()
  canvasIsDirty = true
  draw()
}

window.addEventListener('resize', onResizeWindow)

/* Graphics setting buttons */

const resolutionSelector = {
  storage: 'resolutionSetting',
  default: 2,
  applySettings: (option) => {
    screen.resolutionScalingFactor = option[1]
    screen.resize()
  },
  options: [
    ['Low', 0.5],
    ['Medium', 0.75],
    ['High', 1.0],
  ],
}

const sampleDensitySelector = {
  storage: 'sampleDensitySetting',
  default: 1,
  applySettings: (option) => {
    world.sampleDensitySetting = option[1]
  },
  options: [
    ['Low', 60],
    ['Medium', 129],
    ['High', 300],
  ],
}

const terrainLayersSelector = {
  storage: 'terrainLayersSetting',
  default: 2,
  applySettings: (option) => {
    if (world.level?.graph)
      world.level.graph.terrainLayers = option[1].terrainLayers
  },
  options: [
    [
      'Low',
      {
        terrainLayers: 0,
      },
    ],
    [
      'Medium',
      {
        terrainLayers: 3,
      },
    ],
    [
      'High',
      {
        terrainLayers: 6,
      },
    ],
  ],
}

function createToggleSelector(element, selector) {
  selector.selection =
    localStorage.getItem(selector.storage) ?? selector.default
  let choice = selector.options[selector.selection]
  element.innerText = choice[0]
  selector.applySettings(choice)

  return () => {
    selector.selection = (selector.selection + 1) % selector.options.length
    localStorage.setItem(selector.storage, selector.selection)
    choice = selector.options[selector.selection]
    element.innerText = choice[0]
    selector.applySettings(choice)
  }
}

ui.setResolutionButton.addEventListener(
  'click',
  createToggleSelector(ui.setResolutionButton, resolutionSelector),
)
ui.setSampleDensityButton.addEventListener(
  'click',
  createToggleSelector(ui.setSampleDensityButton, sampleDensitySelector),
)
ui.setTerrainLayersButton.addEventListener(
  'click',
  createToggleSelector(ui.setTerrainLayersButton, terrainLayersSelector),
)

function onClickCanvas() {
  if (stepping) {
    tick()
  }
}

canvas.addEventListener('click', onClickCanvas)
ui.veil.addEventListener('click', onClickCanvas)

function onMouseMoveCanvas(event) {
  world.clickableContext.processEvent(event, 'mouseMove')
  event.preventDefault()
}

function selectScreenCoordinatesFromWindow(windowX, windowY) {
  const screenX = screen.resolutionScalingFactor * windowX
  const screenY = screen.resolutionScalingFactor * windowY

  world.sendEvent('selectScreenCoordinates', [screenX, screenY])
}

function onMouseMoveWindow(event) {
  selectScreenCoordinatesFromWindow(event.clientX, event.clientY)
}

canvas.addEventListener('mousemove', onMouseMoveCanvas)
canvas.addEventListener('pointermove', onMouseMoveCanvas)

window.addEventListener('mousemove', onMouseMoveWindow)
window.addEventListener('pointermove', onMouseMoveWindow)

function onMouseDownCanvas(event) {
  world.clickableContext.processEvent(event, 'mouseDown')
  event.preventDefault()
  selectScreenCoordinatesFromWindow(event.clientX, event.clientY)
  ui.mathField.blur()
  world.sendEvent('onMouseDown')
}

canvas.addEventListener('mousedown', onMouseDownCanvas)
canvas.addEventListener('pointerdown', onMouseDownCanvas)

function onMouseUpCanvas(event) {
  event.preventDefault()
  ui.tSlider.value = 0
  // refreshTSlider()
  world.clickableContext.processEvent(event, 'mouseUp')
  world.sendEvent('onMouseUp')
}

canvas.addEventListener('mouseup', onMouseUpCanvas)
window.addEventListener('pointerup', onMouseUpCanvas)

ui.levelInfoDiv.addEventListener('mouseover', function () {
  ui.hideLevelInfoButton.setAttribute('hide', false)
})

ui.levelInfoDiv.addEventListener('mouseleave', function () {
  ui.hideLevelInfoButton.setAttribute('hide', true)
})

/* Editor UI */

function bindElementDOMEventToWorldEvent(
  element,
  domEventName,
  worldEventName,
) {
  element.addEventListener(domEventName, (event) =>
    world.sendEvent(worldEventName, [event]),
  )
}

/* Init configuration menus */

// TODO: Maybe use DOM prototypes? UI management in general
// needs rewrite

for (const biomeName of Object.keys(BIOMES)) {
  const option = document.createElement('option')
  option.innerText =
    biomeName.charAt(0).toUpperCase() +
    biomeName.substring(1).replace(/([A-Z])/g, ' $1')
  option.value = biomeName
  ui.editorLevelConfigurationBiomeSelect.add(option)
}

for (const [sledderName, sledderImage] of [
  ['Ada', 'images.ada_sled'],
  ['Jack', 'images.jack_sled'],
  ['Ada & Jack', 'images.ada_jack_sled'],
]) {
  const option = document.createElement('option')
  option.innerText = sledderName
  option.value = sledderImage
  ui.editorLevelConfigurationSledderSelect.add(option)
}

ui.editorLevelConfigurationBiomeSelect.addEventListener('change', () => {
  const selectedIndex = ui.editorLevelConfigurationBiomeSelect.selectedIndex
  const options = ui.editorLevelConfigurationBiomeSelect.options
  const selectedBiomeKey = options[selectedIndex].value
  world.sendEvent('selectBiome', [selectedBiomeKey])
})

// ui.editorLevelConfigurationIsPolarCheckbox.addEventListener('input', () => {
//   const checked = ui.editorLevelConfigurationIsPolarCheckbox.checked
//   world.sendEvent('setPolar', [checked])
// })

ui.editorLevelConfigurationSledderSelect.addEventListener('input', () => {
  const selectedIndex = ui.editorLevelConfigurationSledderSelect.selectedIndex
  const options = ui.editorLevelConfigurationSledderSelect.options
  const selectedSledderImage = options[selectedIndex].value
  world.sendEvent('setSledderImage', [selectedSledderImage])
})

/* Events */

ui.shareButton.addEventListener('click', () => {
  world.sendEvent('onShareButtonClicked')
})

ui.copyEditorLinkButton.addEventListener('click', () => {
  const link = window.location.href
  navigator.clipboard.writeText(link)
})

ui.copyPuzzleLinkButton.addEventListener('click', () => {
  const link = ui.puzzleLink.value
  navigator.clipboard.writeText(link)
})

// Spawner
bindElementDOMEventToWorldEvent(
  ui.editorSpawner.addDynamic,
  'click',
  'onAddDynamicClicked',
)
bindElementDOMEventToWorldEvent(
  ui.editorSpawner.addFixed,
  'click',
  'onAddFixedClicked',
)
bindElementDOMEventToWorldEvent(
  ui.editorSpawner.addPath,
  'click',
  'onAddPathClicked',
)

// Inspector
for (const [name, input] of Object.entries(ui.editorInspector.inputs)) {
  input.addEventListener('input', (event) =>
    world.sendEvent('onEditorInput', [name, event]),
  )
}

ui.editorInspector.deleteSelectionButton.addEventListener('click', () => {
  world.sendEvent('deleteSelection')
})
