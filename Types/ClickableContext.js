function ClickableContext(spec) {
  const {
    entity,
  } = spec
  
  let target = null
  
  const mousePoint = Vector2()
  
  const hits = []
  const collectHitArgs = [mousePoint, hits]
  
  function processEvent(eventData, eventName) {
    mousePoint.set(eventData.offsetX, eventData.offsetY)

    // Collect all hits at mousePoint
    hits.length = 0
    entity.sendEvent('clickable.collectHit', collectHitArgs)
    
    // Sort hits by layer
    hits.sort(compareHits)
    
    // New target is the  top-level hit
    let newTarget = _.last(hits)
    
    if (newTarget != target) {
      // console.log('Top-level hit is '+_.get(newTarget, 'entity.name', 'empty'))
      
      // Exit old target, enter new target
      if (target) target.mouseExit(mousePoint)
      if (newTarget) newTarget.mouseEnter(mousePoint)
      
      // New target replaces the current target
      target = newTarget
    }
    
    // Ping every clickable in this tree
    entity.sendEvent('clickable.'+eventName, [mousePoint])
  }
  
  function compareHits(a, b) {
    return a.layer - b.layer
  }
  
  return {
    processEvent,
  }
}