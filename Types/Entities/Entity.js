function Entity(spec, defaultName = 'Entity') {
  const self = {}
  
  let {
    name = defaultName,
    active = true,
    parent = null,
    assets = null,
    camera = null,
    screen = null,
    tickDelta = null,
    getTime = null,
    ui = null,
    drawOrder = 0,
    debugSelf = false,
    debugTree = false,
  } = spec
  
  // Because I constantly forget to use debugSelf instead of simply 'debug'.
  debugSelf = debugSelf || spec.debug
  
  // Inherit the fundamentals TODO: Make fundamentals a key/value abstraction
  if (parent) {
    parent.addChild(self)
    
    if (!camera)
      camera = parent.camera
    if (!assets)
      assets = parent.assets
    if (!screen)
      screen = parent.screen
    if (!tickDelta)
      tickDelta = parent.tickDelta
    if (!getTime)
      getTime = parent.getTime
    if (!ui)
      ui = parent.ui
    if (!debugTree)
      debugTree = parent.debugTree
  }
  
  const ctx = screen ? screen.ctx : null
  
  // Mix in the fundamentals
  _.mixIn(self, {
    self,
    camera,
    screen,
    assets,
    ctx,
    ui,
    tickDelta,
    get time() {return getTime()},
  })
  
  const children = []
  
  const lifecycle = {
    awake: {
      entity: [awake],
      component: [],
    },
    start: {
      entity: [start],
      component: [],
    },
    destroy: {
      entity: [destroy],
      component: [],
    },
  }
  
  if (spec.components)
    addComponents(spec.components)
  
  // Called when the entity is fully constructed
  function awake() {
    // console.log(`Awakening ${name}`)
  }
  
  // Called just before the entity's first tick
  function start() {
    // console.log(`Starting ${name}`)
  }
  
  // Called every frame at a fixed timestep
  function tick() {
    // console.log(`Ticking ${name}`)
  }
  
  // Called every time the canvas is redrawn
  function draw() {
    // console.log(`Drawing ${name}`)
  }
  
  // Called when the object is to be fully removed from memory
  function destroy() {
    if (parent)
      parent.removeChild(self)
  }
  
  function sendLifecycleEvent(path) {
    const e = lifecycle[path].entity
    const c = lifecycle[path].component
    
    while (e.length > 0) e.shift()()
    while (c.length > 0) c.shift()()
    
    _.invokeEach(children, 'sendLifecycleEvent', arguments)
  }
  
  function sendEvent(path, args = [], latePath=null) {
    if (!active) return
      
    // latePath is constructed on first call, and passed down for subsequent calls, to avoid memory pressure of creating the same new string for every object
    let argumentsArray = arguments
    if (latePath == null) {
      latePath = path+'Late'
      argumentsArray = [...arguments]
      argumentsArray[2] = latePath
      if (path != 'tick' && path != 'draw')
        console.log(`Calling event ${path} on ${name} with latePath ${latePath}`)
    }
    
    // Necessary to use _.get() so that 'parent.child' paths are supported. Do not change!
    let f = _.get(self, path)
    if (_.isFunction(f))
      f.apply(self, args)
    
    _.invokeEach(children, 'sendEvent', argumentsArray)
    
    f = _.get(self, latePath)
    if (_.isFunction(f))
      f.apply(self, args)
  }
  
  function mix(other) {
    if (_.isFunction(other.awake))
      lifecycle.awake.entity.push(other.awake)
      
    if (_.isFunction(other.start))
      lifecycle.start.entity.push(other.start)
      
    return _.mixIn(self, other)
  }
  
  function hasChild(child) {
    return _.isInDeep(children, child)
  }
  
  function addChild(child) {
    if (hasChild(child)) return
    
    children.push(child)
  }
  
  function sortChildren() {
    children.sort(compareChildren)
  }
  
  function compareChildren(a, b) {
    a = _.isNumber(a.drawOrder) ? a.drawOrder : 0
    b = _.isNumber(b.drawOrder) ? b.drawOrder : 0
    return a-b
  }
  
  function removeChild(child) {
    _.removeDeep(children, child)
  }
  
  function setActive(_active) {
    active = _active
  }
  
  function getLineage() {
    return parent ? (parent.getLineage()+'.'+name) : name
  }
  
  function getFromAncestor(path) {
    let v = _.get(self, path, undefined)
    if (_.isUndefined(v)) {
      if (parent)
        return parent.getFromAncestor(path)
      return null
    }
    return v
  }
  
  function toString() {
    return name
  }
  
  return _.mixIn(self, {
    awake,
    start,

    tick,
    draw,
    
    destroy,
    
    get name() {return name},
    set name(v) {name = v},
    
    lifecycle,
    
    mix,
    sendEvent,
    sendLifecycleEvent,
    
    hasChild,
    addChild,
    removeChild,
    
    getFromAncestor,
    getLineage,
    
    get lineage() {return getLineage()},
    
    children,
    sortChildren,
    
    toString,
    
    get parent() {return parent},
    get root() {return parent ? parent.root : self},
    
    get active() {return active},
    set active(v) {setActive(v)},
    
    get drawOrder() {return drawOrder},
    set drawOrder(v) {drawOrder = v},
    
    get debug() {return debugSelf || debugTree},
  })
}