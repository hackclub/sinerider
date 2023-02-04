function Rect(spec) {
  const self = Shape(spec)

  let { center = Vector2(), width = 1, height = 1 } = spec

  function intersectPoint(point, hit) {
    let p = self.localize(point)
    p.subtract(center)

    const insideX = Math.abs(p.x) < width / 2
    const insideY = Math.abs(p.y) < height / 2

    const intersecting = insideX && insideY

    if (hit && intersecting) {
      // TODO: Intersection hit data
    }

    return intersecting
  }

  function intersectCircle(circle, hit) {
    // TODO: Circle intersection
    return false
  }

  function intersectRect(rect, hit) {
    // TODO: Rect intersection
    return false
  }

  function drawLocal(ctx) {
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 0.1
    ctx.beginPath()
    ctx.rect(center.x - width / 2, -center.y - height / 2, width, height)
    ctx.stroke()
  }

  function draw(ctx, camera) {
    camera.drawThrough(ctx, drawLocal, self.transform)
  }

  return _.mixIn(self, {
    shapeType: 'rect',

    draw,

    intersectPoint,
    intersectCircle,
    intersectRect,

    get center() {
      return center
    },
    set center(v) {
      center.set(v)
    },

    get width() {
      return width
    },
    set width(v) {
      width = v
    },

    get height() {
      return height
    },
    set height(v) {
      height = v
    },
  })
}
