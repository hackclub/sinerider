function EntityGroup(entities = []) {
  function blur(blurAmount) {
    entities.forEach((e) => (e.blur = blurAmount))
  }

  return {
    blur,
  }
}
