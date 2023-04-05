const _math = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  floor: Math.floor,
  abs: Math.abs,
  pow: Math.pow,
  gamma: (() => {
    // Approximation for the Gamma function
    // taken from https://stackoverflow.com/questions/15454183/how-to-make-a-function-that-computes-the-factorial-for-numbers-with-decimals
    var g = 7
    var C = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
    ]

    return (z) => {
      if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * _math.gamma(1 - z))
      else {
        z -= 1

        var x = C[0]
        for (var i = 1; i < g + 2; i++) x += C[i] / (z + i)

        var t = z + g + 0.5
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
      }
    }
  })(),
  factorial: (n) => {
    const g = _math.gamma(n + 1)
    return Math.abs(g - Math.round(g)) < 1e-6 ? Math.round(g) : g
  },
}

function isComplex(x) {
  return x.hasOwnProperty('re') && x.hasOwnProperty('im')
}

function complexPow(base, x) {
  if (typeof base == 'number') {
    if (typeof x == 'number') {
      return base ** x
    }
    if (isComplex(x)) {
      return complexExp(x.mult(Math.log(base)))
    }
  }

  if (isComplex(base)) {
  }
}

function complexExp(x) {
  if (typeof x == 'number') {
    return Math.exp(x)
  }

  if (isComplex(x)) {
    let re = x.re
    let im = x.im

    let left = Math.exp(re)
    let right = Complex(Math.cos(im), Math.sin(im))

    return Complex(left, 0).mult(right)
  }

  throw Error('Expected real or complex number for complexExp')
}

function Complex(re, im) {
  function add(o) {
    if (typeof o == 'number') o = Complex(o, 0)
    return Complex(re + o.re, im + o.im)
  }

  function minus(o) {
    if (typeof o == 'number') o = Complex(o, 0)
    return Complex(re - o.re, im - o.im)
  }

  function mult(o) {
    if (typeof o == 'number') o = Complex(o, 0)
    // (a + bi)(c + di);
    // a * c + c * bi + a * di - b * d(a * c - b * d) + (c * b + a * d);

    return Complex(re * o.re - im * o.im, re * o.im + im * o.re)
  }

  function exp(o) {
    let r = Math.sqrt(o.re * o.re + o.im * o.im)
    let phi = Math.atan(im / re)
    let left = Math.exp(o.re * Math.log(r) - o.im * phi)
    let right = complexExp(Complex(0, o.im * Math.log(r) + o.re * phi))
    return right.mult(left)
  }

  return {
    add,
    minus,
    mult,
    exp,

    re,
    im,
  }
}

