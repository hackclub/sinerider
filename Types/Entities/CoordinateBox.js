function CoordinateBox(spec) {
  const { self } = Entity(spec, 'CoordinateBox')

  let { content = 'Hello', domSelector, style = {} } = spec

  let domElement = $(domSelector)

  style = { left: '50px', ...style }

  const helperBubble = document.createElement('div')
  helperBubble.innerHTML = content
  helperBubble.className = 'coordinate'
  Object.assign(helperBubble.style, style)

  domElement.appendChild(helperBubble)

  function destroy() {
    helperBubble.remove()
  }

  function selectCoordinates(screenX, screenY, worldX, worldY) {
    // TODO: Use either style object or manually set individual css
    // properties -- figure out best practice for JS-managed UI generally
    helperBubble.innerHTML = `(${worldX.toFixed(2)}, ${worldY.toFixed(2)})`
    helperBubble.style.left = `${screenX}px`
    helperBubble.style.bottom = `${screen.height - screenY}px`
  }

  return self.mix({
    selectCoordinates,
    destroy,

    set visible(v) {
      helperBubble.style.visibility = v ? 'visible' : 'hidden'
    },
  })
}
