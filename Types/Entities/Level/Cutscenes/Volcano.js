function Volcano(spec) {
  const {
    self,
    graph,
    sledders,
    camera,
    datum,
    isBubbleLevel,
    darkenBufferOrScreen,
    screen,
  } = Cutscene(spec)

  const base = _.mix(self)

  // Same as Constant Lake
  const defaultVectorField =
    '\\frac{(\\sin (x)-(y-2)\\cdot i)\\cdot i}{2}+\\frac{x}{4}+\\frac{y\\cdot i}{5}'

  let lava

  if (!isBubbleLevel) {
    // Create lava
    lava = Water({
      parent: self,
      camera,
      lava: true,
      screen: darkenBufferOrScreen,
      globalScope,
      drawOrder: LAYERS.backSprites,
      ...datum.lava,
    })
  }

  const volcanoSunset = VolcanoSunsetShader({
    parent: self,
    screen,
    drawOrder: LAYERS.sky,
    getSledderPosition,
    defaultExpression: mathquillToMathJS(defaultVectorField),
  })

  function awakeWithAssetsAndDatum() {
    base.awakeWithAssetsAndDatum()

    LavaMonster({
      parent: self,
      screen,
      drawOrder: LAYERS.backSprites - 1,
      camera,
      globalScope,
      getSledderPosition,
    })
  }

  function getSledderPosition() {
    return sledders[0]?.transform.x ?? 0
  }

  function getSledderVelocity() {
    return sledders[0]?.velocity ?? 20
  }

  function tick() {
    base.tick()

    const x = getSledderPosition()
    const sunsetTime = Math.exp(-(((x - 205) / 100) ** 2))

    globalScope.timescale = 1 - sunsetTime * 0.7
    camera.shake = sunsetTime > 0.1 ? sunsetTime * 0.3 : 0

    const vel = getSledderVelocity()
    const motionBlur = Math.min((vel / 40) * 4, 10)
    // console.log(`Volcano Sunset Name:`, volcanoSunset.name)
    // console.log(`Volcano Sky Name:`, sky.name)

    graph.blur = motionBlur
    lava.blur = motionBlur
    volcanoSunset.blur = motionBlur
  }

  return self.mix({
    tick,
    awakeWithAssetsAndDatum,
  })
}
