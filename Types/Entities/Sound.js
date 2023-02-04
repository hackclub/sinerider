function Sound(spec) {
  const { self, assets } = Entity(spec, 'Sound')

  const {
    asset,
    domain = null,
    loop = false,
    duration = null,
    fadeOut = 300,
    volume = 1,
    track = 'walkers',
    level = null,
  } = spec

  const howl = _.get(assets, asset)

  let secondsPlayed = 0
  let played = false

  let soundId

  function awake() {
    if (!domain) {
      soundId = howl.play()
      played = true
    }

    howl.volume(volume)
    howl.loop(loop)
  }

  function tick() {
    if (domain) {
      const x = level?.cutsceneDistanceParameter

      if (!x)
        throw `Expected level to not be null and return a valid distance parameter for Sound domain in tick()`

      // Sounds w/ domains only play once
      if (x > domain[0] && !howl.playing() && !played) {
        played = true
        soundId = howl.play()
      }

      if (domain.length != 2 && domain.length != 4)
        throw `Expected domain in Sound to have 2 (fade in range) or 4 (+ fade out range) elements, got ${domain.length}`

      let volume = math.clamp01(math.unlerp(domain[0], domain[1], x))

      if (domain.length == 4)
        volume *= math.clamp01(math.unlerp(domain[3], domain[2], x))

      howl.volume(volume)
    }

    if (duration) {
      const a =
        1 -
        math.clamp01(
          math.unlerp(duration - fadeOut, duration, secondsPlayed * 1000),
        )
      howl.volume(howl.volume() * a)
    }

    if (howl.playing()) secondsPlayed += 1 / ticksPerSecond
  }

  function onLevelFadeOut(navigating, duration) {
    howl.fade(volume, 0, duration * 1000, soundId)
  }

  function onLevelFadeIn(navigating, duration) {
    howl.fade(0, volume, duration * 1000, soundId)
  }

  function destroy() {
    howl.stop()
  }

  return self.mix({
    awake,
    tick,
    destroy,
    onLevelFadeIn,
    onLevelFadeOut,
    howl,
  })
}
