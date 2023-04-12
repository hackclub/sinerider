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
    screenBuffer = null,
    activeRange = [NINF, PINF],
    motionBlur = true,
    blur = 0,
    world = null,
  } = spec

  // Because I constantly forget to use debugSelf instead of simply 'debug'.
  debugSelf = debugSelf || spec.debug

  // Inherit the fundamentals TODO: Make fundamentals a key/value abstraction
  if (parent) {
    parent.addChild(self)
    parent.root.addDescendant(self)

    if (!world) world = parent.world
    if (!camera) camera = parent.camera
    if (!assets) assets = parent.assets
    if (!screen) screen = parent.screen
    if (!tickDelta) tickDelta = parent.tickDelta
    if (!getTime) getTime = parent.getTime
    if (!ui) ui = parent.ui
    if (!debugTree) debugTree = parent.debugTree
    if (_.isUndefined(spec.drawOrder)) drawOrder = parent.drawOrder
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
    get time() {
      return getTime()
    },
  })

  const children = []
  const drawArray = parent ? [] : [self]
  let activeDrawArray = []

  const lifecycle = {
    awake: {
      entity: [],
      component: [],
    },
    start: {
      entity: [],
      component: [],
    },
    destroy: {
      entity: [],
      component: [],
    },
  }

  if (spec.components) addComponents(spec.components)

  let entitiesToAwaken = null

  let activeInHierarchy = true

  let drawArrayIsUnsorted = true

  refreshActiveInHierarchy()

  // Called when the entity is fully constructed
  function awake() {
    sendLifecycleEvent('awake')
  }

  // Called just before the entity's first tick
  function start() {
    sendLifecycleEvent('start')
  }

  // Called when the object is to be fully removed from memory
  function destroy() {
    if (parent) {
      self.root.removeDescendant(self)
      parent.removeChild(self)
    }

    sendLifecycleEvent('destroy')
  }

  function sendLifecycleEvent(path) {
    const e = lifecycle[path].entity
    const c = lifecycle[path].component

    while (e.length > 0) e.shift()()
    while (c.length > 0) c.shift()()

    _.invokeEach(children, 'sendLifecycleEvent', arguments)
  }

  function sendEvent(path, args = [], latePath = null) {
    if (!active) return

    // latePath is constructed on first call, and passed down for subsequent calls, to avoid memory pressure of creating the same new string for every object
    let argumentsArray = arguments
    if (latePath == null) {
      latePath = path + 'Late'
      argumentsArray = [...arguments]
      argumentsArray[2] = latePath
    }

    // Necessary to use _.get() so that 'parent.child' paths are supported. Do not change!
    let f = _.get(self, path)
    if (_.isFunction(f)) {
      const continuePropagating = f.apply(self, args)

      // Only if function explicitly returns false
      if (continuePropagating == false) {
        return
      }
    }

    _.invokeEach(children, 'sendEvent', argumentsArray)

    f = _.get(self, latePath)
    if (_.isFunction(f)) {
      const continuePropagating = f.apply(self, args)
      if (!continuePropagating) {
        return
      }
    }
  }

  function mix(other) {
    if (_.isFunction(other.awake)) lifecycle.awake.entity.push(other.awake)

    if (_.isFunction(other.start)) lifecycle.start.entity.push(other.start)

    if (_.isFunction(other.destroy))
      lifecycle.destroy.entity.push(other.destroy)

    return _.mixIn(self, other, { start, awake, destroy })
  }

  function hasChild(child) {
    return _.isInDeep(children, child)
  }

  function addChild(child) {
    if (hasChild(child)) return

    children.push(child)
  }

  function findChild(childName) {
    for (child of children) {
      if (child.name === childName) return child
    }

    return null
  }

  function findDescendant(descendantName) {
    for (child of children) {
      if (child.name === childName) return child

      let descendant = child.findDescendant(descendantName)

      if (descendant) return descendant
    }

    return null
  }

  let lastFramePos = Vector2()
  let currentFramePos = Vector2()

  function predraw() {
    screen.ctx.filter = `blur(${Math.floor(blur)}px)`
    if (motionBlur && camera && self.transform) {
      // camera.transform.invertPoint(self.transform.transformPoint(Vector2(0, 0)), currentFramePos)
      // const blur = lastFramePos.subtract(currentFramePos).magnitude * 300
      // screen.ctx.filter = `blur(${Math.floor(blur)}px)`
      // // TODO: Switch from blur based on sledder velocity to being based on camera velocity wrt object
      // console.log('blur', blur, lastFramePos.toString(), currentFramePos.toString(), screen.ctx.canvas.filter)
      // lastFramePos.set(currentFramePos)
    }
  }

  function sortChildren() {
    children.sort(compareChildren)
  }

  function compareChildren(a, b) {
    a = _.isNumber(a.drawOrder) ? a.drawOrder : 0
    b = _.isNumber(b.drawOrder) ? b.drawOrder : 0
    return a - b
  }

  function removeChild(child) {
    _.removeDeep(children, child)
  }

  function setActive(_active) {
    active = _active
    sendEvent('onSetActive', [_active])
    drawArrayIsUnsorted = false
    refreshActiveInHierarchy()
  }

  function getLineage() {
    return parent ? parent.getLineage() + '.' + name : name
  }

  function getFromAncestor(path) {
    let v = _.get(self, path, undefined)
    if (_.isUndefined(v)) {
      if (parent) return parent.getFromAncestor(path)
      return null
    }
    return v
  }

  function toString() {
    return name
  }

  function addDescendant(descendant) {
    drawArray.push(descendant)
    drawArrayIsUnsorted = false
  }

  function removeDescendant(descendant) {
    drawArray.splice(drawArray.indexOf(descendant), 1)
  }

  function sortDrawArray() {
    drawArray.sort((a, b) => a.drawOrder - b.drawOrder)
    drawArrayIsUnsorted = true
  }

  function refreshActiveInHierarchy() {
    activeInHierarchy = active && (!parent || parent.activeInHierarchy)
    for (const child of children) {
      child.refreshActiveInHierarchy()
    }
  }

  return _.mixIn(self, {
    awake,
    start,

    destroy,

    get name() {
      return name
    },
    set name(v) {
      name = v
    },

    lifecycle,

    mix,
    sendEvent,
    sendLifecycleEvent,

    hasChild,
    addChild,
    removeChild,

    addDescendant,
    removeDescendant,

    predraw,

    drawArray,
    get activeDrawArray() {
      return activeDrawArray
    },
    sortDrawArray,

    findChild,
    findDescendant,

    getFromAncestor,
    getLineage,

    world,

    get lineage() {
      return getLineage()
    },

    children,
    sortChildren,

    toString,

    get parent() {
      return parent
    },
    get root() {
      return parent ? parent.root : self
    },

    get active() {
      return active
    },
    set active(v) {
      setActive(v)
    },

    get activeInHierarchy() {
      return activeInHierarchy
    },
    refreshActiveInHierarchy,

    get drawOrder() {
      return drawOrder
    },
    set drawOrder(v) {
      if (drawOrder != v) self.root.sortDrawArray()

      drawOrder = v
    },
    get drawArrayIsUnsorted() {
      return drawArrayIsUnsorted
    },

    get blur() {
      return blur
    },
    set blur(v) {
      blur = v
    },

    get activeRange() {
      return activeRange
    },
    get debug() {
      return debugSelf || debugTree
    },

    get motionBlur() {
      return motionBlur
    },
    set motionBlur(v) {
      motionBlur = v
    },
  })
}
