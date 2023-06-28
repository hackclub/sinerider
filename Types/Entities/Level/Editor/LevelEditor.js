// TODO: Figure out how Editor should work?
// (Maybe doesn't need its own class?)
function LevelEditor(spec) {
  const { self, ui, goals, sledders } = Level(spec)

  const base = _.mix(self)

  const editor = Editor({
    parent: self,
    level: self,
    ui,
  })

  console.log('level editor')

  function goalDeleted(goal) {
    goals.splice(goals.indexOf(goal), 1)
  }

  function addedGoalFromEditor(type) {
    /* Kind of a hack? Reuse base class helper */
    const generators = {
      path: EditablePathGoal,
      fixed: EditableFixedGoal,
      dynamic: EditableDynamicGoal,
    }

    base.addGoal(
      {
        type,
        editor,
      },
      generators,
    )

    const addedGoal = _.last(goals)
    addedGoal.select()
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
    goalDeleted,
    serialize,
    addedGoalFromEditor,
  })
}
