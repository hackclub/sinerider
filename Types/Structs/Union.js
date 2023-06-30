function Union(spec) {
  const self = Shape(spec)

  const { shapes } = spec

  const center = Vector2()

  let width = math.ninf
  let height = math.ninf

  for (const shape of shapes) {
    width = Math.max(width, shape.width)
    height = Math.max(height, shape.height)
    center.add(shape.center)
  }

  center.divide(shapes.length)

  function getBounds() {
    return self
  }

  function intersectPoint(point, hit) {
    return shapes.some((shape) => shape.intersectPoint(point, hit))
  }

  function intersectCircle(circle, hit) {
    return shapes.some((shape) => shape.intersectCircle(circle, hit))
  }

  function intersectRect(rect, hit) {
    return shapes.some((shape) => shape.intersectRect(rect, hit))
  }

  function draw(ctx, camera) {
    for (const shape of shapes) shape.draw(ctx, camera)
  }

  return _.mixIn(self, {
    shapeType: 'union',

    draw,

    intersectPoint,
    intersectCircle,
    intersectRect,

    getBounds,

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
