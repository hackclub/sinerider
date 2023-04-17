function Bounds() {
  const self = {}

  const center = Vector2()
  const size = Vector2()

  const extents = Vector2()

  const min = Vector2()
  const max = Vector2()

  let recomputing = false

  center.observe(centerModified)
  size.observe(sizeModified)
  extents.observe(extentsModified)
  min.observe(minModified)
  max.observe(maxModified)

  set.apply(self, arguments)

  function set() {
    recomputing = true

    if (arguments.length == 1) {
      const spec = arguments[0]
      center.set(spec.center)
      size.set(spec.size)
    } else if (arguments.length == 2) {
      center.set(arguments[0])
      size.set(arguments[1])
    } else if (arguments.length == 4) {
      center.set(arguments[0], arguments[1])
      size.set(arguments[2], arguments[3])
    }

    size.abs()

    recomputeFromCenterSize()
  }

  function setMinMax() {
    if (arguments.length == 2) {
      min.set(arguments[0])
      max.set(arguments[1])
    } else if (arguments.length == 4) {
      min.set(arguments[0], arguments[1])
      max.set(arguments[2], arguments[3])
    }

    recomputeFromMinMax()
  }

  function clone() {
    return Bounds(center, size)
  }

  function equals(other) {
    const equalCenter = center.equals(other.center)
    const equalSize = size.equals(other.size)

    return equalCenter && equalSize
  }

  function centerModified() {
    if (recomputing) return
    recomputing = true

    recomputeFromCenter()
  }

  function sizeModified() {
    if (recomputing) return
    recomputing = true

    size.abs()

    recomputeFromCenterSize()
  }

  function extentsModified() {
    if (recomputing) return
    recomputing = true

    extents.abs()

    recomputeFromCenterExtents()
  }

  function minModified() {
    if (recomputing) return
    recomputing = true

    recomputeFromMinMax()
  }

  function maxModified() {
    if (recomputing) return
    recomputing = true

    recomputeFromMinMax()
  }

  function recomputeFromCenter() {
    center.add(extents, max)
    center.subtract(extents, min)

    recomputing = false
  }

  function recomputeFromCenterSize() {
    size.divide(2, extents)
    center.add(extents, max)
    center.subtract(extents, min)

    recomputing = false
  }

  function recomputeFromCenterExtents() {
    extents.multiply(2, size)
    center.add(extents, max)
    center.subtract(extents, min)

    recomputing = false
  }

  function recomputeFromMinMax() {
    if (min.x > max.x) min.swapX(max)
    if (min.y > max.y) min.swapY(max)

    max.subtract(min, size)
    size.divide(2, extents)
    min.add(extents, center)

    recomputing = false
  }

  function expand(other) {
    if (other.generator == Vector2) {
      min.min(other)
      max.max(other)
    } else if (other.generator == Bounds) {
      self.expand(other.min)
      self.expand(other.max)
    } else {
      throw new Error(
        `Cannot expand bounds to fit other of invalid type: `,
        other,
      )
    }
  }

  function contains(other) {
    if (other.generator == Vector2) {
      const cx = other.x >= min.x && other.x <= max.x
      const cy = other.y >= min.y && other.y <= max.y

      return cx && cy
    } else if (other.generator == Bounds) {
      return self.contains(other.min) && self.contains(other.max)
    } else {
      throw new Error(
        `Cannot check if bounds contains other of invalid type: `,
        other,
      )
    }
  }

  function toString() {
    return `{center: ${center.toString()}, size: ${size.toString()}}`
  }

  return _.mixIn(self, {
    generator: Bounds,

    set,
    setMinMax,

    clone,
    equals,

    expand,
    contains,

    toString,

    get center() {
      return center
    },
    set center(v) {
      center.set(v)
    },

    get size() {
      return size
    },
    set size(v) {
      size.set(v)
    },

    get extents() {
      return extents
    },
    set extents(v) {
      setSize(v)
    },

    get min() {
      return min
    },
    set min(v) {
      min.set(v)
    },

    get max() {
      return max
    },
    set max(v) {
      max.set(v)
    },
  })
}

// Tests
LOGTESTS = false

;(() => {
  let a
  let b
  let c
  let d
  let p

  function Validate(bounds) {
    // center+extents=max
    Test(Vector2(bounds.center).add(bounds.extents)).equals(bounds.max)

    // center-extents=min
    Test(Vector2(bounds.center).subtract(bounds.extents)).equals(bounds.min)

    // size/2=extents
    Test(Vector2(bounds.size).divide(2)).equals(bounds.extents)

    // min.x <= max.x
    Test(bounds.min.x).lessThanOrEquals(bounds.max.x)

    // min.y <= max.y
    Test(bounds.min.y).lessThanOrEquals(bounds.max.y)

    // size.x >= 0
    Test(bounds.size.x).greaterThanOrEquals(0)

    // size.y >= 0
    Test(bounds.size.y).greaterThanOrEquals(0)

    // extents.x >= 0
    Test(bounds.extents.x).greaterThanOrEquals(0)

    // extents.y >= 0
    Test(bounds.extents.y).greaterThanOrEquals(0)
  }

  function ValidateProperty(bounds, path) {
    const property = bounds[path]
    // Randomize
    property.randomize(-10, 10)
    Validate(bounds)

    // Set
    property.set(property.x + 1, property.y + 1)
    Validate(bounds)

    // Set x
    property.x = property.x + 1
    Validate(bounds)

    // Set y
    property.y = property.y + 1
    Validate(bounds)

    // Add
    property.add(Vector2(1, 1))
    Validate(bounds)

    // Multiply
    property.multiply(2)
    Validate(bounds)
  }

  // Test basic instantiation

  a = Bounds(1, 2, 3, 4)

  Test(a.center).equals(Vector2(1, 2))
  Test(a.size).equals(Vector2(3, 4))
  Test(a.min).equals(Vector2(-0.5, 0))
  Test(a.max).equals(Vector2(2.5, 4))
  Test(a.extents).equals(Vector2(1.5, 2))

  b = Bounds(a.center, a.size)
  c = Bounds(a)
  d = a.clone()

  Test(a).equals(a)
  Test(a).equals(b)
  Test(a).equals(c)
  Test(a).equals(d)

  Validate(a)
  Validate(b)
  Validate(c)
  Validate(d)

  // Test modification of values

  a = Bounds(1, 2, 3, 4)

  ValidateProperty(a, 'center')
  ValidateProperty(a, 'size')
  ValidateProperty(a, 'min')
  ValidateProperty(a, 'max')
  ValidateProperty(a, 'extents')

  // Test contains/expand on Vector2

  a = Bounds(1, 2, 3, 4)
  p = Vector2(2, 1)

  Test(a.contains(p)).isTrue()

  p = Vector2(5, -7)

  Test(a.contains(p)).isFalse()

  a.expand(p)
  Validate(a)

  Test(a.contains(p)).isTrue()

  // Test contains/expand on Bounds

  a = Bounds(1, 2, 3, 4)
  b = Bounds(1, 1, 1, 1)

  Test(a.contains(b)).isTrue()

  b = Bounds(-6, 4, 3, 2)

  Test(a.contains(b)).isFalse()

  a.expand(b)
  Validate(a)

  Test(a.contains(b)).isTrue()

  Test(b.contains(a)).isFalse()

  b.expand(a)
  Validate(b)

  Test(b.contains(a)).isTrue()
})()
