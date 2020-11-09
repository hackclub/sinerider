function Entity(spec, defaultName = 'Entity') {
  const self = {}
  
  let {
    name = defaultName,
    active = true,
    parent = null,
    zSort = true,
    zSortChildren = false,
    camera = null,
    screen = null,
    tickDelta = null,
    getTime = null,
    ui = null,
  } = spec
  
  // Inherit the fundamentals TODO: Make fundamentals a key/value abstraction
  if (parent) {
    parent.addChild(self)
    
    if (!camera)
      camera = parent.camera
    if (!screen)
      screen = parent.screen
    if (!tickDelta)
      tickDelta = parent.tickDelta
    if (!getTime)
      getTime = parent.getTime
    if (!ui)
      ui = parent.ui
  }
  
  const ctx = screen ? screen.ctx : null
  
  // Mix in the fundamentals
  _.mixIn(self, {
    self,
    camera,
    screen,
    ctx,
    ui,
    tickDelta,
    get time() {return getTime()},
  })
  
  const children = []
  const components = []
  
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
  
  // Called when the entity is fully initialized
  function awake() {
    // console.log(`Awakening ${name}`)
  }
  
  // Called when the entity is fully initialized
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
  
  function sendEvent(path, args = [], includeComponents = true) {
    if (!active) return
    
    let f = _.get(self, path)
    if (_.isFunction(f))
      f.apply(self, args)
    
    if (includeComponents)
      _.invokeEach(components, path, args)
    
    _.invokeEach(children, 'sendEvent', arguments)
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
  
  function removeChild(child) {
    _.removeDeep(children, child)
  }
  
  function setActive(_active) {
    active = _active
  }
  
  function addComponents(array = [], specInject = {}) {
    const newComponents = []
    
    for (let i = 0; i < array.length; i++) {
      let generator = array[i]
      let componentSpec = (i+1) < array.length ? array[i+1] : {}
      
      if (!_.isFunction(generator)) continue
      
      newComponents.push(addComponent(generator, {
        ...specInject,
        ...componentSpec,
      }))
    }
    
    return newComponents
  }
  
  function addComponent(generator, spec = {}) {
    let component = generator({
      entity: self,
      ...spec
    })
    
    components.push(component)
    
    return component
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
    
    get zSort() {return zSort},
    set zSort(v) {zSort = v},
    
    lifecycle,
    
    mix,
    sendEvent,
    sendLifecycleEvent,
    
    hasChild,
    addChild,
    removeChild,
    
    getFromAncestor,
    
    children,
    
    addComponent,
    addComponents,
    
    toString,
    
    get parent() {return parent},
    get root() {return parent ? parent.root : self},
    
    get active() {return active},
    set active(v) {setActive(v)},
  })
}