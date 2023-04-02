/*
  Wraps two BufferSamplers representing a graph at
  two points in time, and samples between them
*/
function InterFrameSampler(spec) {
  const self = {}

  const { sampler, sampleCount, refreshPeriodT = 10, samplePadding = 10 } = spec

  let sampleTimeA
  const samplesA = BufferSampler(sampler, sampleCount)

  let sampleTimeB
  const samplesB = BufferSampler(sampler, sampleCount)

  let min = Infinity,
    max = -Infinity
  let minX, maxX

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
      let a = samplesA.sample(x)
      let b = samplesB.sample(x)
      let y = a + ((b - a) / (sampleTimeB - sampleTimeA)) * deltaT
      if (y < min) min = y
      if (y > max) max = y
      sampleArray[i].set(x, y)
    }
  }

  function refresh(_minX, _maxX, currentT) {
    minX = _minX
    maxX = _maxX

    sampleTimeA = currentT
    samplesA.refreshSamples(
      minX - samplePadding,
      maxX + samplePadding,
      't',
      sampleTimeA,
    )

    sampleTimeB = currentT + refreshPeriodT
    samplesB.refreshSamples(minX - 10, maxX + 10, 't', sampleTimeB)
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
