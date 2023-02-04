function Color() {
  const self = {}

  let r = 0
  let g = 0
  let b = 0

  let h = 0
  let s = 0
  let v = 0

  let stringsDirty = true

  let hexString
  let rgbString
  let hsvString

  set.apply(self, arguments)

  function set() {
    if (arguments.length == 1) {
      let o = arguments[0]
      if (_.isString(o)) {
        setHex(o)
        computeHsv()
      } else if (_.isObject(o)) {
        if (_.has(o, ['h', 's', 'v'])) {
          setHsv(o.h, o.s, o.v)
        } else {
          r = o.r || 0
          g = o.g || 0
          b = o.b || 0
          computeHsv()
        }
      } else if (_.isArray(o)) {
        r = o.r
        g = o.g
        b = o.b
        computeHsv()
      }
    } else if (arguments.length < 3) {
      r = 0
      g = 0
      b = 0
      computeHsv()
    } else {
      r = arguments[0] || 0
      g = arguments[1] || 0
      b = arguments[2] || 0
      computeHsv()
    }

    return self
  }

  function clone() {
    return Color(r, g, b)
  }

  function computeStrings() {
    if (!stringsDirty) return

    hexString = '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
    rgbString = `rgb(${Math.round(r * 255)}, ${Math.round(
      g * 255,
    )}, ${Math.round(b * 255)}`
    hsvString = `hsv(${Math.round(h * 255)}, ${Math.round(
      s * 255,
    )}, ${Math.round(v * 255)}`
  }

  function componentToHex(c) {
    c = math.clamp01(c)
    const hex = Math.round(c * 255).toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }

  function computeHsv() {
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    h, s, (v = max)
    let d = max - min

    s = max == 0 ? 0 : d / max

    if (max == min) {
      h = 0 // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
  }

  function setHsv(_h, _s, _v) {
    h = _h
    s = _s
    v = _v

    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0:
        ;(r = v), (g = t), (b = p)
        break
      case 1:
        ;(r = q), (g = v), (b = p)
        break
      case 2:
        ;(r = p), (g = v), (b = t)
        break
      case 3:
        ;(r = p), (g = q), (b = v)
        break
      case 4:
        ;(r = t), (g = p), (b = v)
        break
      case 5:
        ;(r = v), (g = p), (b = q)
        break
    }

    stringsDirty = true
    return self
  }

  function setR(_r) {
    r = _r
    computeHsv()
    stringsDirty = true
    return self
  }

  function setG(_g) {
    g = _g
    computeHsv()
    stringsDirty = true
    return self
  }

  function setB(_b) {
    b = _b
    computeHsv()
    stringsDirty = true
    return self
  }

  function setH(_h) {
    setHsv(_h, s, v)
    stringsDirty = true
    return self
  }

  function setS(_s) {
    setHsv(h, _s, v)
    computeHsv()
    stringsDirty = true
    return self
  }

  function setV(_v) {
    setHsv(h, s, _v)
    computeHsv()
    stringsDirty = true
    return self
  }

  function setRgb(_r, _g, _b) {
    r = _r
    g = _g
    b = _b
    computeHsv()
    stringsDirty = true

    return self
  }

  function getHex() {
    computeStrings()
    return hexString
  }

  function setHex(_hexString) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hexString)

    r = parseInt(result[1], 16) / 255
    g = parseInt(result[2], 16) / 255
    b = parseInt(result[3], 16) / 255

    computeHsv()
    stringsDirty = true
  }

  function add(other, output) {
    if (!output) output = this

    output.r = r + other.r
    output.g = g + other.g
    output.b = b + other.b

    return output
  }

  function subtract(other, output) {
    if (!output) output = this

    output.r = r - other.r
    output.g = g - other.g
    output.b = b - other.b

    return output
  }

  function multiply(other, output) {
    if (!output) output = this

    if (_.isObject(other)) {
      output.r = r * other.r
      output.g = g * other.g
      output.b = b * other.b
    } else {
      output.r = r * other
      output.g = g * other
      output.b = b * other
    }

    return output
  }

  function divide(scalar, output) {
    if (!output) output = this

    output.r = r / scalar
    output.g = g / scalar
    output.b = b / scalar

    return output
  }

  function invertRgb(output) {
    if (!output) output = this

    output.r = 1 - r
    output.g = 1 - g
    output.b = 1 - b

    return output
  }

  function lerp(other, t, output) {
    if (!output) output = this

    output.r = math.lerp(r, other.r, t)
    output.g = math.lerp(g, other.g, t)
    output.b = math.lerp(b, other.b, t)

    return output
  }

  function toString() {
    return `RGB(${math.truncate(r, 2)}, ${math.truncate(g, 2)}, ${math.truncate(
      b,
      2,
    )})`
  }

  return _.mixIn(self, {
    get r() {
      return r
    },
    set r(_r) {
      setR(_r)
    },

    get g() {
      return g
    },
    set g(_g) {
      setG(_g)
    },

    get b() {
      return b
    },
    set b(_b) {
      setB(_b)
    },

    get h() {
      return h
    },
    set h(_h) {
      setHsv(_h, s, v)
    },

    get s() {
      return s
    },
    set s(_s) {
      setHsv(h, _s, v)
    },

    get v() {
      return v
    },
    set v(_v) {
      setHsv(h, s, _v)
    },

    get hex() {
      return getHex()
    },
    set hex(_hex) {
      setHex(_hex)
    },

    set,
    clone,

    setHsv,
    setRgb,
    setHex,

    setR,
    setG,
    setB,

    setH,
    setS,
    setV,

    add,
    subtract,

    multiply,
    divide,

    invertRgb,

    lerp,

    toString,
  })
}

function ColorHSV(h, s, v) {
  const color = Color()
  color.setHsv(h, s, v)
  return color
}
