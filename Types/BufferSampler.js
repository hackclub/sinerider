/*
  Manages a buffer which can be refreshed and 
  then sampled from via linear interpolation
*/
function BufferSampler(sampler, sampleCount) {
  const self = {}

  const samples = sampler.generateSampleArray(sampleCount)

  let minX, maxX, sampleWidth
  let min = Infinity,
    max = -Infinity

  let scope = {}

  function refreshSamples(_minX, _maxX, ...params) {
    minX = _minX
    maxX = _maxX

    sampleWidth = (maxX - minX) / (sampleCount - 1)

    // Assign extra parameters, if given
    for (let i = 0; i < params.length; i += 2) {
      scope[params[i]] = params[i + 1]
    }

    for (let i = 0; i < sampleCount; i++) {
      const x = minX + sampleWidth * i

      let y
      try {
        scope['x'] = x
        y = sampler._evaluate(scope)
      } catch (err) {
        y = 0
      }

      if (y < min) min = y
      if (y > max) max = y

      samples[i].set(x, y)
    }
  }

  function sample(x) {
    if (x < minX + 1e-6) {
      const a = samples[0][1]
      const b = samples[1][1]
      return a + ((b - a) / sampleWidth) * (x - minX)
    }

    if (x > maxX - 1e-6) {
      const a = samples[sampleCount - 2][1]
      const b = samples[sampleCount - 1][1]
      return b + ((b - a) / sampleWidth) * (x - maxX)
    }

    const i = (x - minX) / sampleWidth
    const leftI = Math.floor(i)
    const rightI = Math.ceil(i)
    const a = samples[leftI][1]
    const b = samples[rightI][1]
    const leftX = minX + leftI * sampleWidth
    return a + ((b - a) / sampleWidth) * (x - leftX)
  }

  return _.mix(self, {
    samples,
    refreshSamples,
    sample,

    get min() {
      return min
    },
    get max() {
      return max
    },
  })
}
