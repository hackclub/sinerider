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
  const transform = Transform({invertY: true})
  
  let {
    canvas
  } = spec
  
  const ctx = canvas.getContext('2d')
  
  let width
  let height
  
  let vertical
  let aspect
  
  const resizeSubs = []
  
  const minFramePoint = Vector2()
  const maxFramePoint = Vector2()
  
  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    
    canvas.width = width
    canvas.height = height
    
    transform.x = width/2
    transform.y = height/2
    transform.scale = math.min(width, height)/2
    
    vertical = height > width
    aspect = width/height
    
    minFramePoint[0] = vertical ? -1 : -aspect
    minFramePoint[1] = vertical ? 1/aspect : -1
    
    maxFramePoint[0] = vertical ? 1 : aspect
    maxFramePoint[1] = vertical ? 1/aspect : 1
    
    _.callEach(resizeSubs)
  }
  
  resize()
  
  return {
    transform,
    
    canvas,
    ctx,
    
    resize,
    resizeSubs,
    
    get width() {return width},
    get height() {return height},
    
    get vertical() {return height},
    get aspect() {return aspect},
    
    get minFramePoint() {return minFramePoint},
    get maxFramePoint() {return maxFramePoint},
  }
}