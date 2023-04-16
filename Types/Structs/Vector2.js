function Vector2() {
  const self = {}

  let x
  let y

  let observerCallback = null
  let observerCallbacks = null

  let magnitude = 0
  let magnitudeDirty = true

  set.apply(self, arguments)

  function setX(_x) {
    if (x == _x) return

    x = _.isNumber(_x) ? _x : 0

    magnitudeDirty = true
    notifyObservers()
  }

  function setY(_y) {
    if (y == _y) return

    y = _.isNumber(_y) ? _y : 0

    magnitudeDirty = true
    notifyObservers()
  }

  function set() {
    if (arguments.length == 0) {
      x = 0
      y = 0
    } else if (arguments.length == 1) {
      let o = arguments[0]

      if (_.isArray(o)) {
        x = o[0]
        y = o[1]
      } else if (_.isObject(o)) {
        x = o.x ?? 0
        y = o.y ?? 0
      } else if (_.isNumber(o)) {
        x = Math.cos(o)
        y = Math.sin(o)
      }
    } else {
      x = arguments[0]
      y = arguments[1]
    }

    if (_.isNaN(x)) {
      throw 'Setting x to NaN'
      console.trace()
    }
    if (_.isNaN(y)) {
      throw 'Setting y to NaN'
      console.trace()
    }

    magnitudeDirty = true
    notifyObservers()

    return self
  }

  function observe(cb) {
    if (!observerCallback) observerCallback = cb
    else if (!observerCallbacks) {
      observerCallbacks = [observerCallback]
      observerCallback = () => {
        for (let i = 0; i < observerCallbacks.length; i++) {
          observerCallbacks[i]()
        }
      }
    } else {
      observerCallbacks.push(cb)
    }
  }

  function notifyObservers() {
    if (observerCallback) observerCallback()
  }

  function clone() {
    return Vector2(x, y)
  }

  function equals(other) {
    return x === other.x && y === other.y
  }

  function swapX(other) {
    const ox = other.x
    other.x = x
    setX(ox)

    return self
  }

  function swapY(other) {
    const oy = other.y
    other.y = y
    setY(oy)

    return self
  }

  function add(other, output) {
    if (!output) output = self

    const ox = x + other.x
    const oy = y + other.y

    output.set(ox, oy)

    return output
  }

  function subtract(other, output) {
    if (!output) output = self

    const ox = x - other.x
    const oy = y - other.y

    output.set(ox, oy)

    return output
  }

  function multiply(scalar, output) {
    if (!output) output = self

    const ox = x * scalar
    const oy = y * scalar

    output.set(ox, oy)

    return output
  }

  function divide(scalar, output) {
    if (!output) output = self

    const ox = x / scalar
    const oy = y / scalar

    output.set(ox, oy)

    return output
  }

  function negate(output) {
    if (!output) output = self

    const ox = -x
    const oy = -y

    output.set(ox, oy)

    return output
  }

  function lerp(other, t, output) {
    if (!output) output = self

    const ox = math.lerp(x, other.x, t)
    const oy = math.lerp(y, other.y, t)

    output.set(ox, oy)

    return output
  }

  function min(other, output) {
    if (!output) output = self

    const ox = Math.min(x, other.x)
    const oy = Math.min(y, other.y)

    output.set(ox, oy)

    return output
  }

  function max(other, output) {
    if (!output) output = self

    const ox = Math.max(x, other.x)
    const oy = Math.max(y, other.y)

    output.set(ox, oy)

    return output
  }

  function abs(output) {
    if (!output) output = self

    const ox = Math.abs(x)
    const oy = Math.abs(y)

    output.set(ox, oy)

    return output
  }

  function distance(other) {
    const dx = other.x - x
    const dy = other.y - y

    return Math.sqrt(dx * dx + dy * dy)
  }

  function getMagnitude() {
    if (magnitudeDirty) {
      magnitude = Math.sqrt(x * x + y * y)
      magnitudeDirty = false
    }
    return magnitude
  }

  function dot(other) {
    return x * other.x + y * other.y
  }

  function rotate(angle, output) {
    if (!output) output = self

    let sin
    let cos

    if (_.isObject(angle)) {
      sin = angle.y
      cos = angle.x
    } else {
      sin = Math.sin(angle)
      cos = Math.cos(angle)
    }

    let newX = x * cos - y * sin
    let newY = x * sin + y * cos

    const ox = newX
    const oy = newY

    output.set(ox, oy)

    return output
  }

  function perturb(radius = 1, output) {
    if (!output) output = self

    const a = Math.random() * TAU
    const c = Math.cos(a) * radius
    const s = Math.sin(a) * radius

    const ox = x + c
    const oy = y + s

    output.set(ox, oy)

    return output
  }

  function randomize(min = 0, max = 1) {
    const ox = _.random(min, max)
    const oy = _.random(min, max)

    self.set(ox, oy)
  }

  function normalize(output) {
    if (!output) output = self

    const m = getMagnitude()

    const ox = x / m
    const oy = y / m

    output.set(ox, oy)

    return output
  }

  function orthogonalize(output) {
    if (!output) output = self

    const orthogonalX = -y
    const orthogonalY = x

    const ox = orthogonalX
    const oy = orthogonalY

    output.set(ox, oy)

    return output
  }

  function toString(digits = 3) {
    const sx = math.truncate(x, digits)
    const sy = math.truncate(y, digits)
    return `[${sx}, ${sy}]`
  }

  return _.mixIn(self, {
    generator: Vector2,

    set,
    clone,
    equals,

    observe,

    swapX,
    swapY,

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
    distance,
    randomize,

    normalize,
    orthogonalize,

    toString,

    get 0() {
      return x
    },
    set 0(v) {
      setX(v)
    },

    get 1() {
      return y
    },
    set 1(v) {
      setY(v)
    },

    get x() {
      return x
    },
    set x(v) {
      if (_.isNaN(v)) {
        throw 'Setting x to NaN'
        console.trace()
      }
      setX(v)
    },

    get y() {
      return y
    },
    set y(v) {
      if (_.isNaN(v)) {
        throw 'Setting y to NaN'
        console.trace()
      }
      setY(v)
    },

    get z() {
      return 0
    },

    get magnitude() {
      return getMagnitude()
    },
    get normalized() {
      return normalize()
    },
  })
}

function Vector2Pinf() {
  return Vector2(math.pinf, math.pinf)
}

function Vector2Ninf() {
  return Vector2(math.ninf, math.ninf)
}
