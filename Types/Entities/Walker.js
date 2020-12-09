function Walker(spec) {
  const {
    self,
    camera,
    screen,
    ctx,
  } = Entity(spec, 'Walker')
  
  let {
    sprite
  } = spec
  
  sprite = Sprite({
    parent: self,
    ...sprite
  })
  
  const clickable = Clickable({
    entity: self,
    space: 'frame',
    layer: spec.layer,
  })
  
  function tick() {
    
  }
  
  function draw() {
    
  }
  
  function pointerDown() {
    
  }
  
  function pointerMove() {
    
  }
  
  function pointerUp() {
    
  }
  
  return self.mix({
    clickable,
    
    pointerDown,
    pointerMove,
    pointerUp,
    
    click,
    
    tick,
    draw,
  })
}