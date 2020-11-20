function Transform(spec={}, entity=null) {
  let {
    scale = 1,
    rotation = 0,
  } = spec
  
  if (!entity && spec.entity)
    entity = spec.entity
  
  const position = spec.position ? 
    Vector2(spec.position) :
    Vector2(spec.x || 0, spec.y || 0)
    
  const rotator = Vector2(Math.cos(rotation), Math.sin(rotation))
  const inverseRotator = Vector2(Math.cos(-rotation), Math.sin(-rotation))
  
  function tryApplyParent(path, ...args) {
    if (!entity)
      return false
    if (!entity.parent)
      return false
    if (!entity.parent.transform)
      return false
    
    entity.parent.transform[path].apply(entity.parent.transform, args)
    
    return true
  }
  
  function setRotation(_rotation) {
    if (rotation != _rotation) {
      rotation = _rotation
      rotator.x = Math.cos(rotation)
      rotator.y = Math.sin(rotation)
      inverseRotator.x = Math.cos(-rotation)
      inverseRotator.y = Math.sin(-rotation)
    }
  }
  
  function transformPoint(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    output.multiply(scale)
    output.rotate(rotator)
    output.add(position)
    
    tryApplyParent('transformPoint', point, output)
    
    return output
  }
  
  function invertPoint(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    tryApplyParent('invertPoint', point, output)
    
    output.subtract(position)
    output.rotate(-rotation)
    output.divide(scale)
    
    return output
  }
  
  function transformDirection(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    output.multiply(scale)
    output.rotate(rotator)
    
    tryApplyParent('transformDirection', point, output)
    
    return output
  }
  
  function invertDirection(point, output=null) {
    if (!output) output = point
    else output.set(point)
    
    tryApplyParent('invertDirection', point, output)
    
    output.rotate(-rotation)
    output.divide(scale)
    
    return output
  }
  
  function transformScalar(scalar) {
    tryApplyParent('transformScalar', scalar)
    return scalar*scale
  }
  
  function invertScalar(scalar) {
    tryApplyParent('invertScalar', scalar)
    return scalar/scale
  }
  
  function transformCanvas(ctx) {
    ctx.scale(1/scale, 1/scale)
    ctx.rotate(-rotation)
    ctx.translate(-position.x, -position.y)
    
    tryApplyParent('transformCanvas', ctx)
  }
  
  function invertCanvas(ctx) {
    tryApplyParent('invertCanvas', ctx)
    
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
    set rotation(v) {setRotation(v)},
  }
}