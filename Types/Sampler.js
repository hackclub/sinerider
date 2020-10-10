// Sampler is a helpful object for sampling functions.
//
// Samplers are basically a wrapper around a compiled math.js expression. Samplers allow you to do extra things that are not built into math.js (For example: sampling a function over a range of values for a given variable)

function Sampler(spec = {}) {
  let {
    expression = '0',
    scope = {},
  } = spec
  
  let evaluator = math.compile(expression)
  
  function evaluate(scope) {
    if (expression == '') return 0
    
    let v = 0

    try {
      v = evaluator.evaluate(scope)
    }
    catch (err) {
      v = 0
    }
    
    return v
  }
  
  function sample() {
    if (arguments.length >= 2) {
      for (let i = 0; i < arguments.length; i += 2) {
        scope[arguments[i]] = arguments[i+1]
      }
    }
    
    return evaluate(scope)
  }
  
  function sampleSlope(variable, value) {
    const epsilon = 0.01
     
    scope[variable] = value
    const sample0 = evaluate(scope)
    
    scope[variable] = value+epsilon
    const sample1 = evaluate(scope)
    
    return (sample1-sample0)/epsilon
  }
  
  function sampleRange(_scope, sampleArray, sampleCount, rangeVariable, range0, range1) {
    _.assign(scope, _scope)
    
    const span = range1-range0
    const step = span/(sampleCount-1)

    scope[rangeVariable] = range0
    
    for (let i = 0; i < sampleCount; i++) {
      let rangeValue = range0+step*i
      scope[rangeVariable] = rangeValue
      
      sampleArray[i][0] = rangeValue
      
      try {
        sampleArray[i][1] = evaluate(scope)
      }
      catch (err) {
        sampleArray[i][1] = 0
      }
    }
  }
  
  function setExpression(_expression) {
    if (expression == _expression) return
    
    expression = _expression
    
    try {
      evaluator = math.compile(expression)
    }
    catch (err) {
      evaluator = math.compile('0')
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
    
    get expression() {
      return expression
    },
    set expression(v) {
      setExpression(v)
    },
  }
}