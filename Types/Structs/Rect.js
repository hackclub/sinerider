function Rect(spec) {
  const self = Shape(spec)
  
  let {
    center = Vector2(),
    width = 1,
    height = 1,
  } = spec
  
  function intersectPoint(point, hit) {
    let p = self.localize(point)
    p.subtract(center)
    
    const insideX = Math.abs(p.x) < width/2
    const insideY = Math.abs(p.y) < height/2
    
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
  
  return _.mixIn(self, {
    shapeType: 'rect',
    
    intersectPoint,
    intersectCircle,
    intersectRect,
    
    get center() {return center},
    
    get width() {return width},
    set width(v) {width = v},
    
    get height() {return height},
    set height(v) {height = v},
  })
}