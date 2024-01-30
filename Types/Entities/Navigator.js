function Navigator(spec) {
  const self = Entity(spec, 'Navigator')

  const {
    screen,
    levelData,
    tickDelta,
    getEditing,
    setLevel,
    assets,
    playerStorage,
  } = spec

  const initialMapFov = 15

  const minMapFov = initialMapFov
  const maxMapFov = 80

  let mapFov = initialMapFov

  const camera = Camera({
    screen,
    fov: mapFov,
    parent: self,
    offset: [0, 0],
  })

  const panDirector = PanDirector({
    parent: self,
    camera,
  })

  const map = Sprite({
    parent: self,
    camera,
    drawOrder: LAYERS.map,
    anchored: false,
    size: 190,
    x: 85,
    y: -5.5,
    asset: 'images.world_map',
  })

  const clickable = Clickable({
    entity: self,
    camera,
  })

  let showAll = false
  let showAllUsed = false

  let initialBubble = null

  const bubbles = _.map(levelData, createBubble)
  const bubbleRenderQueue = []
  const bubbleRenderCap = 10

  function start() {
    if (initialBubble) initialBubble.completeAllRequirements()
    for (const datum of playerStorage.getCompletedLevels()) {
      let bubble = getBubbleByNick(datum.nick)
      if (bubble) {
        bubble.complete()
        bubble.completeAllRequirements()
      }
    }
  }

  function tick() {
    if (bubbleRenderQueue.length > 0) {
      let b = 0
      while (b++ <= bubbleRenderCap && bubbleRenderQueue.length > 0) {
        const bubble = bubbleRenderQueue.pop()
        console.log('Rendering bubble', bubble.nick)
        bubble.render()
      }
    }
  }

  function draw() {
    screen.ctx.fillStyle = '#fff'
    screen.ctx.fillRect(0, 0, screen.width, screen.height)

    // let left = camera.lowerLeft.x + 5
    // let right = camera.upperRight.x - 5
    // let top = camera.upperRight.y
    // let bottom = camera.lowerLeft.y
    // rect.center.set((left + right) / 2, (top + bottom) / 2)
    // rect.width = right - left
    // rect.height = top - bottom

    // rect.draw(screen.ctx, camera)
  }

  function createBubble(levelDatum) {
    const bubble = LevelBubble({
      parent: self,
      levelDatum,
      setLevel,
      assets,
      camera,
      getEditing,
      tickDelta,
      getBubbleByNick,
      panCamera,
      getShowAll: () => showAll,
      drawOrder: LAYERS.levelBubbles,
    })

    return bubble
  }

  function getBubbleByNick(nick) {
    for (bubble of bubbles) {
      if (bubble.nick == nick) return bubble
    }
    return null
  }

  function revealHighlightedLevels(nick) {
    const highlightedLevels = _.filter(bubbles, (v) => v.hilighted || showAll)

    const nicks = _.map(highlightedLevels, (v) => v.nick)
    // nicks.push(nick)

    moveToLevel(
      nick,
      0,
      () => {
        assets.sounds.map_zoom_out.play()
      },
      8,
    )
  }

  function moveToLevel(nicks, duration = 0, cb, padding = 10) {
    if (!_.isArray(nicks)) nicks = [nicks]

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

    // const fov = Math.max(delta.x, delta.y) / 2 + padding

    panDirector.moveTo(
      null,
      {
        fov: initialMapFov,
        position,
      },
      duration,
      () => {
        // When finished moving, reset FOV from zoom
        mapFov = initialMapFov
        panDirector.setTargetFov(mapFov)

        cb()
      },
    )
  }

  function setShowAll(_showAll) {
    if (showAll != _showAll) {
      showAll = _showAll

      if (showAll) {
        ui.showAllButton.setAttribute('hide', true)
        assets.sounds.map_zoom_show_all.play()
        showAllUsed = true
      } else {
      }

      refreshBubbles()
    }
  }

  function refreshBubbles() {
    _.invokeEach(bubbles, 'refreshPlayable')
    _.invokeEach(bubbles, 'refreshArrows')
    let b = 0
    for (bubble of bubbles) {
      if (bubble.visible && !bubble.rendered) {
        bubbleRenderQueue.push(bubble)
      }
    }
  }

  function panCamera(point, cb = null) {
    panDirector.moveTo(
      null,
      {
        fov: initialMapFov,
        position: point,
      },
      1,
      cb,
    )
  }

  function click() {
    return false // Don't let propagate to child LevelBubbles
  }

  function onMouseWheel(event) {
    const deltaY = event.deltaY
    mapFov = math.clamp(minMapFov, maxMapFov, mapFov + deltaY * 0.2)
    panDirector.setTargetFov(mapFov)
  }

  return self.mix({
    start,
    tick,
    draw,

    onMouseWheel,

    moveToLevel,

    clickable,
    updatePanVelocity: panDirector.updateVelocity,

    click,

    refreshBubbles,
    revealHighlightedLevels,

    getBubbleByNick,

    get showAll() {
      return showAll
    },
    set showAll(v) {
      setShowAll(v)
    },

    get showAllUsed() {
      return showAllUsed
    },
    set showAllUsed(v) {
      showAllUsed = v
    },

    get initialBubble() {
      return initialBubble
    },
    set initialBubble(v) {
      initialBubble = v
    },
  })
}
