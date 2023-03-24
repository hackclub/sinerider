const ui = {
  menuBar: $('#menu-bar'),
  editButton: $('#edit-button'),
  levelText: $('#level-text'),
  levelButton: $('#level-button'),
  levelButtonString: $('#level-button > .string'),
  resetButton: $('#reset-button'),

  tryAgainButton: $('#try-again-button'),

  veil: $('#veil'),
  loadingVeil: $('#loading-veil'),
  loadingVeilString: $('#loading-string'),

  bubblets: $('.bubblets'),

  topBar: $('#top-bar'),
  navigatorButton: $('#navigator-button'),

  victoryBar: $('#victory-bar'),
  victoryLabel: $('#victory-label'),
  victoryLabelString: $('#victory-label > .string'),
  victoryStopButton: $('#victory-stop-button'),
  nextButton: $('#next-button'),

  messageBar: $('#message-bar'),
  messageBarString: $('#message-bar > .string'),

  variablesBar: $('#variables-bar'),
  timeString: $('#time-string'),
  completionTime: $('#completion-time'),
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

  editorInspector: {
    editorInspector: $('#editor-inspector'),
    order: $('#editor-order-input'),
    timer: $('#editor-timer-input'),
    x: $('#editor-x-input'),
    y: $('#editor-y-input'),
    deleteSelection: $('#editor-inspector-delete'),
  },

  editorSpawner: {
    editorSpawner: $('#editor-spawner'),
    addFixed: $('#editor-spawner-fixed'),
    addDynamic: $('#editor-spawner-dynamic'),
    addPath: $('#editor-spawner-path'),
  },
  levelInfoDiv: $('#lvl-debug-info'),
  levelInfoNameStr: $('#lvl_name_str'),
  levelInfoNickStr: $('#lvl_nick_str'),
  hideLevelInfoButton: $('#button-hide-level-info'),
  canvas: $('#canvas')
}