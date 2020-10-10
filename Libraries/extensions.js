// Extensions to external libraries that I need for my own sick purposes

// lodash

_.callEach = function(array, args) {
  for (let i = 0; i < array.length; i++) {
    if (_.isFunction(array[i])) {
      array[i].apply(null, args)
    }
    else if (_.isArray(array[i])) {
      _.callEach(array[i], args)
    }
  }
}

_.invokeEach = function(array, path, args) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]
    
    if (_.isFunction(v[path])) {
      v[path].apply(v, args)
    }
    else if (_.isArray(v)) {
      _.invokeEach(v, path, args)
    }
  }
}

_.eachDeep = function(array, callback, args) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]
    
    if (_.isArray(v))
      _.eachDeep(v, callback, args)
    else
      callback.apply(v, args)
  }
}

_.isInDeep = function(array, object) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]
    
    if (object == v)
      return true
    else if (_.isArray(v)) {
      if (_.isInDeep(array, object))
        return true
    }
  }
  
  return false
}

_.removeDeep = function(array, object) {
  for (let i = 0; i < array.length; i++) {
    let v = array[i]
    
    if (v == object) {
      array.splice(i, 1)
      return
    }
    else if (_.isArray(v))
      _.removeDeep(v, object)
  }
}

_.mix = function(...sources) {
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

_.mixIn = function(...sources) {
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

math.lerp = function(a, b, t) {
  return a+(b-a)*t
}

math.unlerp = function(a, b, c) {
  return (c-a)/(b-a)
}

math.truncate = function(number, digits) {
  const c = Math.pow(10, digits)
  return Math.floor(number*c)/c
}