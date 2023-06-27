function Dragger(spec) {
  const { self } = Entity(spec, 'Dragger')

  const { item } = spec

  const transform = Transform()

  const clickable = Clickable({
    // TODO
  })

  function dragMove(event) {
    // TODO: Offset transform
  }

  function click() {
    // TODO: Set transform of item
  }

  return self.mix({
    draw,

    transform,
  })
}
