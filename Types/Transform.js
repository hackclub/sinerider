function Transform(spec = {}) {
  let {
    scale = 1,
    rotation = 0,
  } = spec
  
  const position = Vector2(spec.x, spec.y)
  
  function transformPoint(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    output.multiply(scale)
    output.rotate(rotation)
    output.add(position)
    
    return output
  }
  
  function transformDirection(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    output.multiply(scale)
    output.rotate(rotation)
    
    return output
  }
  
  function invertPoint(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    output.subtract(position)
    output.rotate(-rotation)
    output.divide(scale)
    
    return output
  }
  
  function invertDirection(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    output.rotate(-rotation)
    output.divide(scale)
    
    return output
  }
  
  function transformScalar(scalar) {
    return scalar*scale
  }
  
  function invertScalar(scalar) {
    return scalar/scale
  }
  
  function transformCanvas(ctx) {
    ctx.scale(1/scale, 1/scale)
    ctx.rotate(-rotation)
    ctx.translate(-position.x, -position.y)
  }
  
  function invertCanvas(ctx) {
    ctx.translate(position.x, position.y)
    ctx.rotate(rotation)
    ctx.scale(scale, scale)
  }
  
  return {
    transformPoint,
    invertPoint,
    
    transformDirection,
    invertDirection,
    
    transformScalar,
    invertScalar,
    
    transformCanvas,
    invertCanvas,
    
    get position() {return position},
    set position(v) {
      position.x = v[0]
      position.y = v[1]
    },
    
    get x() {return position.x},
    set x(v) {position.x = v},
    
    get y() {return position.y},
    set y(v) {position.y = v},
    
    get scale() {return scale},
    set scale(v) {scale = v},
    
    get rotation() {return rotation},
    set rotation(v) {rotation = v},
  }
}