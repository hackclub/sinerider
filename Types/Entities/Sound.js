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
    fadeOnNavigating = true,
  } = spec

  const howl = _.get(assets, asset)

  let secondsPlayed = 0
  let played = false

  let soundId

  let fadeDestroyProgress = 0
  let fadeDestroyDuration = 0

  function awake() {
    if (!domain) {
      soundId = howl.play()
      played = true
    }

    howl.volume(volume)
    howl.loop(loop)
  }

  function tick() {
    let vol = volume

    if (domain) {
      const x = level?.cutsceneDistanceParameter

      // Sounds w/ domains only play once
      if (x > domain[0] && !howl.playing() && !played) {
        played = true
        soundId = howl.play()
      }

      if (domain.length != 2 && domain.length != 4)
        throw `Expected domain in Sound to have 2 (fade in range) or 4 (+ fade out range) elements, got ${domain.length}`

      vol = math.clamp01(math.unlerp(domain[0], domain[1], x))

      if (domain.length == 4) {
        if (self.debug)
          console.log(
            `${self.name} distance parameter: ${level.cutsceneDistanceParameter} volume: ${volume}`,
          )
        vol *= math.clamp01(math.unlerp(domain[3], domain[2], x))
      }
    }

    if (duration) {
      const a =
        1 -
        math.clamp01(
          math.unlerp(duration - fadeOut, duration, secondsPlayed * 1000),
        )
      vol *= a
    }

    if (howl.playing()) secondsPlayed += 1 / ticksPerSecond

    if (fadeDestroyDuration) {
      fadeDestroyProgress += tickDelta / fadeDestroyDuration
      vol *= 1 - fadeDestroyProgress
      if (fadeDestroyProgress >= 1) self.destroy()
    }

    howl.volume(vol)
  }

  function fadeDestroy(duration = 1) {
    fadeDestroyDuration = duration
  }

  function onLevelFadeOut(navigating, duration) {
    if (fadeOnNavigating) howl.fade(volume, 0, duration * 1000, soundId)
  }

  function onLevelFadeIn(navigating, duration) {
    if (fadeOnNavigating) howl.fade(0, volume, duration * 1000, soundId)
  }

  function destroy() {
    howl.stop()
  }

  return self.mix({
    awake,
    tick,
    destroy,
    fadeDestroy,
    onLevelFadeIn,
    onLevelFadeOut,
    howl,
  })
}
