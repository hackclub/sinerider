function Snow(spec, name = 'Snow') {
  const { self, screen, assets } = Entity(spec, name)

  return self.mix({})
}
