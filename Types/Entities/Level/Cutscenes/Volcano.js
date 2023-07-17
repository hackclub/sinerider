function Volcano(spec) {
  const { self, sky, graph, lava, sledders, camera } = Cutscene(spec)

  const base = _.mix(self)

  // Same as Constant Lake
  const defaultVectorField =
    '\\frac{(\\sin (x)-(y-2)\\cdot i)\\cdot i}{2}+\\frac{x}{4}+\\frac{y\\cdot i}{5}'

  const volcanoSunset = VolcanoSunsetShader({
    parent: self,
    screen,
    drawOrder: LAYERS.sky,
    getSledderPosition,
    defaultExpression: mathquillToMathJS(defaultVectorField),
  })

  LavaMonster({
    parent: self,
    screen,
    drawOrder: LAYERS.backSprites - 1,
    camera,
    globalScope,
    getSledderPosition,
  })

  function getSledderPosition() {
    return sledders[0]?.transform.x ?? 0
  }

  function tick() {
    base.tick()

    const x = getSledderPosition()
    const sunsetTime = Math.exp(-(((x - 205) / 100) ** 2))

    globalScope.timescale = 1 - sunsetTime * 0.7
    camera.shake = sunsetTime > 0.1 ? sunsetTime * 0.3 : 0

    const vel = sledder.velocity ?? 20
    const motionBlur = Math.min((vel / 40) * 4, 10)

    volcanoSunset.blur = motionBlur
    sky.blur = motionBlur
    graph.blur = motionBlur
    lava.blur = motionBlur
  }

  return _.mix(self, {
    tick,
  })
}
