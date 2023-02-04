function Shape(spec) {
  const { transform } = spec

  const p = Vector2()

  function localize(point) {
    p.set(point)

    if (transform) transform.invertPoint(p)

    return p
  }

  return {
    localize,
    transform,
  }
}
