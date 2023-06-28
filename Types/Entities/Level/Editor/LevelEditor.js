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

  /*

Editor flow:

Open level editor (map, URL (edit: true), sinerider.com/?edit)
  - Level -> LevelEditor()
    -> sendEvent('editorEnabled')
    - gridlines always enabled
      -> override selectScreenCoordinates()
        -> if selected, no coordinate box
    - Share button
  
Share -> open dialog w/ serialized JSON with edit: false, name: "Custom"
  - Open as normal, uneditable level


*/

  function awake() {
    self.sendEvent('editorAwake', [editor])
  }

  console.log('level editor')

  function goalDeleted(goal) {
    goals.splice(goals.indexOf(goal), 1)
  }

  function addedGoalFromEditor(type) {
    /* Kind of a hack? Reuse base class helper */
    // const editableGenerator = {
    //   path: PathGoalEditable,
    //   fixed: FixedGoalEditable,
    //   dynamic: DynamicGoalEditable,
    // }[type]

    // base.addGoal(
    //   {
    //     type,
    //     editor,
    //     editableGenerator,
    //   },
    //   generators,
    // )

    base.addGoal({
      type,
    })

    const addedGoal = _.last(goals)
    addedGoal.sendEvent('editorAwake', [editor])
    // addedGoal.sendEvent('select')
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
    goalDeleted,
    serialize,
    addedGoalFromEditor,

    // TODO: Remove need for this
    // (effectively global variable)
    get editing() {
      return editor.active
    },

    get editor() {
      return editor
    },
  })
}
