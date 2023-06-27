// TODO: Figure out how Editor should work?
// (Maybe doesn't need its own class?)
function EditorLevel(spec) {
  const { self, goals, sledders } = Level(spec)

  const base = _.mix(self)

  const panel = EditorPanel({})

  function awake() {
    base.awake()
    editor.active = true
  }

  function destroy() {
    base.destroy()
    editor.active = true
  }

  function serialize() {
    const json = {
      // Version, etc.
      ...base.serialize(),
      goals: goals.map((g) => {
        return {
          type: g.type,
          x: g.transform.x,
          y: g.transform.y,
          order: g.order,
        }
      }),
    }
    if (sledders[0]) json.x = sledders[0].transform.x
    return json
  }

  return self.mix({
    awake,
    destroy,

    serialize,
  })
}
