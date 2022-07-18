function HintGraph(spec) {
  const {
    self,
    camera,
    ui,
  } = Entity(spec, 'Hint Graph')

  const {
    slider,
    globalScope,
    drawOrder,
  } = spec

  const { bounds, expression: expressionForm } = slider

  console.log('camera', camera, 'spec', spec)

  function createExpression(n) {
    return expressionForm
      .replace('n', n)
      .replaceAll('+ -', '-')
      .replaceAll('- +', '-')
  }

  const dottedGraph = Graph({
    camera,
    globalScope,
    expression: createExpression(0),
    parent: self,
    strokeWidth: 0.1,
    strokeColor: 'rgb(0,255,0)',
    dashed: true,
    scaleStroke: true,
    dashSettings: [0.5, 0.5],
    fill: false,
    drawOrder,
  })

  ui.dottedSlider.hidden = false

  let expression = createExpression(bounds[2])

  function setSliderExpression(text) {
    dottedGraph.expression = mathquillToMathJS(text)
    ui.dottedMathFieldStatic.latex(text)
  }

  ui.dottedSlider.oninput = e => {
    let val = (ui.dottedSlider.value)/100
    expression = createExpression(val * (bounds[1] - bounds[0]))
    setSliderExpression(expression)
  }

  ui.dottedSlider.value = 100 * ((bounds[2] - bounds[0]) / (bounds[1] - bounds[0]))

  setSliderExpression(expression)

  function setVisible(visible) {
    ui.dottedMathFieldStatic.latex(visible ? expression : '')
    ui.dottedSlider.hidden = !visible
  }

  function destroy() {
    setVisible(false)
  }

  function onTransitionMap(navigating) {
    setVisible(!navigating)
  }

  return self.mix({
    destroy,
    setVisible,
    onTransitionMap,
  })
}