function Vector2() {
  let x
  let y
  
  if (arguments.length == 0) {
    x = 0
    y = 0
  }
  else if (arguments.length == 1) {
    let o = arguments[0]
    if (_.isObject(o)) {
      x = o.x
      y = o.y
    }
    else if (_.isArray(o)) {
      x = o[0]
      y = o[1]
    }
    else if (_.isNumber(o)) {
      x = Math.cos(o)
      y = Math.sin(o)
    }
  }
  else {
    x = arguments[0] || 0
    y = arguments[1] || 0
  }
  
  let magnitude = 0
  let magnitudeDirty = true
  
  function setX(_x) {
    x = _.isNumber(_x) ? _x : 0
    magnitudeDirty = true
  }
  
  function setY(_y) {
    y = _.isNumber(_y) ? _y : 0
    magnitudeDirty = true
  }
  
  function set() {
    if (arguments.length == 0) {
      x = 0
      y = 0
    }
    else if (arguments.length == 1) {
      let o = arguments[0]
      if (_.isObject(o)) {
        x = o.x
        y = o.y
      }
      else if (_.isArray(o)) {
        x = o[0]
        y = o[1]
      }
      else if (_.isNumber(o)) {
        x = Math.cos(o)
        y = Math.sin(o)
      }
    }
    else {
      x = arguments[0]
      y = arguments[1]
    }
    
    magnitudeDirty = true
    return this
  }
  
  function clone() {
    return Vector2(x, y)
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
  
  function abs(output) {
    if (!output) output = this
    
    output.x = Math.abs(x)
    output.y = Math.abs(y)
    
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
    
    let sin
    let cos
    
    if (_.isObject(angle)) {
      sin = angle.y
      cos = angle.x
    }
    else {
      sin = Math.sin(angle)
      cos = Math.cos(angle)
    }
    
    let newX = x*cos-y*sin
    let newY = x*sin+y*cos
    
    output.x = newX
    output.y = newY
    
    return output
  }
  
  function perturb(radius=1, output) {
    if (!output) output = this

    const a = Math.random()*TAU
    const c = Math.cos(a)*radius
    const s = Math.sin(a)*radius
    
    output.x += c
    output.y += s
    
    return output
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
    clone,
    
    add,
    subtract,
    multiply,
    divide,
    negate,
    
    min,
    max,
    abs,
    
    dot,
    lerp,
    rotate,
    perturb,
    
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
    
    get z() {return 0},
    
    get magnitude() {return getMagnitude()},
    get normalized() {return normalize()},
  }
}

function Vector2Pinf() {
  return Vector2(math.pinf, math.pinf)
}

function Vector2Ninf() {
  return Vector2(math.ninf, math.ninf)
}