/**
 * Create a text bubble which can be appended to a DOM Element
 * @param {string} spec.content text in the bubble
 * @param {string} spec.domSelector parent dom query selector
 * @param {string} spec.place either top-right top-left bottom-right bottom-left
 * @param {object} spec.style extra styles to be added like top/bottom/color
 * @returns
 */
function Tip(spec) {
  const { self } = Entity(spec, 'Tip')

  let {
    visible = true,
    index=10,
    tipCompleted,
    content = 'Hello',
    domSelector,
    place,
    destroyOnClick = false,
    style = {},
  } = spec

  const domElement = $(domSelector)
  const helperBubble = document.createElement('div')
  helperBubble.className = `helper-bubble ${place}`
  helperBubble.innerHTML = content

  helperBubble.style.display = visible ? 'block' : 'none'
  Object.assign(helperBubble.style, style)

  domElement.appendChild(helperBubble)

  function toggleVisible(newVis = !visible) {
    visible = newVis
    helperBubble.style.display = visible ? 'block' : 'none'
  }

  function awake() {
    toggleVisible(true)
  }

  function complete(){
    refreshDOM()
    console.log(helperBubble)
    tipCompleted()
  }

  function refreshDOM(){
    index-=1
    if (index == 0){
      style= {visibility: 'visible'}
    }
    else{
      style= {visibility: 'hidden'}
    }
    helperBubble.className = `helper-bubble ${place}`
    helperBubble.innerHTML = content

    helperBubble.style.display = visible ? 'block' : 'none'
    Object.assign(helperBubble.style, style)
    
  }

  if (destroyOnClick)
    domElement.onmousedown = () => {
      self.complete()
    }

  function onToggleMap(navigating) {
    toggleVisible(!navigating)
  }

  return self.mix({
    toggleVisible,
    helperBubble,
    onToggleMap,
    refreshDOM,
    complete,

    awake,
  })
}
