function PathGoal(spec) {
  const { self, camera, transform, ctx, parent } = Goal(spec, 'Path Goal')

  const base = _.mix(self)

  let {
    assets,
    size = 1,
    globalScope,
    expression: pathExpression = 'sin(x)',
    pathX = 4,
    pathY = 0,
    graph,
    debug = false,

    // Optional, used for editor
    expressionLatex: pathExpressionLatex = null,
  } = spec

  if (!pathExpressionLatex) {
    // Ideally this should never happen,
    // but to prevent PathGoal from breaking
    pathExpressionLatex = pathExpression
  }

  const minBoundsHeight = 1

  let trackPoints = []

  const bottom = Vector2(0, -size / 2)
  const bottomWorld = Vector2()

  const slopeTangent = Vector2()

  const pathPosition = Vector2()
  const pathPositionWorld = Vector2()

  const pathStart = Vector2()
  const pathEnd = Vector2(pathX, 0)

  const pathMin = Vector2()
  const pathMax = Vector2()

  const pathStartWorld = Vector2()
  const pathEndWorld = Vector2()

  const pathStartScreen = Vector2()
  const pathEndScreen = Vector2()

  const pathMinWorld = Vector2()
  const pathMaxWorld = Vector2()

  let pathSign = Math.sign(pathX)
  let pathSpan = Math.abs(pathX)

  let maxPathResetSpeed = 3
  let pathResetSpeed = 0
  let pathProgress = 0

  const outerColor = Color()
  const outerColors = [Color('#111111'), Color('#444444'), Color('#333333')]

  const shape = Circle({
    transform,
    center: Vector2(0, 0),
    radius: size / 2,
  })

  // Establish path origin in world space
  transform.transformPoint(pathStart, pathStartWorld)
  transform.transformPoint(pathEnd, pathEndWorld)

  const pathGraph = Graph({
    name: 'Path Graph',
    parent: self,
    globalScope,
    expression: pathExpression,
    freeze: true,
    fill: false,
    scaleStroke: true,
    bounds: [pathStartWorld.x, pathEndWorld.x],
    sampleCount: Math.round(pathSpan * 4),
    strokeWidth: 1,
    strokeColor: '#888',
    dashed: true,
    dashSettings: [0.5, 0.5],
    useInterpolation: false,
  })

  const hintGraph = Graph({
    name: 'Path Hint Graph',
    parent: self,
    globalScope,
    expression: pathExpression,
    fill: false,
    scaleStroke: true,
    strokeWidth: 0.1,
    strokeColor: '#FFA500',
    dashed: true,
    dashSettings: [0.5, 0.5],
    // fixedPoints: true,
  })

  // HACK: Hijack the graph's draw method to draw it behind the goal object
  const drawPathGraph = pathGraph.draw.bind(pathGraph)
  pathGraph.draw = () => {}

  const drawHintGraph = hintGraph.draw.bind(hintGraph)
  hintGraph.draw = () => {}

  assets.sounds.path_goal_start.volume(0.5)
  assets.sounds.path_goal_continue.volume(0.5)

  // Sample start/end points
  pathStartWorld.y = pathGraph.sample('x', pathStartWorld.x)
  pathEndWorld.y = pathGraph.sample('x', pathEndWorld.x)

  // Move transform to start of path
  transform.position = pathStartWorld

  // Compute world-space points
  transform.invertPoint(pathStartWorld, pathStart)
  transform.invertPoint(pathEndWorld, pathEnd)

  pathPosition.set(pathStart)
  transform.transformPoint(pathPosition, pathPositionWorld)

  // Compute min/max points
  pathStart.min(pathEnd, pathMin)
  pathStart.max(pathEnd, pathMax)

  pathStartWorld.min(pathEndWorld, pathMinWorld)
  pathStartWorld.max(pathEndWorld, pathMaxWorld)

  // trackPoints.push(pathStartWorld)
  // trackPoints.push(pathEndWorld)
  trackPoints.push(pathGraph.minSample)
  trackPoints.push(pathGraph.maxSample)

  // Handles for editor
  const leftHandle = PathGoalHandle({
    parent: self,
    transform,
    drawOrder: Infinity,
    type: 'start',
    editor: parent, // parent is implicitly editor
  })

  const rightHandle = PathGoalHandle({
    parent: self,
    transform,
    drawOrder: Infinity,
    type: 'end',
    editor: parent,
  })

  const boundsTransform = Transform({
    x: spec.x,
  })

  const bounds = Rect({
    transform: boundsTransform,
  })

  updateBounds()

  const union = Union({
    shapes: [shape, bounds, leftHandle, rightHandle],
  })

  const clickable = Clickable({
    entity: self,
    shape: union,
    transform,
    camera,
  })

  function onRequestAssetsPass(requestAssets) {
    requestAssets(
      ['sounds.path_goal_continue', 'sounds.path_goal_start'],
      (assets) => (localAssets = assets),
    )
  }

  function setEnds(pathStartX, pathEndX) {
    pathX = pathEndX - pathStartX

    pathStart.set(pathStartX, 0)
    pathEnd.set(pathEndX, 0)

    pathSign = Math.sign(pathX)
    pathSpan = Math.abs(pathX)

    // If graph grew/shrunk enough, update sample count
    const newSampleCount = Math.round(pathSpan * 4)

    if (Math.abs(pathGraph.sampleCount - newSampleCount) > 5)
      pathGraph.sampleCount = newSampleCount

    dragMove(transform.position)
  }

  function updateBounds() {
    const max = pathGraph.samples.reduce(
      (max, el) => (el[1] > max ? el[1] : max),
      NINF,
    )
    const min = pathGraph.samples.reduce(
      (min, el) => (el[1] < min ? el[1] : min),
      PINF,
    )
    const height = Math.max(max - min, minBoundsHeight)

    const verticalCenter = (max + min) / 2

    bounds.width = pathX
    bounds.height = height
    bounds.center = Vector2(pathX / 2 + pathStart.x, verticalCenter)

    leftHandle.transform.position.set(transform.x + pathStart.x, verticalCenter)
    rightHandle.transform.position.set(transform.x + pathEnd.x, verticalCenter)
  }

  function tick() {
    base.tick()
    tickPath()
  }

  function tickPath() {
    if (!self.completed && !self.failed) {
      const pathProgressZero = pathProgress == 0

      if (self.triggered) {
        pathPositionWorld.x += self.triggeringSledderDelta.x
        pathResetSpeed = 0
      } else {
        pathPositionWorld.x -= pathSign * self.tickDelta * pathResetSpeed
        pathResetSpeed = Math.min(
          pathResetSpeed + self.tickDelta * 6,
          maxPathResetSpeed,
        )
      }
      pathPositionWorld.x = math.clamp(
        pathMinWorld.x,
        pathMaxWorld.x,
        pathPositionWorld.x,
      )

      pathProgress = math.unlerp(
        pathStartWorld.x,
        pathEndWorld.x,
        pathPositionWorld.x,
      )

      pathPositionWorld.y = pathGraph.sample('x', pathPositionWorld.x)
      transform.invertPoint(pathPositionWorld, pathPosition)
      shape.center.set(pathPosition)

      if (self.triggered && pathProgress != 0 && pathProgressZero) {
        assets.sounds.path_goal_start.play()
        assets.sounds.path_goal_continue.loop(true)
        assets.sounds.path_goal_continue.play()
      }
      if (!self.triggered && pathProgress == 0 && !pathProgressZero) {
        assets.sounds.path_goal_continue.stop()
      }
    }
  }

  function checkComplete() {
    if (self.triggered && !self.completed && !self.failed) {
      if (!self.available) self.fail()
      else if (pathProgress == 1) {
        self.complete()
        assets.sounds.path_goal_continue.stop()
      }
    }
  }

  function drawLocal() {
    ctx.strokeStyle = self.strokeStyle
    ctx.fillStyle = self.fillStyle

    ctx.lineWidth = self.strokeWidth

    ctx.beginPath()
    ctx.arc(pathPosition.x, -pathPosition.y, size / 2, 0, TAU)
    ctx.fill()
    ctx.stroke()

    // ctx.beginPath()
    // ctx.arc(pathEnd.x, -pathEnd.y, size / 2, 0, TAU)
    // ctx.strokeStyle = '#888'
    // ctx.stroke()

    if (self.debug) {
      ctx.font = '1px Roboto Mono'
      ctx.fillStyle = 'green'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        'position: ' + pathPosition.toString(),
        pathPosition.x,
        -pathPosition.y,
      )
      ctx.fillText('start: ' + pathStart.toString(), pathStart.x, -pathStart.y)
      ctx.fillText('end: ' + pathEnd.toString(), pathEnd.x, -pathEnd.y)
    }
  }

  function draw() {
    // Set alpha to fade with flash if completed
    self.setAlphaByFlashFade()

    camera.worldToScreen(pathStartWorld, pathStartScreen)
    camera.worldToScreen(pathEndWorld, pathEndScreen)

    let outerStyle = ctx.createLinearGradient(
      pathStartScreen.x,
      0,
      pathEndScreen.x,
      0,
    )

    for (let i = 0; i < outerColors.length; i++) {
      let p = i / (outerColors.length - 1)
      outerColor.set(outerColors[i]).lerp(self.flashWhite, self.flashProgress)
      outerStyle.addColorStop(p, outerColor.hex)
    }

    let innerStyle = ctx.createLinearGradient(
      pathStartScreen.x,
      0,
      pathEndScreen.x,
      0,
    )

    innerStyle.addColorStop(0, '#6F0')
    innerStyle.addColorStop(pathProgress / 2, '#4F6')
    innerStyle.addColorStop(pathProgress, '#4F6')
    innerStyle.addColorStop(math.clamp01(pathProgress + 0.02), '#FFF')

    if (editor.editing && clickable.selected) {
      hintGraph.resize()
      drawHintGraph()
    }

    pathGraph.strokeWidth = 0.4
    pathGraph.strokeColor = outerStyle
    pathGraph.dashed = false
    drawPathGraph()

    pathGraph.strokeWidth = 0.2
    pathGraph.strokeColor = innerStyle
    pathGraph.dashed = true
    drawPathGraph()

    camera.drawThrough(ctx, drawLocal, transform)
    base.draw()

    // Reset alpha
    ctx.globalAlpha = 1

    if (self.debug) {
      shape.draw(ctx, camera)

      if (dynamic) rigidbody.draw(ctx)
    }

    // TODO: Polish bounding box
    if (debug || clickable.selectedInEditor) union.draw(ctx, camera)
  }

  function reset() {
    base.reset()

    pathPosition.set(pathStart)
    pathPositionWorld.set(pathStartWorld)

    // TODO: Fix circle jitter w/o calling tick()
    tick()
  }

  function resize() {
    hintGraph.resize()
  }

  /* Editor logic */

  const editor = parent // Parent is implicitly editor

  let oldExpressionLatex

  function select() {
    if (!editor.editing) return

    parent.sendEvent('selectedPathGoalForEditing')

    editor.select(self, ['start', 'end'])

    oldExpressionLatex = parent.currentLatex

    ui.mathFieldLabel.innerText = 'P='
    ui.mathField.latex(pathExpressionLatex)
    ui.mathFieldStatic.latex(pathExpressionLatex)
  }

  function deselect() {
    if (!editor.editing) return

    parent.sendEvent('unselectedPathGoalForEditing')

    editor.deselect()

    ui.mathFieldLabel.innerText = 'Y='
    ui.mathField.latex(oldExpressionLatex)
    ui.mathFieldStatic.latex(oldExpressionLatex)
  }

  function setGraphExpression(text, latex) {
    if (!clickable.selected) return

    if (!text) return

    pathExpression = text
    pathExpressionLatex = latex

    pathGraph.expression = text
    pathGraph.resample()

    hintGraph.expression = text
    hintGraph.resample()

    ui.mathFieldStatic.latex(latex)

    updateBounds()
  }

  function dragMove(point) {
    if (!editor.editing) return

    transform.position.x = point.x

    // Reset pathStart/pathEnd
    // pathStart.x += delta.x
    // pathEnd.x += delta.x

    // Re-transform to world space
    transform.transformPoint(pathStart, pathStartWorld)
    transform.transformPoint(pathEnd, pathEndWorld)

    // Reset pathPosition
    pathPosition.set(pathStart)
    transform.transformPoint(pathPosition, pathPositionWorld)

    pathStart.min(pathEnd, pathMin)
    pathStart.max(pathEnd, pathMax)

    pathStartWorld.min(pathEndWorld, pathMinWorld)
    pathStartWorld.max(pathEndWorld, pathMaxWorld)

    // Re-calculate path progress
    tickPath()

    // Update graph
    pathGraph.bounds[0] = pathStartWorld.x
    pathGraph.bounds[1] = pathEndWorld.x
    pathGraph.resample()

    boundsTransform.x = point.x
    updateBounds()

    trackPoints = [pathStartWorld, pathEndWorld]

    editor.update()

    // Don't propagate drag events to handles
    return false
  }

  function mouseDown() {
    // Don't propagate mouse down event to handles
    return false
  }

  function dragEnd() {
    if (!editor.editing) return
    reset()
  }

  let _p = Vector2()
  function setX(x) {
    // HACK: Not sure why, but
    // when I move the code in dragMove
    // to setX() the bounding box doesn't
    // update properly? TODO: Debug
    _p.x = x
    dragMove(_p)
  }

  function setStart(newStart) {
    // starting + pathEnd.x/2 - transform.x = pathStart.x/2

    const newPathStartX = newStart - transform.x
    setEnds(Math.min(pathEnd.x - 1, newPathStartX), pathEnd.x)
    editor.update()
  }

  function setEnd(newEnd) {
    const newPathEndX = newEnd - transform.x
    setEnds(pathStart.x, Math.max(pathStart.x + 1, newPathEndX))
    editor.update()
  }

  return self.mix({
    transform,

    tick,
    draw,

    setStart,
    setEnd,

    setX,

    select,
    deselect,

    mouseDown,
    dragMove,
    dragEnd,

    reset,
    resize,

    checkComplete,

    trackPoints,
    shape,

    clickable,

    setGraphExpression,

    bounds,
    boundsTransform,

    setEnds,

    get selected() {
      return clickable.selected
    },

    get starting() {
      return pathStart.x + transform.x
    },

    get ending() {
      return pathEnd.x + transform.x
    },

    get pathStart() {
      return pathStart
    },

    get pathEnd() {
      return pathEnd
    },

    get pathExpression() {
      return pathExpression
    },

    get pathExpressionLatex() {
      return pathExpressionLatex
    },

    get completedProgress() {
      return pathProgress
    },
    get type() {
      return 'path'
    },

    set debug(v) {
      debug = v
    },
  })
}
