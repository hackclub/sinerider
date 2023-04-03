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
  let camerax = 100
  let cameray = 0
  let domElement = $(domSelector)
  style = {left: '50px', ...style}
  let helperBubble = document.createElement('div')
  helperBubble.className = `coordinate`
  helperBubble.innerHTML = content
  Object.assign(helperBubble.style, style)

  domElement.appendChild(helperBubble)

  function refreshDOM(newx=x, newy=y, oldx, oldy){
    x = parseFloat(newx).toFixed(2)
    y = parseFloat(newy).toFixed(2)

    helperBubble.remove()
    helperBubble = document.createElement('div')
    helperBubble.className = `coordinate`
    helperBubble.innerHTML = content
    domElement.appendChild(helperBubble)
    
    content = `(${x}, ${y})`

    if (visible == false){
      style= { ...style, visibility: 'hidden', left: `${oldx}px`, bottom: `${screen.height-oldy}px`}
    }
    if (visible == true){
      style= {...style,left: `${oldx}px`, bottom: `${screen.height-oldy}px`,  visibility: 'visible', }
    }
    Object.assign(helperBubble.style, style)

    
  }
  function visiblefalse(){
    visible = false
    refreshDOM(x, y, x, y)
  }
  function visibletrue(){
    refreshDOM(x, y, x, y)
    visible = true
    refreshDOM(x, y, x, y)
  }
  function destroy() {
    helperBubble.remove()
  }
  function getx(){
    return x
  }
  function gety(){
    return y
  }

  return self.mix({
    helperBubble,
    refreshDOM,
    destroy,
    visiblefalse,
    visibletrue,
    getx, 
    gety,

  })
}