function MathParser() {
  const prefixOperators = ['-', '+', 'sin', 'cos', 'tan', 'floor', 'abs']

  const postfixOperators = ['!']

  const infixBindingPower = {
    '^': [5, 6],
    '*': [4, 3],
    '/': [4, 3],
    '+': [2, 1],
    '-': [2, 1],
  }

  const prefixBindingPower = {
    '+': 5,
    '-': 5,
  }

  const operators = Object.keys(infixBindingPower)

  const tokenizer = new RegExp(
    [
      // Numbers
      '(?:\\.\\d+|\\d+\\.?)\\d*',

      // Prefix operators
      prefixOperators.map((op) => (op.length == 1 ? `\\${op}` : op)).join('|'),

      // Infix operators
      '[' +
        Object.keys(infixBindingPower)
          .map((ch) => `\\${ch}`)
          .join('') +
        ']',

      // Parens
      '\\(|\\)',

      // Postfix
      '[' + postfixOperators.map((ch) => `\\${ch}`).join('') + ']',

      // Parameters/constants
      '\\w+',
    ]
      .map((regex) => `(${regex})`)
      .join('|'),
    'g',
  )

  // const tokenizer = new RegExp(
  //   `((?:(?:\\.\\d|\\d\\.?)\\d*)|[${infixBindingPower
  //     .map((ch) => `\\${ch}`)
  //     .join("")}]|\\w+|\\(|\\))`,
  //   "g"
  // );

  function exprBp(tokens, minBp) {
    let lhs = tokens.pop()

    if (lhs == '(') {
      lhs = exprBp(tokens, 0)
      if (tokens.pop() != ')') {
        throw Error("Expected closing paren ')'")
      }
    }

    if (prefixOperators.includes(lhs)) {
      let rBp = prefixBindingPower[lhs] ?? 0
      let rhs = exprBp(tokens, rBp)
      lhs = [lhs, [rhs]]
    }

    while (true) {
      if (tokens.length == 0) {
        break
      }

      let op = tokens[tokens.length - 1]

      if (postfixOperators.includes(op)) {
        tokens.pop()
        lhs = [op, [lhs]]
        continue
      }

      if (infixBindingPower.hasOwnProperty(op)) {
        let [leftBp, rightBp] = infixBindingPower[op]

        if (leftBp < minBp) {
          break
        }

        tokens.pop()
        let rhs = exprBp(tokens, rightBp)

        lhs = [op, [lhs, rhs]]
        continue
      }

      break
    }

    return lhs
  }

  function tokenize(input) {
    return input.match(tokenizer).reverse()
  }

  function expr(input) {
    const tokens = tokenize(input)
    return exprBp(tokens, 0)
  }

  function displayExpr(input) {
    if (Array.isArray(input)) {
      return `(${input[0]} ${input[1].map(displayExpr).join(' ')})`
    } else {
      return input
    }
  }

  const functionToJavascript = {
    '+': '+',
    '-': '-',
    '!': '_math.factorial',
    '^': '_math.pow',
    sin: '_math.sin',
    cos: '_math.cos',
    tan: '_math.tan',
    floor: '_math.floor',
    abs: '_math.abs',
  }

  const functions = {
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '^': (x, y) => Math.pow(x, y),
    '!': _math.factorial,
    sin: _math.sin,
    cos: _math.cos,
    tan: _math.tan,
    floor: _math.floor,
    abs: _math.abs,
  }

  const constants = {
    e: Math.E,
    i: Complex(0, 1),
  }

  let usesT = false

  function genCode(expr) {
    if (Array.isArray(expr)) {
      const [fn, args] = expr
      if (args.length == 1) {
        return `${functionToJavascript[fn]}(${genCode(args[0])})`
      }
      if ('+-*/'.includes(fn)) {
        return `(${genCode(args[0])})${fn}(${genCode(args[1])})`
      }
      return `${functionToJavascript[fn]}(${args
        .map((arg) => genCode(arg))
        .join(',')})`
    }
    if (expr == 't') usesT = true
    if (constants.hasOwnProperty(expr)) {
      return constants[expr]
    }
    return expr
  }

  // 2 / (1 + _math.pow(2.718281828459045, -(x + 5)))

  function evaluate(expr, scope) {
    if (Array.isArray(expr)) {
      const [fnName, args] = expr
      const fn = functions[fnName]
      return fn.apply(
        null,
        args.map((arg) => evaluate(arg, scope)),
      )
    }

    if (scope.hasOwnProperty(expr)) {
      return scope[expr]
    }

    return Number(expr)
  }

  function compile(input) {
    usesT = false
    let ast = expr(input)
    let body = genCode(ast)
    let evaluator = new Function('x', 't', `return ${body}`)
    return evaluator
  }

  return {
    get lastParsedExpressionUsesT() {
      return usesT
    },
    displayExpr,
    compile,
    evaluate,
    expr,
  }

  // let s = expr("-1 * -sin(2 + 3)");
  // let s = expr("sin(x)!+2*2.38/10.28!");
  // let s = expr("sin(y * abs(x*2))");
  // console.log(displayExpr(s));
  // console.log(JSON.stringify(s));

  // let body = genCode(s);

  // console.log(body);

  // let evaluator = new Function("x", "t", `return ${body}`);
}
