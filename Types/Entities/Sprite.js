function Sprite(spec = {}) {
  const { self, screen, camera, assets } = Entity(spec, 'Sprite')

  const transform = Transform(spec, self)

  let {
    asset,
    image,
    graph,
    flipX = false,
    flipY = false,
    globalScope,
    anchored = false,
    sloped = false,
    offset = Vector2(),
    opacity = 1,
    speech,
    fixed = false,
    speechScreen,
    size,
    world,
    sky = null,
    rotatingSpeed = 0,
  } = spec

  const origin = Vector2(spec)

  const pos = Vector2()
  const sizer = Vector2()

  if (spec.offset) offset = Vector2(spec.offset)

  if (flipX == '*') flipX = Math.random() < 0.5
  if (flipY == '*') flipY = Math.random() < 0.5
  if (!spec.offset && anchored) offset.y = 1

  if (!spec.offset && spec.y && anchored) offset.y += spec.y

  const ctx = screen.ctx

  const slopeTangent = Vector2()

  if (asset) {
    if (asset.includes('*')) {
      const assetSearch = new RegExp(
        `${asset.split('.')[1]?.split('*')[0]}_[0-9]+`,
      )
      let possibleSprites = Object.keys(assets.images).filter((v) =>
        assetSearch.test(v),
      )
      asset =
        'images.' +
        possibleSprites[Math.floor(Math.random() * possibleSprites.length)]
    }
    image = _.get(assets, asset, $('#error-sprite'))
  }
  if (speech) {
    if (!_.isArray(speech)) speech = [speech]

    for (s of speech) {
      if (_.isString(s)) s = { content: s }

      Speech({
        parent: self,
        globalScope,
        x: size * offset.x,
        y: size * offset.y,
        drawOrder: LAYERS.speech,
        screen: speechScreen,
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
    if (rotatingSpeed !=0){
      transform.rotation += tickDelta*rotatingSpeed
    }
  }

  function drawLocal() {
    ctx.globalAlpha = opacity
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)
    ctx.drawImage(
      image,
      -size / 2 + (offset.x * size) / 2,
      -size / 2 - (offset.y * size) / 2,
      size,
      size,
    )
    ctx.globalAlpha = 1
  }

  function draw() {
    // If it is part of the background, it is transformed
    if (fixed) {
      if (sky.height / sky.width >= screen.height / screen.width) {
        let adjustmentY = (screen.width * sky.height) / sky.width
        pos.set(spec.x*screen.width, spec.y*(adjustmentY) + (screen.height - adjustmentY)/2)
        sizer.set(screen.width/sky.width, screen.width/sky.width)
      } else {
        let adjustmentX = (screen.height * sky.width) / sky.height
        pos.set(spec.x*(adjustmentX)+(screen.width-adjustmentX)/2, spec.y*screen.height)
        sizer.set(screen.height/sky.height, screen.height/sky.height)
      }

      // Also it needs to be rotated differently
      ctx.save()
      ctx.translate(pos.x+size*sizer[0]/2, pos.y+size*sizer[0]/2)
      ctx.rotate(transform.rotation)
      screen.ctx.drawImage(image, -size*sizer[0]/2, -size*sizer[1]/2, size*sizer[0], size*sizer[1])
      ctx.restore()
    }
    else{
    camera.drawThrough(ctx, drawLocal, transform)}
  }

  return self.mix({
    transform,

    get opacity() {
      return opacity
    },
    set opacity(o) {
      opacity = o
    },

    get size() {
      return size
    },
    set size(v) {
      size = v
    },

    tick,
    draw,

    get flipX() {
      return flipX
    },
    set flipX(v) {
      flipX = v
    },

    get flipY() {
      return flipY
    },
    set flipY(v) {
      flipY = v
    },
  })
}
