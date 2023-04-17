let LOGTESTS = true

function Test(value) {
  const self = {}

  function stringify(v) {
    if (_.isArray(v)) return `[${_.join(_.map(v, stringify), ', ')}]`
    else if (_.isObject(v) && _.has(v, 'toString')) return v.toString()
    else if (_.isObject(v)) return JSON.stringify(v)
    else if (_.isString(v)) return `"${v}"`
    else if (v == null) return 'null'
    else return _.toString(v)
  }

  function assert(boolean, successMessage, failureMessage) {
    if (boolean) {
      // if (LOGTESTS)
    } else throw new Error(failureMessage)
  }

  function isTrue() {
    const successMessage = `As expected, ${stringify(value)} is true`
    const failureMessage = `${stringify(value)} is false`

    assert(value === true, successMessage, failureMessage)
  }

  function isFalse() {
    const successMessage = `As expected, ${stringify(value)} is false`
    const failureMessage = `${stringify(value)} is true`

    assert(value === false, successMessage, failureMessage)
  }

  function equals(other) {
    const successMessage = `As expected, ${stringify(value)} equals ${stringify(
      other,
    )}`
    const failureMessage = `${stringify(value)} does not equal ${stringify(
      other,
    )}`

    if (_.isObject(value)) {
      assert(value.equals(other), successMessage, failureMessage)
    } else {
      assert(value === other, successMessage, failureMessage)
    }
  }

  function notEquals(other) {
    const successMessage = `As expected, ${stringify(
      value,
    )} does not equal ${stringify(other)}`
    const failureMessage = `${stringify(value)} equals ${stringify(other)}`

    if (_.isObject(value)) {
      assert(!value.equals(other), successMessage, failureMessage)
    } else {
      assert(value !== other, successMessage, failureMessage)
    }
  }

  function lessThan(other) {
    const successMessage = `As expected, ${stringify(
      value,
    )} is less than ${stringify(other)}`
    const failureMessage = `${stringify(
      value,
    )} is greater than or equal to ${stringify(other)}`

    assert(value < other, successMessage, failureMessage)
  }

  function greaterThan(other) {
    const successMessage = `As expected, ${stringify(
      value,
    )} is greater than ${stringify(other)}`
    const failureMessage = `${stringify(
      value,
    )} is less than or equal to ${stringify(other)}`

    assert(value > other, successMessage, failureMessage)
  }

  function lessThanOrEquals(other) {
    const successMessage = `As expected, ${stringify(
      value,
    )} is less than or equal to ${stringify(other)}`
    const failureMessage = `${stringify(value)} is greater than ${stringify(
      other,
    )}`

    assert(value <= other, successMessage, failureMessage)
  }

  function greaterThanOrEquals(other) {
    const successMessage = `As expected, ${stringify(
      value,
    )} is greater than or equal to ${stringify(other)}`
    const failureMessage = `${stringify(value)} is less than ${stringify(
      other,
    )}`

    assert(value >= other, successMessage, failureMessage)
  }

  function fails() {
    const successMessage = `As expected, this function throws an error with arguments ${stringify(
      [...arguments],
    )}`
    const failureMessage = `An error was not thrown with arguments ${stringify([
      ...arguments,
    ])}`

    try {
      value.apply(null, arguments)
      assert(false, successMessage, failureMessage)
    } catch (ex) {
      assert(true, successMessage, failureMessage)
    }
  }

  function succeeds() {
    const successMessage = `As expected, this function did not throw an error with arguments ${stringify(
      [...arguments],
    )}`
    const failureMessage = `An error was thrown with arguments ${stringify([
      ...arguments,
    ])}`

    try {
      value.apply(null, arguments)
      assert(true, successMessage, failureMessage)
    } catch (ex) {
      assert(false, successMessage, failureMessage)
    }
  }

  return _.mixIn(self, {
    isTrue,
    isFalse,

    equals,
    notEquals,

    lessThan,
    greaterThan,

    lessThanOrEquals,
    greaterThanOrEquals,

    fails,
    succeeds,
  })
}

// Tests
LOGTESTS = false

;(() => {
  function TestObject(value) {
    function equals(other) {
      return value === other.value
    }

    return {
      equals,

      get value() {
        return value
      },
    }
  }

  // Test booleans

  Test(true).isTrue()
  Test(false).isFalse()

  Test(Test(true).isFalse).fails()
  Test(Test(false).isTrue).fails()

  Test(Test(null).isTrue).fails()
  Test(Test(null).isFalse).fails()

  Test(Test(0).isTrue).fails()
  Test(Test(0).isFalse).fails()

  Test(Test(1).isTrue).fails()
  Test(Test(1).isFalse).fails()

  Test(Test('').isTrue).fails()
  Test(Test('').isFalse).fails()

  // Test boolean equality

  Test(true).equals(true)
  Test(false).equals(false)

  Test(Test(true).equals).fails(false)
  Test(Test(false).equals).fails(true)

  Test(true).notEquals(false)
  Test(false).notEquals(true)

  Test(Test(true).notEquals).fails(true)
  Test(Test(false).notEquals).fails(false)

  Test(true).notEquals(null)
  Test(false).notEquals(null)

  Test(Test(true).equals).fails(false)
  Test(Test(false).equals).fails(true)

  // Test numerical equality

  Test(0).equals(0)
  Test(1).equals(1)

  Test(Test(0).equals).fails(1)
  Test(Test(1).equals).fails(0)

  Test(0).notEquals(1)
  Test(1).notEquals(0)

  Test(Test(0).notEquals).fails(0)
  Test(Test(1).notEquals).fails(1)

  Test(0).notEquals(null)
  Test(1).notEquals(null)

  Test(Test(0).equals).fails(null)
  Test(Test(1).equals).fails(null)

  // Test numerical inequalities

  Test(10).lessThan(11)
  Test(10).greaterThan(9)

  Test(10).lessThanOrEquals(11)
  Test(10).greaterThanOrEquals(9)

  Test(10).lessThanOrEquals(10)
  Test(10).greaterThanOrEquals(10)

  Test(Test(10).greaterThan).fails(11)
  Test(Test(10).lessThan).fails(9)

  Test(Test(10).lessThanOrEquals).fails(9)
  Test(Test(10).greaterThanOrEquals).fails(11)

  Test(Test(10).greaterThan).fails(10)
  Test(Test(10).lessThan).fails(10)

  // Test string equality

  Test('abc').equals('abc')
  Test('abc').notEquals('xyz')

  Test(Test('abc').equals).fails('xyz')
  Test(Test('abc').notEquals).fails('abc')

  // Test object equality

  const a = TestObject('a')
  const b = TestObject('b')

  Test(a).equals(a)
  Test(a).notEquals(b)

  Test(Test(a).equals).fails(b)
  Test(Test(a).notEquals).fails(a)
})()
