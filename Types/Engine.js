function Engine(spec) {
  const self = {}

  const { ui, canvas, ticksPerSecond = 60, stepping = false } = spec

  let canvasIsDirty = true

  const tickDelta = 1 / ticksPerSecond
  let time = 0

  const screen = Screen({
    canvas,
  })

  const world = World({
    ui,
    screen,
    tickDelta,
    getTime: () => time,
  })

  tick()
  draw()

  if (!stepping) {
    setInterval(tick, 1000 / ticksPerSecond)
  }

  // Core methods

  function tick() {
    world.sendLifecycleEvent('awake')
    world.sendLifecycleEvent('start')

    world.sendEvent('tick')

    time += tickDelta

    requestDraw()
  }

  function draw() {
    if (!canvasIsDirty) return
    canvasIsDirty = false

    world.sendEvent('draw')
  }

  function requestDraw() {
    if (!canvasIsDirty) {
      canvasIsDirty = true
      requestAnimationFrame(draw)
    }
  }

  // HTML events

  function onKeyUp(event) {}

  window.addEventListener('keyup', onKeyUp)

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
    world.clickableContext.processEvent(event, 'mouseMove')
    event.preventDefault()
  }

  canvas.addEventListener('mousemove', onMouseMoveCanvas)
  canvas.addEventListener('pointermove', onMouseMoveCanvas)

  function onMouseDownCanvas(event) {
    world.clickableContext.processEvent(event, 'mouseDown')
    event.preventDefault()
  }

  canvas.addEventListener('mousedown', onMouseDownCanvas)
  canvas.addEventListener('pointerdown', onMouseDownCanvas)

  function onMouseUpCanvas(event) {
    world.clickableContext.processEvent(event, 'mouseUp')
    event.preventDefault()
  }

  canvas.addEventListener('mouseup', onMouseUpCanvas)
  canvas.addEventListener('pointerup', onMouseUpCanvas)

  return _.mixIn(self, {
    world,
  })
}
