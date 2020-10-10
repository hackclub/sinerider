function Entity(spec) {
  const self = {}
  
  let {
    name = 'Entity',
    active = true,
    parent = null,
  } = spec
  
  if (parent) parent.addChild(self)
  
  const children = []
  
  function tick(globals) {
    console.log(`Ticking ${name}`)
  }
  
  function draw(ctx) {
    console.log(`Drawing ${name}`)
    
  }
  
  function sendEvent(path, args) {
    if (!active) return
    
    if (_.isFunction(self[path]))
      self[path].apply(self, args)
    
    _.invokeEach(children, 'sendEvent', arguments)
  }
  
  function mix(other) {
    return _.mixIn(self, other)
  }
  
  function hasChild(child) {
    return _.isInDeep(children, child)
  }
  
  function addChild(child) {
    if (hasChild(child)) return
    
    children.push(child)
  }
  
  function removeChild(child) {
    _.removeDeep(children, child)
  }
  
  function setActive(_active) {
    active = _active
  }
  
  function destroy() {
    if (parent) parent.removeChild(self)
  }
  
  return _.mixIn(self, {
    tick,
    draw,
    
    destroy,
    
    get name() {return name},
    set name(v) {name = v},
    
    mix,
    sendEvent,
    
    hasChild,
    addChild,
    removeChild,
    
    children,
    
    get parent() {return parent},
    
    get active() {return active},
    set active(v) {setActive(v)},
  })
}