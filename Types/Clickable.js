// Anything on the canvas that responds to mouse events

function Clickable(spec) {
  const {
    entity,
    camera,
    shape,
  } = spec
  
  let hover = false
  const overlapPoint = Vector2()
  
  function testOverlap(point) {
    overlapPoint.set(point)
    
    if (camera)
      camera.screenToWorld(overlapPoint)
      
    return shape.intersectPoint(overlapPoint)
  }
  
  function click(point) {
    
  }
  
  function mouseMoveOver(point) {
    
  }
  
  function mouseDownOver(point) {
    
  }
  
  function mouseUpOver(point) {
    this.click()
  }
  
  function mouseMove(point) {
    hover = testOverlap(point)
    
    if (hover)
      this.mouseMoveOver(point)
  }
  
  function mouseDown(point) {
    hover = testOverlap(point)
    
    if (hover)
      this.mouseDownOver(point)
  }
  
  function mouseUp(point) {
    hover = testOverlap(point)
    
    if (hover)
      this.mouseUpOver(point)
  }
  
  return {
    mouseMove,
    mouseDown,
    mouseUp,
    
    mouseMoveOver,
    mouseDownOver,
    mouseUpOver,
    
    click,
    
    get hover() {return hover},
  }
}