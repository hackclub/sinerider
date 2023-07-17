function ConstantLake(spec) {
  const vectorFieldStartX = 13.5
  const vectorFieldEndX = 17.5
  const defaultVectorField =
    '\\frac{(\\sin (x)-(y-2)\\cdot i)\\cdot i}{2}+\\frac{x}{4}+\\frac{y\\cdot i}{5}'

  const { datum, quads, savedLatex } = spec

  const { screen, self, assets, ui, world, walkers } = Cutscene({
    ...spec,
    useDarkenBuffer: true,
    startingExpression: datum.defaultExpression,
  })

  const base = _.mix(self)

  const startingVectorFieldExpression = savedLatex ?? defaultVectorField

  let vectorExpression = startingVectorFieldExpression
  let vectorEditorIsActive = false

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

  const shader = ConstantLakeShader({
    parent: self,
    screen,
    assets,
    quad: quads.sunset,
    drawOrder: LAYERS.sky,
    getWalkerPosition,
  })

  // Hide math editor (temporarily) in constructor to fix jitter
  ui.expressionEnvelope.setAttribute('hide', true)

  function getWalkerPosition() {
    return walkers[0]?.transform.x ?? 0
  }

  function setWalkerPosition(x) {
    if (walkers[0]) walkers[0].transform.x = x
  }

  function awakeWithAssetsAndDatum() {
    base.awakeWithAssetsAndDatum()

    if (savedLatex) {
      // Bit before end of level but when stars are fully visible
      setWalkerPosition(23)
    }

    // TODO: Rework running, starting/stopping (should be managed by Level?)
    world._startRunning(false, false, false)

    // Hide math field by default
    ui.expressionEnvelope.classList.add('hidden')

    ui.stopButton.classList.add('disabled')
  }

  function shouldShowSkipCutsceneButton() {
    return !savedLatex && getWalkerPosition() < 6
  }

  function getDefaultExpression() {
    // Restart w/ default vector field expression rather than graph
    return defaultVectorField
  }

  function setGraphExpression(text, latex) {
    vectorExpression = latex

    // Update math editor
    ui.mathFieldStatic.latex(latex)

    // Save new vector field to URL + LocalStorage
    self.save()

    // Update background shader
    shader.setVectorFieldExpression(text)
  }

  function getTime() {
    return getWalkerPosition()
  }

  function updateMathEditor(x) {
    if (x > vectorFieldEndX && !vectorEditorIsActive) {
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
    } else if (x < vectorFieldStartX && vectorEditorIsActive) {
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

    const x = getWalkerPosition()

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
    awakeWithAssetsAndDatum,
    setGraphExpression,

    getDefaultExpression,
    getTime,

    initMathEditor,

    serialize,

    shouldShowSkipCutsceneButton,

    awakeWithAssetsAndDatum,

    // Used by Walkers
    get darkenable() {
      // Use getter so constant
      return true
    },
  })
}
