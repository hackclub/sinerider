function Component(spec, defaultName) {
  const self = {}
  
  let {
    entity,
    name = defaultName,
    entityPath = null,
    active = true,
  } = spec
  
  if (entityPath)
    entity[entityPath] = self
    
  // Called when the component and its entity are beginning initialization
  function awake() {
    // console.log(`Awakening ${entity.name}:${name}`)
  }
  
  // Called when the component and its entity are fully initialized
  function start() {
    // console.log(`Starting ${entity.name}:${name}`)
  }
  
  // Called every frame at a fixed timestep
  function tick() {
    // console.log(`Ticking ${name}`)
  }
  
  // Called every time the canvas is redrawn
  function draw() {
    // console.log(`Drawing ${name}`)
  }
  
  function mix(other) {
    if (_.isFunction(other.awake))
      entity.lifecycle.awake.component.push(other.awake)
      
    if (_.isFunction(other.start))
      entity.lifecycle.start.component.push(other.start)
      
    return _.mixIn(self, other)
  }
  
  function destroy() {
  }
  
  entity.lifecycle.start.component.push(start)
  entity.lifecycle.awake.component.push(awake)
  
  return _.mixIn(self, {
    entity,
    
    start,
    tick,
    draw,
    
    destroy,
    
    get name() {return name},
    set name(v) {name = v},
    
    mix,
  })
}