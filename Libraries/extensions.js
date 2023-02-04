// Extensions to external libraries that I need for my own sick purposes

// lodash

_.tryInvoke = function (object, path, ...args) {
  let f = _.get(object, path)
  if (_.isFunction(f)) {
    return f.apply(object, args)
  }
  return null
}

_.callEach = function (array, args) {
  for (let i = 0; i < array.length; i++) {
    if (_.isFunction(array[i])) {
      array[i].apply(null, args)
    } else if (_.isArray(array[i])) {
      _.callEach(array[i], args)
    }
  }
}

_.invokeEach = function (array, path, args) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]

    if (_.isArray(v)) {
      _.invokeEach(v, path, args)
    } else {
      let f = _.get(v, path)

      if (_.isFunction(f)) f.apply(v, args)
    }
  }
}

_.eachDeep = function (array, callback, args = []) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]

    if (_.isArray(v)) _.eachDeep(v, callback, args)
    else callback.apply(null, [v, ...args])
  }
}

_.isInDeep = function (array, object) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]

    if (object === v) return true
    else if (_.isArray(v)) {
      if (_.isInDeep(v, object)) return true
    }
  }

  return false
}

_.removeDeep = function (array, object) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]

    if (v == object) {
      array.splice(i, 1)
      return
    } else if (_.isArray(v)) _.removeDeep(v, object)
  }
}

_.mix = function (...sources) {
  const result = {}
  for (const source of sources) {
    const props = Object.keys(source)
    for (const prop of props) {
      const descriptor = Object.getOwnPropertyDescriptor(source, prop)
      Object.defineProperty(result, prop, descriptor)
    }
  }
  return result
}

_.mixIn = function (...sources) {
  const result = sources[0]
  for (let i = 1; i < sources.length; i++) {
    let source = sources[i]
    const props = Object.keys(source)
    for (const prop of props) {
      const descriptor = Object.getOwnPropertyDescriptor(source, prop)
      Object.defineProperty(result, prop, descriptor)
    }
  }
  return result
}

// math.js

math.isComplex = function (v) {
  return _.has(v, 're') && _.has(v, 'im')
}

math.clamp = function (a, b, t) {
  return Math.max(a, Math.min(t, b))
}

math.clamp01 = function (t) {
  return Math.max(0, Math.min(t, 1))
}

math.lerp = function (a, b, t, smooth = false) {
  if (smooth) t = math.smooth(t)

  return a + (b - a) * t
}

math.modLerp = function (a, b, t, mod = TAU, smooth = false) {
  while (a < 0) a += mod
  while (a > mod) a -= mod

  while (b < 0) b += mod
  while (b > mod) b -= mod

  if (Math.abs(a - b) > mod / 2) {
    if (a < b) a += mod
    else b += mod
  }

  let c = math.lerp(a, b, t, smooth)

  while (c < 0) c += mod
  while (c > mod) c -= mod

  return c
}

math.unlerp = function (a, b, c) {
  return (c - a) / (b - a)
}

math.truncate = function (number, digits) {
  const c = Math.pow(10, digits)
  return Math.floor(number * c) / c
}

math.smooth = function (t) {
  t *= Math.PI
  return 1 - (Math.cos(t) + 1) / 2
}

math.pinf = Number.POSITIVE_INFINITY
math.ninf = Number.NEGATIVE_INFINITY

// Constants

PINF = Number.POSITIVE_INFINITY
NINF = Number.NEGATIVE_INFINITY
PI = Math.PI
TAU = PI * 2

const alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'

// "The poor man's jquery" —Nicky Case
const $ = document.querySelector.bind(document)
