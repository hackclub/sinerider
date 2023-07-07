function Circle(spec) {
  const self = Shape(spec)

  let { center = Vector2(), radius = 1, color = 'green' } = spec

  function getBounds() {
    return Rect({
      width: radius,
      height: radius,
    })
  }

  function intersectPoint(point, hit) {
    let p = self.localize(point)
    p.subtract(center)

    const intersecting = p.magnitude < radius

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
    ctx.strokeStyle = color
    ctx.lineWidth = 0.1
    ctx.beginPath()
    ctx.arc(center.x, -center.y, radius, 0, TAU)
    ctx.stroke()
  }

  function draw(ctx, camera) {
    camera.drawThrough(ctx, drawLocal, self.transform)
  }

  return _.mixIn(self, {
    shapeType: 'circle',

    draw,

    getBounds,

    intersectPoint,
    intersectCircle,
    intersectRect,

    get center() {
      return center
    },
    set center(v) {
      center.set(v)
    },

    get radius() {
      return getRadius()
    },
    set radius(v) {
      radius = v
    },
  })
}
