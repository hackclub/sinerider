// Sampler is a helpful object for sampling functions.
//
// Samplers are basically a wrapper around a compiled math.js expression. Samplers allow you to do extra things that are not built into math.js (For example: sampling a function over a range of values for a given variable)

function Sampler(spec = {}) {
  let {
    scope = {},
    defaultToLastValidExpression = true,
    allowInfinity = false,
  } = spec

  let expression
  let lastValidExpression = '0'

  let evaluator
  let lastValidEvaluator = math.compile(lastValidExpression)

  let min = PINF
  let max = NINF

  let valid = false

  setExpression(spec.expression || '0')

  // let buckets = new Float32Array(5000)

  // function getBucket(x) {
  //   return buckets[parseInt(x/5)]
  // }

  function decomment(expression) {
    return expression.split('//')[0]
  }

  function resetExtrema() {
    min = PINF
    max = NINF
  }

  function evaluate(scope) {
    if (expression == '') return 0

    let e = defaultToLastValidExpression ? lastValidEvaluator : evaluator
    let v = 0

    try {
      v = e.evaluate(scope)

      if (!allowInfinity) {
        if (v == PINF || v == NINF) v = 0

        if (v.re == PINF || v.re == NINF) v.re = 0

        if (v.im == PINF || v.im == NINF) v.im = 0
      }

      if (_.isObject(v)) v = v.re || 0
      else if (!_.isNumber(v)) v = 0
      else if (_.isNaN(v)) v = 0
    } catch (err) {
      v = 0
    }

    if (v < min) min = v
    if (v > max) max = v

    return v
  }

  function sample() {
    // Assign variable/value pairs
    if (arguments.length >= 2) {
      for (let i = 0; i < arguments.length; i += 2) {
        scope[arguments[i]] = arguments[i + 1]
      }
    }

    return evaluate(scope)
  }

  function sampleSlope(variable, value) {
    // Assign variable/value pairs *except* first pair
    if (arguments.length >= 3) {
      for (let i = 2; i < arguments.length; i += 2) {
        scope[arguments[i]] = arguments[i + 1]
      }
    }

    const epsilon = 0.01

    scope[variable] = value
    const sample0 = evaluate(scope)

    scope[variable] = value + epsilon
    const sample1 = evaluate(scope)

    return (sample1 - sample0) / epsilon
  }

  function sampleRange(
    _scope,
    sampleArray,
    sampleCount,
    rangeVariable,
    range0,
    range1,
  ) {
    _.assign(scope, _scope)

    const span = range1 - range0
    const step = span / (sampleCount - 1)

    scope[rangeVariable] = range0

    for (let i = 0; i < sampleCount; i++) {
      let rangeValue = range0 + step * i
      scope[rangeVariable] = rangeValue

      sampleArray[i][0] = rangeValue

      try {
        sampleArray[i][1] = evaluate(scope)
      } catch (err) {
        sampleArray[i][1] = 0
      }
    }
  }

  function setExpression(_expression) {
    if (expression == _expression) return

    expression = _expression

    try {
      evaluator = math.compile(decomment(expression))
      lastValidExpression = expression
      lastValidEvaluator = evaluator
      valid = true
    } catch (err) {
      evaluator = math.compile('0')
      valid = false
    }
  }

  function generateSampleArray(pointCount) {
    return _.map(Array(pointCount), () => Vector2(0, 0))
  }

  return {
    sample,
    sampleRange,
    sampleSlope,

    generateSampleArray,

    resetExtrema,

    setExpression,

    get expression() {
      return expression
    },
    set expression(v) {
      setExpression(v)
    },

    get max() {
      return max
    },
    get min() {
      return min
    },

    get valid() {
      return valid
    },
  }
}
