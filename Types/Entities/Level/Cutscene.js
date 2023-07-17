// TODO: Maybe Cutscene isn't a useful abstraction? (Not worth minor code reuse)
function Cutscene(spec) {
  const { self, ui, levelCompleted, datum, sledders, walkers } = Level(spec)

  const {
    // Special property for cutscenes
    victoryX,
  } = datum

  const base = _.mix(self)

  const showSkipCutsceneButtonAnimation = {
    keyframes: [
      { transform: 'translateX(calc(-100% - 20px))' },
      { transform: 'translateX(0px)' },
      // { opacity: '0' },
      // { opacity: '1' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
      fill: 'forwards',
    },
  }

  const hideSkipCutsceneButtonAnimation = {
    keyframes: [
      { transform: 'translateX(0px)' },
      { transform: 'translateX(calc(-100% - 20px))' },
      // { opacity: '0' },
      // { opacity: '1' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
    },
  }

  let showingSkipCutsceneButton = false

  function initMathEditor() {
    /* Hide math editor by default */
    ui.expressionEnvelope.classList.add('hidden')
    ui.expressionEnvelope.setAttribute('disabled', true)
  }

  function destroy() {
    base.destroy()

    // TODO: Refactor running
    world._stopRunning()

    // Hide "Skip Cutscene" button
    ui.skipCutsceneButton.setAttribute('hide', true)
  }

  function awake() {
    base.awake()

    ui.skipCutsceneButton.addEventListener('click', levelCompleted)

    // All cutscenes are "running" by default, and can't be stopped.
    // TODO: Refactor how running works
    world._startRunning(false, false)

    // Disable stop button for cutscenes
    // TODO: Refactor how starting/stopping work
    ui.stopButton.classList.add('disabled')
  }

  function shouldShowSkipCutsceneButton() {
    return globalScope.t < 10
  }

  function getCutsceneX() {
    return (
      (
        sledders.find((sledder) => sledder.active) ??
        walkers.find((walker) => walker.active)
      )?.transform.x ?? -Infinity
    )
  }

  function getTime() {
    return self.getCutsceneX()
  }

  function tick() {
    base.tick()

    // if (victoryX != null && self.getCutsceneX() > victoryX) {
    //   completed = true
    //   levelCompleted(true)
    // }

    if (self.shouldShowSkipCutsceneButton() && !showingSkipCutsceneButton) {
      showingSkipCutsceneButton = true

      ui.skipCutsceneButton.setAttribute('hide', false)

      ui.skipCutsceneButton.animate(
        showSkipCutsceneButtonAnimation.keyframes,
        showSkipCutsceneButtonAnimation.options,
      )
    } else if (
      !self.shouldShowSkipCutsceneButton() &&
      showingSkipCutsceneButton
    ) {
      showingSkipCutsceneButton = false

      const hideAnimation = ui.skipCutsceneButton.animate(
        hideSkipCutsceneButtonAnimation.keyframes,
        hideSkipCutsceneButtonAnimation.options,
      )

      hideAnimation.onfinish = () =>
        ui.skipCutsceneButton.setAttribute('hide', true)
    }
  }

  function skipCutscene() {
    levelCompleted()
  }

  function onLevelFadeOut() {
    ui.skipCutsceneButton.setAttribute('hide', true)
  }

  function onLevelFadeIn() {
    ui.skipCutsceneButton.setAttribute('hide', !showingSkipCutsceneButton)
  }

  return self.mix({
    awake,
    destroy,
    tick,

    getCutsceneX,
    getTime,

    get isCutscene() {
      // Overriding falsy (null) by default in Level.js
      return true
    },

    onLevelFadeIn,
    onLevelFadeOut,

    initMathEditor,
    skipCutscene,

    shouldShowSkipCutsceneButton,
  })
}
