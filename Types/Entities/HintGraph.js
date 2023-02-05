function HintGraph(spec) {
  const { self, camera, ui } = Entity(spec, 'Hint Graph')

  const { slider, globalScope, drawOrder } = spec

  const { bounds, expression: expressionForm } = slider

  function createExpression(n) {
    return expressionForm
      .replace('n', n.toFixed(2))
      .replaceAll('+ -', '-')
      .replaceAll('- +', '-')
  }

  const dottedGraph = Graph({
    camera,
    globalScope,
    expression: createExpression(0),
    parent: self,
    strokeWidth: 0.1,
    strokeColor: 'rgb(0,255,0,0)',
    dashed: true,
    scaleStroke: true,
    dashSettings: [0.5, 0.5],
    fill: false,
    drawOrder,
  })

  let expression = createExpression(bounds[2])

  function setSliderExpression(text) {
    dottedGraph.expression = mathquillToMathJS(text)
    ui.dottedMathFieldStatic.latex(`Y=${text}`)
  }

  ui.dottedSlider.oninput = (e) => {
    let val = ui.dottedSlider.value / 100
    expression = createExpression(val * (bounds[1] - bounds[0]) + bounds[0])
    setSliderExpression(expression)
  }

  ui.dottedSlider.value =
    100 * ((bounds[2] - bounds[0]) / (bounds[1] - bounds[0]))

  setSliderExpression(expression)

  function setVisible(visible) {
    ui.dottedMathContainer.style.display = visible ? 'flex' : 'none'
    // ui.dottedMathFieldStatic.latex(visible ?  `\\text{Y}=${expression}` : '')
    // ui.dottedSlider.hidden = !visible
  }

  setVisible(true)

  function displayDottedGraph() {
    dottedGraph.strokeColor = 'rgba(0,255,0)'
  }

  function destroy() {
    setVisible(false)

    dottedGraph.strokeColor = 'rgba(0,255,0,0)'
    ui.dottedMathField.style.display = 'none'
    ui.dottedSlider.hidden = true
    ui.dottedHintButton.style.display = 'block'
  }

  function onToggleMap(mapEnabled) {
    setVisible(!mapEnabled)
  }

  return self.mix({
    displayDottedGraph,
    destroy,
    setVisible,
    onToggleMap,
  })
}
