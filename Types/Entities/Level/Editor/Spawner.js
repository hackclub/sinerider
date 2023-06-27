function Spawner(spec) {
  const { self } = Entity(speec, 'Spawner')

  const { prototype } = spec

  const clickable = Clickable({
    // TODO
  })

  function click() {}

  return self.mix({
    clickable,
  })
}
