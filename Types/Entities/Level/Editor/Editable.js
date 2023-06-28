function Editable(spec) {
  const { entity, shape, transform, camera } = spec
}

/*

Editor control flow:

<Normally, nothing is editable>

Editor selected:
  World -> Level -> Editor()

Editor level adds panel UI

-> EditorPanel()
  -> Configuration button
    -> Modal, change misc. options
      - Biome
      - Ada/Jack
      
  -> Main panel
    -> EditorSpawner()
      -> Spawner({
        prototype: DynamicGoal
      })
      -> Spawner({
        prototype: PathGoal
      })
      -> Spawner({
        prototype: FixedGoal
      })
      etc.
    -> EditorInspector()
      -> HTML for editing attributes:
        Order: <select> menu
        Position: X, Y
        Offset (PathGoal): X, Y


When a Spawner is clicked, that prototype will be cloned, clone moved to new Dragger()
  - Dragger responds to mouse move -> move prototype transform

when Dragger is clicked, item will be moved to EditorLevel and Dragger deleted

editable item
      - attributes: pass to EditorInspector
        - inspector.invoke({
          x: (newX) => {},
          y: (newY) => {},
          text: (newText) => {},
          order: (order) => {},

          etc.
        })
        * responsible for cleanup
          * inspector.hide()
      - clickable
        - selectedDragMove
        - select/unselected
      - draw
        - if (selected) bounds.draw()

EditableDynamicGoal
  -> editable attributes: 
    * position: [x, y]
    * offset: x

EditableFixedGoal
  -> editable attributes: 
    * position: [x, y]
    * order: letter
    * offset: x

EditableDynamicGoal
  -> editable attributes: 
    * position: [x, y]
    * Order: letter
    * offset: x

*/
