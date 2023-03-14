function SignPost(spec = {}) {
  const {
    self,
    screen,
    camera,
    assets,
    content = 'My content property has not been set!',
  } = Entity(spec, 'SignPost')

  const { graph } = spec

  const transform = Transform(spec)

  const shape = Circle({
    transform,
    radius: 1,
    // center:
  })
  // Rect({
  //   transform,
  //   center: [0, 1],
  //   width: 2,
  //   height: 2,
  // })

  const clickable = Clickable({
    entity: self,
    shape,
    camera,
    transform,
  })

  const sprite = Sprite({
    transform,
    parent: self,
    size: 3,
    asset: 'images.sign_post',
    offset: [0, 0.95],
  })

  function tick() {
    transform.position.y = graph.sample('x', transform.position.x)
    if (clickable.hovering) console.log('Hovering ' + self.name)
  }

  function click() {
    ui.sign.setAttribute('hide', false)
    ui.signContent.innerHTML = content
    console.log('Clicking ' + self.name)
  }

  return self.mix({
    transform,
    clickable,

    click,

    tick,
  })
}
