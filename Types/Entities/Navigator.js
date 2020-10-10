function Navigator(spec) {
  const self = Entity({
    name: 'Navigator',
    ...spec
  })
  
  const {
    screen,
    levelData,
    getEditing,
    setLevel,
  } = spec
  
  const camera = Camera({
    screen,
    fov: 20
  })
  
  self.addChild(camera)
  
  const bubbles = _.map(levelData, createBubble)
  
  self.addChild(bubbles)
  
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
      screen,
      camera,
      getEditing,
    })
    
    return bubble
  }
  
  function highlightLevel(levelDatum) {
    
  }
  
  return self.mix({
    tick,
    draw,
    
    highlightLevel,
  })
}