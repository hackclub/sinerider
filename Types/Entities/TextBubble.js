/**
 * Create a text bubble which can be appended to a DOM Element
 * @param {string} spec.content text in the bubble
 * @param {string} spec.domSelector parent dom query selector
 * @param {string} spec.place either top-right top-left bottom-right bottom-left
 * @param {object} spec.style extra styles to be added like top/bottom/color
 * @returns 
 */
function TextBubble(spec) {
    const {
      self
    } = Entity(spec, 'TextBubble')
    
    let {
      visible = true,
      content = 'Hello',
      domSelector,
      place,
      style = {}
    } = spec
    
    const domElement = $(domSelector)
    const helperBubble = document.createElement("div")
    helperBubble.className = `helper-bubble ${place}`
    helperBubble.innerHTML = content

    helperBubble.style.display = visible ? "block" : "none"
    Object.assign(helperBubble.style, style)

    domElement.appendChild(helperBubble)
    
    function toggleVisible(newVis = !visible) {
      visible = newVis
      helperBubble.style.display = visible ? "block" : "none"
    }

    function awake() {
      toggleVisible(true)
    }

    function destroy() {
      toggleVisible(false)
      helperBubble.remove()
    }

    return self.mix({
      toggleVisible,
      helperBubble,
      
      awake,
      destroy
    })
  }