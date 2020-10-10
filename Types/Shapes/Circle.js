function Circle(spec) {
  const self = Shape(spec)
  
  let {
    center = Vector2(),
    radius = 1,
  } = spec
  
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
  
  return _.mixIn(self, {
    shapeType: 'circle',
    
    intersectPoint,
    intersectCircle,
    intersectRect,
    
    get center() {return center},
    
    get radius() {return getRadius()},
    set radius(v) {radius = v},
  })
}