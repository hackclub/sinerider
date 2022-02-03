function Navigator(spec) {
  const self = Entity(spec, 'Navigator')
  
  const {
    screen,
    levelData,
    tickDelta,
    getEditing,
    setLevel,
  } = spec
  
  const camera = Camera({
    screen,
    fov: 20,
    parent: self,
  })
  
  const waypointDirector = WaypointDirector({
    parent: self,
    camera,
  })
  
  const map = Sprite({
    parent: self,
    camera,
    drawOrder: -3,
    anchored: false,
    size: 178,
    x: 70,
    y: -5.5,
    asset: 'images.world_map',
  })
  
  let showAll = false
  let showAllUsed = false
  
  const bubbles = _.map(levelData, createBubble)
  
  function tick() {
    
  }
  
  function draw() {
    screen.ctx.fillStyle = '#fff'
    screen.ctx.fillRect(0, 0, screen.width, screen.height)
  }
  
  function createBubble(levelDatum) {
    const bubble = LevelBubble({
      levelDatum,
      setLevel,
      waypointDirector,
      camera,
      getEditing,
      tickDelta,
      getBubbleByNick,
      parent: self,
      getShowAll: () => showAll,
    })
    
    return bubble
  }
  
  function getBubbleByNick(nick) {
    for (bubble of bubbles) {
      if (bubble.nick == nick)
        return bubble
    }
    return null
  }
  
  function revealHighlightedLevels(nick) {
    const highlightedLevels = _.filter(bubbles, v => v.hilighted || showAll)
    
    const nicks = _.map(highlightedLevels, v => v.nick)
    // nicks.push(nick)
    console.log(`Revealing hilighted levels ${nicks}, starting from ${nick}`)
    
    moveToLevel(nick, 0, () => {
      moveToLevel(nick, 0.5, () => {
        setTimeout(() => {
          moveToLevel(nicks, 1)
        }, 0)
      })
    }, 8)
  }
  
  function moveToLevel(nicks, duration=0, cb, padding=10) {
    console.log(`Moving to levels ${nicks}`)
    
    if (!_.isArray(nicks))
      nicks = [nicks]
      
    const array = nicks.length == 0 ? bubbles : _.map(nicks, getBubbleByNick)
    
    const position = Vector2()
    const minPosition = Vector2Pinf()
    const maxPosition = Vector2Ninf()
    
    for (bubble of array) {
      position.add(bubble.transform.position)
      minPosition.min(bubble.transform.position)
      maxPosition.max(bubble.transform.position)
    }
    
    if (array.length == 0) {
      maxPosition.set()
      minPosition.set()
    }
    
    minPosition.add(maxPosition, position)
    position.divide(2)
    
    const delta = Vector2(maxPosition).subtract(minPosition)
    
    const fov = Math.max(delta.x, delta.y)/2+padding
    
    waypointDirector.moveTo(null, {
      position,
      fov,
    }, duration, cb)
  }
  
  function setShowAll(_showAll) {
    if (showAll != _showAll) {
      showAll = _showAll
      
      console.log(`Setting show all to ${showAll}`)
      
      if (showAll) {
        moveToLevel([], 1)
        ui.showAllButton.setAttribute('hide', true)
        showAllUsed = true
      }
      else {
      }
      
      refreshBubbles()
    }
  }
  
  function refreshBubbles() {
    _.invokeEach(bubbles, 'refreshPlayable')
  }
  
  return self.mix({
    tick,
    draw,
    
    moveToLevel,
    
    refreshBubbles,
    revealHighlightedLevels,
    
    getBubbleByNick,
    
    get showAll() {return showAll},
    set showAll(v) {setShowAll(v)},
    
    get showAllUsed() {return showAllUsed},
    set showAllUsed(v) {showAllUsed = v},
  })
}