// The Screen transforms the "Frame" into screen-space coordinates.
//
// The Frame is a normalized representation of the screen, where a square quadrant is fitted into the center.
//
// A helpful diagram of the Frame:
//
//          +1 (screen top)
// +----+---------+----+
// |    |    |    |    |
// |    |    |    |    |
// |  -1|----+----|+1  | (screen right)
// |    |    |    |    |
// |    |    |    |    |
// +----+---------+----+
//          -1
//
// The screen will notify a list of subscribers whenever it is resized. (For example: when the screen size changes, the main Graph needs to recompute all its points to match the new boundaries of the screen)

function Screen(spec = {}) {
  const transform = Transform()

  let {
    canvas,
    element = window,
    // Disable blending by default for performance
    alpha = false,
  } = spec

  const ctx = canvas.getContext('2d', { alpha })

  let width
  let height

  let vertical
  let aspect

  const resizeSubs = []

  const minFramePoint = Vector2()
  const maxFramePoint = Vector2()

  let resolutionScalingFactor = 1.0

  function resize() {
    width = element.innerWidth || element.width
    height = element.innerHeight || element.height

    width *= resolutionScalingFactor
    height *= resolutionScalingFactor

    canvas.width = width
    canvas.height = height

    transform.x = width / 2
    transform.y = height / 2
    transform.scale = math.min(width, height) / 2

    vertical = height > width
    aspect = width / height

    minFramePoint[0] = vertical ? -1 : -aspect
    minFramePoint[1] = vertical ? -1 / aspect : -1

    maxFramePoint[0] = vertical ? 1 : aspect
    maxFramePoint[1] = vertical ? 1 / aspect : 1

    _.callEach(resizeSubs)
  }

  function screenToFrame(point, output) {
    if (!output) output = point

    transform.invertPoint(point, output)
    output.y *= -1

    return output
  }

  function frameToScreen(point, output) {
    if (!output) output = point

    output.set(point)

    output.y *= -1
    transform.transformPoint(output)

    return output
  }

  function screenToFrameDirection(direction, output) {
    if (!output) output = direction

    transform.invertDirection(direction, output)
    output.y *= -1

    return output
  }

  function frameToScreenDirection(direction, output) {
    if (!output) output = direction

    output.set(direction)

    output.y *= -1
    transform.transformDirection(output)

    return output
  }

  resize()

  return {
    transform,

    canvas,
    ctx,

    resize,
    resizeSubs,

    screenToFrame,
    frameToScreen,

    screenToFrameDirection,
    frameToScreenDirection,

    get width() {
      return width
    },
    get height() {
      return height
    },

    get vertical() {
      return height
    },
    get aspect() {
      return aspect
    },

    get minFramePoint() {
      return minFramePoint
    },
    get maxFramePoint() {
      return maxFramePoint
    },

    get resolutionScalingFactor() {
      return resolutionScalingFactor
    },
    set resolutionScalingFactor(o) {
      resolutionScalingFactor = o
    },
  }
}
