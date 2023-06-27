function Volcano(spec) {
  const { self, sky, graph, lava, sledders } = Cutscene(spec)

  const base = _.mix(self)

  // Initially inactive, becomes active through specified
  // transition; the x of which is then used to drive the scene
  const sledder = sledders[0]

  if (!sledder) {
    throw `Expected sledder for Volcano level`
  }

  const volcanoSunset = VolcanoSunsetShader({
    parent: self,
    screen,
    quad: quads.volcanoSunset,
    drawOrder: LAYERS.sky,
  })

  LavaMonster({
    parent: self,
    sledder,
    screen,
    drawOrder: LAYERS.backSprites - 1,
    camera,
    globalScope,
  })

  function tick() {
    base.tick()

    const x = sledder.transform.x
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
