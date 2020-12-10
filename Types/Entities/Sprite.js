function Sprite(spec = {}) {
  const {
    self,
    screen,
    camera,
    assets,
  } = Entity(spec, 'Sprite')
  
  const transform = Transform(spec, self)
  
  let {
    asset,
    image,
    graph,
    size = 1,
    globalScope,
    anchored = false,
    sloped = false,
    offset = Vector2(),
    speech,
  } = spec
  
  const origin = Vector2(spec)
  
  if (!spec.offset && anchored)
    offset.y = 1
    
  if (!spec.offset && spec.y && anchored)
    offset.y += spec.y
  
  const ctx = screen.ctx
  
  const slopeTangent = Vector2()
  
  if (asset) {
    image = _.get(assets, asset, $('#error-sprite'))
  }
  
  if (speech) {
    if (!_.isArray(speech))
      speech = [speech]
      
    for (s of speech) {
      if (_.isString(s))
        s = {content: s}
        
      Speech({
        parent: self,
        globalScope,
        x: size*offset.x,
        y: size*offset.y,
        ...s,
      })
    }
  }
  
  function tick() {
    if (anchored) {
      transform.x = origin.x
      transform.y = graph.sample('x', transform.x)
    }
    
    if (sloped) {
      slopeTangent.x = 1
      slopeTangent.y = graph.sampleSlope('x', transform.x)
      slopeTangent.normalize()
      
      let angle = Math.asin(slopeTangent.y)
      transform.rotation = angle
    }
  }
  
  function drawLocal() {
    ctx.drawImage(image, -size/2+offset.x*size/2, -size/2-offset.y*size/2, size, size)
  }
  
  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
  }
  
  return self.mix({
    transform,

    tick,
    draw,
  })
}