/**
 * Create a text bubble which can be appended to a DOM Element
 * @param {string} spec.content text in the bubble
 * @param {string} spec.domSelector parent dom query selector
 * @param {object} spec.style extra styles to be added like top/bottom/color
 * @returns 
 */
function TextBubble(spec) {
    const {
      content = 'Hello',
      domSelector,
      style = {}
    } = spec
    
    let {
      visible
    } = spec

    const domElement = $(domSelector)
    const helperBubble = document.createElement("div")
    helperBubble.className = "helper-bubble"
    helperBubble.innerHTML = content

    helperBubble.style.display = visible ? "block" : "none"
    Object.assign(helperBubble.style, style)

    domElement.appendChild(helperBubble)
    
    function toggleVisible(newVis = !visible) {
      visible = newVis
      helperBubble.style.display = visible ? "block" : "none"
    }

    return self.mix({
      toggleVisible,
      helperBubble
    })
  }