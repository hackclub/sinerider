function Vector2() {
  let x
  let y
  
  if (arguments.length == 0) {
    x = 0
    y = 0
  }
  else if (_.isObject(arguments[0])) {
    x = arguments[0].x
    y = arguments[0].y
  }
  else {
    x = arguments[0] || 0
    y = arguments[1] || 0
  }
  
  let magnitude = 0
  let magnitudeDirty = true
  
  function setX(_x) {
    x = _x
    magnitudeDirty = true
  }
  
  function setY(_y) {
    y = _y
    magnitudeDirty = true
  }
  
  function set() {
    if (arguments.length == 0) {
      x = 0
      y = 0
    }
    else if (arguments.length == 1) {
      x = arguments[0].x
      y = arguments[0].y 
    }
    else {
      x = arguments[0]
      y = arguments[1]
    }
    
    magnitudeDirty = true
  }
  
  function add(other, output) {
    if (!output) output = this
    
    output.x = x+other.x
    output.y = y+other.y
    
    return output
  }
  
  function subtract(other, output) {
    if (!output) output = this
    
    output.x = x-other.x
    output.y = y-other.y
    
    return output
  }
  
  function multiply(scalar, output) {
    if (!output) output = this
    
    output.x = x*scalar
    output.y = y*scalar
    
    return output
  }
  
  function divide(scalar, output) {
    if (!output) output = this
    
    output.x = x/scalar
    output.y = y/scalar
    
    return output
  }
  
  function negate(output) {
    if (!output) output = this
    
    output.x = -x
    output.y = -y
    
    return output
  }
  
  function lerp(other, t, output) {
    if (!output) output = this
    
    output.x = math.lerp(x, other.x, t)
    output.y = math.lerp(y, other.y, t)
    
    return output
  }
  
  function min(other, output) {
    if (!output) output = this
    
    output.x = Math.min(x, other.x)
    output.y = Math.min(y, other.y)
    
    return output
  }
  
  function max(other, output) {
    if (!output) output = this
    
    output.x = Math.max(x, other.x)
    output.y = Math.max(y, other.y)
    
    return output
  }
  
  function getMagnitude() {
    if (magnitudeDirty) {
      magnitude = Math.sqrt(x*x+y*y)
      magnitudeDirty = false
    }
    return magnitude
  }
  
  function dot(other) {
    return x*other.x+y*other.y
  }
  
  function rotate(angle, output) {
    if (!output) output = this
    
    let sin = Math.sin(angle)
    let cos = Math.cos(angle)
    
    let newX = x*cos-y*sin
    let newY = x*sin+y*cos
    
    output.x = newX
    output.y = newY
    
    magnitudeDirty = true
  }
  
  function normalize(output) {
    if (!output) output = this

    const m = getMagnitude()
    
    output.x /= m
    output.y /= m
    
    return output
  }
  
  function orthogonalize(output) {
    if (!output) output = this
    
    const orthogonalX = -y
    const orthogonalY = x
    
    output.x = orthogonalX
    output.y = orthogonalY
    
    return output
  }
  
  function toString(digits=3) {
    const sx = math.truncate(x, digits)
    const sy = math.truncate(y, digits)
    return `[${sx}, ${sy}]`
  }
  
  return {
    set,
    
    add,
    subtract,
    multiply,
    divide,
    negate,
    
    min,
    max,
    
    dot,
    lerp,
    rotate,
    
    normalize,
    orthogonalize,
    
    toString,
    
    get 0() {return x},
    set 0(v) {setX(v)},
    
    get 1() {return y},
    set 1(v) {setY(v)},
    
    get x() {return x},
    set x(v) {setX(v)},
    
    get y() {return y},
    set y(v) {setY(v)},
    
    get magnitude() {return getMagnitude()},
    get normalized() {return normalize()},
  }
}