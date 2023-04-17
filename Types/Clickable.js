// Anything on the canvas that responds to mouse events

function Clickable(spec) {
  const self = {}

  const { entity, space = 'world', dragThreshold = 0.05 } = spec

  let enabled = spec.enabled ?? true

  const {
    screen = entity.screen,
    camera = entity.camera,
    shape = entity.shape,
  } = spec

  // If layer is unspecified, default is layer 1
  // except for "shapeless" clickables, which are layer 0
  let layer = _.get(spec, 'layer', shape ? 1 : 0)

  let hovering = false
  let holding = false
  let dragging = false
  let selected = false

  const overlapPoint = Vector2()

  const clickPoint = Vector2()

  const mouseDownPoint = Vector2()
  const mouseMovePoint = Vector2()
  const mouseUpPoint = Vector2()

  const hoverOnPoint = Vector2()
  const hoverMovePoint = Vector2()
  const hoverOffPoint = Vector2()

  const dragStartPoint = Vector2()
  const dragMovePoint = Vector2()
  const dragEndPoint = Vector2()

  const dragDelta = Vector2()
  let dragDistance = 0

  function collectHit(point, hits) {
    const overlapping = testOverlap(point)

    if (overlapping) {
      hits.push(self)
      return true
    }

    return false
  }

  function testOverlap(point) {
    if (!shape) return true

    overlapPoint.set(point)

    if (camera) camera.screenToWorld(overlapPoint)

    return shape.intersectPoint(overlapPoint)
  }

  function hoverStart(point) {}

  function hoverMove(point) {}

  function hoverEnd(point) {}

  function dragStart(point) {}

  function dragMove(point) {}

  function dragEnd(point) {}

  function toFrameScalar(scalar) {
    if (space == 'world') return camera.worldToFrameScalar(scalar)
    if (space == 'screen') return screen.transform.transformScalar(scalar)

    // Already in frame space
    return scalar
  }

  function recordPoint(point, output) {
    if (space == 'world') return camera.screenToWorld(point, output)
    else if (space == 'frame') return screen.screenToFrame(point, output)

    // Event points are in screenspace by default
    return output.set(point)
  }

  function mouseEnter(point) {
    hovering = true
    recordPoint(point, hoverOnPoint)
    entity.sendEvent('hoverOn', [hoverOnPoint])
  }

  function mouseExit(point) {
    hovering = false
    recordPoint(point, hoverOffPoint)
    entity.sendEvent('hoverOff', [hoverOffPoint])
  }

  function mouseDown(point) {
    recordPoint(point, mouseDownPoint)

    if (hovering) {
      holding = true
      recordPoint(point, dragStartPoint)

      entity.sendEvent('mouseDown', [mouseDownPoint])
    }
  }

  function mouseMove(point) {
    if (hovering) {
      recordPoint(point, hoverMovePoint)
      entity.sendEvent('hoverMove', [hoverMovePoint])
    }
    if (holding) {
      recordPoint(point, dragMovePoint)
      dragMovePoint.subtract(dragStartPoint, dragDelta)

      dragDistance = dragDelta.magnitude
      let dragThresholdMet = toFrameScalar(dragDistance) > dragThreshold

      if (dragging) {
        entity.sendEvent('dragMove', [dragMovePoint])
      } else if (dragThresholdMet) {
        dragging = true
        entity.sendEvent('dragStart', [dragStartPoint])
      }

      entity.sendEvent('mouseMove', [dragMovePoint])
    }
  }

  function mouseUp(point) {
    recordPoint(point, clickPoint)

    if (holding) {
      holding = false
      entity.sendEvent('click', [clickPoint])
      entity.sendEvent('mouseUp', [mouseUpPoint])
    }
    if (dragging) {
      dragging = false
      recordPoint(point, dragEndPoint)
      entity.sendEvent('dragEnd', [dragEndPoint])
    }
  }

  let deselectMe = null

  function select(_deselectMe) {
    deselectMe = _deselectMe
    selected = true
    entity.sendEvent('select', [])
  }

  function deselect() {
    deselectMe = null
    selected = false
    entity.sendEvent('deselect', [])
  }

  return _.mixIn(self, {
    entity,

    testOverlap,
    collectHit,

    mouseMove,
    mouseDown,
    mouseUp,

    mouseEnter,
    mouseExit,

    clickPoint,

    hoverOnPoint,
    hoverMovePoint,
    hoverOffPoint,

    dragStartPoint,
    dragMovePoint,
    dragEndPoint,
    dragDelta,

    select,
    deselect,

    get layer() {
      return layer
    },

    get hovering() {
      return hovering
    },
    get dragging() {
      return dragging
    },
    get holding() {
      return holding
    },
    get selected() {
      return selected
    },
    get selectedInEditor() {
      return selected && editor.active
    },
    get enabled() {
      return enabled
    },
    set enabled(v) {
      if (!v && deselectMe && editor.active) {
        // console.log('calling deselectMe')
        deselectMe()

        if (deselect) deselect()
      }
      enabled = v
    },

    get dragDistance() {
      return dragDistance
    },
  })
}
