/*
  Wraps two BufferSamplers representing a graph at
  two points in time, and samples between them
*/
function InterFrameSampler(spec) {
  const self = {}

  const {
    sampler,
    sampleCount,
    refreshPeriodT = 10,
    samplePadding = 10,
    useQuadraticInterpolation = true,
  } = spec

  let sampleTimeA
  const samplesA = BufferSampler(sampler, sampleCount)

  let sampleTimeB
  const samplesB = BufferSampler(sampler, sampleCount)

  let sampleTimeC, samplesC

  if (useQuadraticInterpolation) {
    samplesC = BufferSampler(sampler, sampleCount)
  }

  let min = Infinity,
    max = -Infinity
  let minX, maxX

  // TODO: Clean up and optimize
  function secondOrderInterp(x0, x1, x2, y0, y1, y2, x) {
    const a0 =
      ((x1 * x2) / ((x2 - x0) * (x1 - x0))) * y0 +
      ((-x0 * x2) / ((x1 - x0) * (x2 - x1))) * y1 +
      ((x0 * x1) / ((x2 - x0) * (x2 - x1))) * y2
    const a1 =
      (-(x2 + x1) / ((x2 - x0) * (x1 - x0))) * y0 +
      ((x2 + x0) / ((x1 - x0) * (x2 - x1))) * y1 +
      (-(x1 + x0) / ((x2 - x0) * (x2 - x1))) * y2
    const a2 =
      (1 / ((x2 - x0) * (x1 - x0))) * y0 +
      (-1 / ((x1 - x0) * (x2 - x1))) * y1 +
      (1 / ((x2 - x0) * (x2 - x1))) * y2
    return a2 * x ** 2 + a1 * x + a0
  }

  function sampleRange(_scope, sampleArray, sampleCount, _minX, _maxX) {
    if (!_.has(_scope, 't')) {
      throw `Expected time parameter for InterFrameSampler in sampleRange()`
    }

    let t = _scope['t']
    let deltaT = t - sampleTimeA

    if (
      deltaT >= refreshPeriodT ||
      _maxX > maxX + samplePadding / 2 ||
      _minX < minX - samplePadding / 2
    ) {
      refresh(_minX, _maxX, t)
      deltaT = 0
    }

    const span = _maxX - _minX
    const step = span / (sampleCount - 1)

    for (let i = 0; i < sampleCount; i++) {
      let x = _minX + step * i
      let y
      if (useQuadraticInterpolation) {
        let a = samplesA.sample(x)
        let b = samplesB.sample(x)
        let c = samplesC.sample(x)
        y = secondOrderInterp(0, 0.5, 1, a, b, c, deltaT / refreshPeriodT)
      } else {
        let a = samplesA.sample(x)
        let b = samplesB.sample(x)
        y = a + ((b - a) / (sampleTimeB - sampleTimeA)) * deltaT
      }
      if (y < min) min = y
      if (y > max) max = y
      sampleArray[i].set(x, y)
    }
  }

  function refresh(_minX, _maxX, currentT) {
    minX = _minX
    maxX = _maxX

    let nextT = currentT + refreshPeriodT

    if (useQuadraticInterpolation) {
      sampleTimeA = currentT
      samplesA.refreshSamples(
        minX - samplePadding,
        maxX + samplePadding,
        't',
        sampleTimeA,
      )

      sampleTimeC = nextT
      samplesC.refreshSamples(minX - 10, maxX + 10, 't', sampleTimeC)

      sampleTimeB = sampleTimeA + (nextT - currentT) / 2
      samplesB.refreshSamples(minX - 10, maxX + 10, 't', sampleTimeB)
    } else {
      sampleTimeA = currentT
      samplesA.refreshSamples(
        minX - samplePadding,
        maxX + samplePadding,
        't',
        sampleTimeA,
      )

      sampleTimeB = nextT
      samplesB.refreshSamples(minX - 10, maxX + 10, 't', sampleTimeB)
    }
  }

  function resetExtrema() {
    min = Infinity
    max = -Infinity
  }

  return _.mix(self, {
    refresh,
    sampleRange,
    resetExtrema,

    get min() {
      return min
    },
    get max() {
      return max
    },
  })
}
