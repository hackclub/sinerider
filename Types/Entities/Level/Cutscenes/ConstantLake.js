function ConstantLake(spec) {
  const VECTOR_FIELD_START_X = 13.5
  const VECTOR_FIELD_END_X = 17.5
  const DEFAULT_VECTOR_FIELD =
    '\\frac{(\\sin (x)-(y-2)\\cdot i)\\cdot i}{2}+\\frac{x}{4}+\\frac{y\\cdot i}{5}'

  const { datum, quads, savedLatex } = spec

  const { screen, self, assets, ui, world, walkers } = Cutscene({
    ...spec,
    useDarkenBuffer: true,
    startingExpression: datum.defaultExpression,
  })

  const base = _.mix(self)

  const startingVectorFieldExpression = savedLatex ?? DEFAULT_VECTOR_FIELD

  let vectorExpression = startingVectorFieldExpression
  let vectorEditorIsActive = false

  const walker = walkers[0]

  ConstantLakeShader({
    parent: self,
    screen,
    assets,
    quad: quads.sunset,
    drawOrder: LAYERS.sky,
    walkerPosition: walker.transform.position,
  })

  const showUIAnimation = {
    keyframes: [
      { transform: 'translateY(calc(100% + 20px))', opacity: '0' },
      { transform: 'translateY(0px)', opacity: '1' },
      // { opacity: '0' },
      // { opacity: '1' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
      fill: 'forwards',
    },
  }

  const hideUIAnimation = {
    keyframes: [
      { transform: 'translateY(0px)', opacity: '1' },
      { transform: 'translateY(calc(100% + 20px))', opacity: '0' },
    ],
    options: {
      duration: 1700,
      easing: 'ease-out',
    },
  }

  function shouldShowSkipCutsceneButton() {
    return walker.transform.x < 6
  }

  function getDefaultExpression() {
    // Restart w/ default vector field expression rather than graph
    return DEFAULT_VECTOR_FIELD
  }

  function setGraphExpression(text, latex) {
    vectorExpression = latex

    // Update math editor
    ui.mathFieldStatic.latex(latex)

    // Save new vector field to URL + LocalStorage
    self.save()

    // Update background shader
    quads.sunset.setVectorFieldExpression(text)
  }

  function getTime() {
    return walker.transform.x
  }

  function updateMathEditor(x) {
    if (x > VECTOR_FIELD_END_X && !vectorEditorIsActive) {
      // If walker is past a certain point and vector editor
      // hasn't been shown yet, show editor
      vectorEditorIsActive = true

      ui.resetButton.setAttribute('hide', false)
      ui.expressionEnvelope.classList.remove('hidden')

      ui.expressionEnvelope.animate(
        showUIAnimation.keyframes,
        showUIAnimation.options,
      )
      ui.resetButton.animate(showUIAnimation.keyframes, showUIAnimation.options)
    } else if (x < VECTOR_FIELD_START_X && vectorEditorIsActive) {
      // Otherwise, if walker is behind a different point and vector
      // editor is currently shown, hide editor
      vectorEditorIsActive = false

      const resetButtonAnimation = ui.resetButton.animate(
        hideUIAnimation.keyframes,
        hideUIAnimation.options,
      )
      const expressionEnvelopeAnimation = ui.expressionEnvelope.animate(
        hideUIAnimation.keyframes,
        hideUIAnimation.options,
      )

      resetButtonAnimation.onfinish = () =>
        ui.resetButton.setAttribute('hide', true)
      expressionEnvelopeAnimation.onfinish = () =>
        ui.expressionEnvelope.classList.add('hidden')
    }
  }

  function tick() {
    base.tick()

    const x = walker.transform.x

    updateMathEditor(x)

    /* Darken scene according to player distance */
    const darkenOpacity = Math.min(0.9, Math.pow(Math.max(0, x) / 20, 2))
    self.darkenBuffer.parameters.darkenOpacity = darkenOpacity

    // const walkerDarkenOpacity = Math.pow(darkenOpacity, 5)

    // for (const walker of walkers) {
    //   walker.darkModeOpacity = walkerDarkenOpacity

    //   for (const w of walker.walkers) {
    //     if (w.hasDarkMode) w.darkModeOpacity = walkerDarkenOpacity
    //   }
    // }
  }

  function awake() {
    base.awake()

    if (savedLatex) {
      // Bit before end of level but when stars are fully visible
      walker.transform.x = 23
    }

    // TODO: Rework running, starting/stopping (should be managed by Level?)
    world._startRunning(false, false, false)

    // Hide math field by default
    ui.expressionEnvelope.classList.add('hidden')

    ui.stopButton.classList.add('disabled')
  }

  function initMathEditor() {
    // Enable math editor
    ui.expressionEnvelope.setAttribute('disabled', false)

    // But change it to be for a vector field (V)
    // and use different default expression
    ui.mathFieldLabel.innerText = 'V='

    ui.mathField.latex(startingVectorFieldExpression)
    ui.mathFieldStatic.latex(startingVectorFieldExpression)
  }

  function serialize() {
    return {
      // Version, nick, completed, etc.
      ...base.serialize(),

      savedLatex: vectorExpression,
    }
  }

  return self.mix({
    tick,
    awake,
    setGraphExpression,

    getDefaultExpression,
    getTime,

    getDefaultExpression,
    initMathEditor,

    serialize,

    shouldShowSkipCutsceneButton,

    // Used by Walkers
    get darkenable() {
      // Use getter so constant
      return true
    },
  })
}
