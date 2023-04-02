
/**
 * Create a text bubble which can be appended to a DOM Element
 * @param {string} spec.content text in the bubble
 * @param {string} spec.domSelector parent dom query selector
 * @param {string} spec.place either top-right top-left bottom-right bottom-left
 * @param {object} spec.style extra styles to be added like top/bottom/color
 * @returns
 */
function CoordinateBox(spec) {
  const { self } = Entity(spec, 'CoordinateBox')

  let {
    visible = false,
    content = 'Hello',
    domSelector,
    place,
    x,
    y,
    style = {},
  } = spec

  style = {left: '50px', ...style}
  const domElement = $(domSelector)
  let helperBubble = document.createElement('div')
  helperBubble.className = `coordinate`
  helperBubble.innerHTML = content
  Object.assign(helperBubble.style, style)

  domElement.appendChild(helperBubble)

  function refreshDOM(newx=x, newy=y){
    helperBubble.remove()
    helperBubble = document.createElement('div')
    helperBubble.className = `coordinate`
    helperBubble.innerHTML = content

    if (visible == false){
      style= { ...style, visibility: 'hidden'}
    }
    if (visible == true){
      style= {...style, visibility: 'visible'}
    }
    Object.assign(helperBubble.style, style)

    domElement.appendChild(helperBubble)
    x = parseFloat(newx).toFixed(2)
    y = parseFloat(newy).toFixed(2)
    content = `(${x}, ${y})`
  }
  function visiblefalse(){
    visible = false
    refreshDOM()
  }
  function visibletrue(){
    visible = true
    refreshDOM()
  }
  function destroy() {
    helperBubble.remove()
  }

  return self.mix({
    helperBubble,
    refreshDOM,
    destroy,
    visiblefalse,
    visibletrue,

  })
}
