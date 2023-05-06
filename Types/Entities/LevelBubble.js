let levelBubblesDrawn = 0
function LevelBubble(spec) {
  const { ui, self, parent, screen, camera, assets } = Entity(
    spec,
    'LevelBubble ' + spec.levelDatum.nick,
  )

  const {
    setLevel,
    levelDatum,
    getEditing,
    tickDelta,
    getBubbleByNick,
    getShowAll,
    quad,
    panCamera,
  } = spec

  const { nick, requirements, radius = 3 } = levelDatum

  const dependencies = []

  const transform = Transform(levelDatum)

  const shape = Circle({
    transform,
    radius,
  })

  const clickable = Clickable({
    entity: self,
    shape,
    transform,
    camera,
  })

  const arrows = []

  let rendered = false
  let completed = false
  let hilighted = false
  let playable = false
  let unlocked = false
  let visible = false

  let frameCounter = 0
  let bubbletRunning = false
  let bubbletRunTime = 0

  const bubbletGlobalScope = {
    get t() {
      return bubbletRunTime
    },
    dt: tickDelta,

    get running() {
      return bubbletRunning
    },
  }

  const bubbletCanvas = document.createElement('canvas')
  const previewCanvas = document.createElement('canvas')

  let bubbletPixels = 512

  bubbletCanvas.width = bubbletPixels
  bubbletCanvas.height = bubbletPixels

  previewCanvas.width = bubbletPixels * 2
  previewCanvas.height = bubbletPixels * 2

  ui.bubblets.appendChild(bubbletCanvas)
  const bubbletScreen = Screen({
    canvas: bubbletCanvas,
    element: bubbletCanvas,
  })

  const bubbletCamera = Camera({
    screen: bubbletScreen,
  })

  // levelDatum.axesEnabled = false

  let bitmap = null

  function resizeBitmap() {
    let size = Math.round(camera.worldToScreenScalar(radius * 2))
    if (bitmap) {
      bitmap.close()
      bitmap = null
    }
    createImageBitmap(bubbletCanvas, {
      resizeWidth: size,
      resizeHeight: size,
    }).then((_bitmap) => {
      bitmap = _bitmap
    })
  }

  function resize() {
    resizeBitmap()
  }

  const ctx = screen.ctx

  function awake() {
    linkRequirements()

    // Offset position by first requirement's position
    const p = Vector2()
    if (requirements.length > 0) {
      p.set(requirements[0].transform.position)
    }
    transform.position.add(p)
  }

  function start() {
    // Create an arrow to each dependency
    for (bubble of requirements) {
      let arrow = Arrow({
        truncate: [radius + 0.9, radius + 0.9],
        point0: bubble.transform.position,
        point1: transform.position,
        drawOrder: LAYERS.arrows,
        parent: self,
      })

      arrow.fromBubble = bubble
      arrow.toBubble = self
      arrows.push(arrow)
    }

    refreshPlayable()
  }

  function startLate() {}

  function tick() {}

  let tmp = Vector2()

  function localToScreen(localX, localY) {
    tmp.set(localX, localY)
    camera.worldToScreen(tmp, tmp, transform)
    return [tmp.x, tmp.y]
  }

  function render() {
    const bubbletLevel = Level({
      datum: levelDatum,
      axesEnabled: false,
      screen: bubbletScreen,
      camera: bubbletCamera,
      globalScope: bubbletGlobalScope,
      parent: self,
      useDragCamera: false,
      isBubbleLevel: true,
      drawOrder: LAYERS.levelBubbles,
    })
    bubbletLevel.awake()
    bubbletLevel.start()
    bubbletLevel.sendEvent('tick')
    bubbletLevel.sendEvent('draw')
    bubbletLevel.destroy()
    rendered = true
    resizeBitmap()

    const previewCtx = previewCanvas.getContext('2d')
    let previewWidth = previewCanvas.width / 2,
      previewHeight = previewCanvas.height / 2
    const previewTransform = Transform({
      x: previewWidth,
      y: previewHeight,
      scale: Math.min(bubbletCanvas.width / 2, bubbletCanvas.height / 2),
    })

    // camera.drawThrough(previewCtx, drawLocalWithTransform, previewTransform)

    previewTransform.invertCanvas(previewCtx)
    drawLocalWithTransform(previewCtx, 2)
  }

  // Old drawLocal which uses passed transform
  // TODO: Clean up
  function drawLocalWithTransform(ctx, radius) {
    // Opacity for local draw is always 1, which is then
    // changed when drawing the offscreen canvas to the screen

    ctx.beginPath()

    let strokeWidth = 0.12
    let outlineRadius = radius - strokeWidth

    // if (playable) {
    //   if (hilighted) strokeWidth = 0.4
    //   else if (playable) strokeWidth = 0.2

    //   if (clickable.hovering) strokeWidth *= 2
    // }

    const cutsceneFrameSides = 8

    if (levelDatum.runAsCutscene) {
      ctx.rotate(((180 / cutsceneFrameSides) * Math.PI) / 180)
      ctx.beginPath()
      ctx.moveTo(outlineRadius, 0)

      for (var i = 1; i <= cutsceneFrameSides; i += 1) {
        ctx.lineTo(
          outlineRadius * Math.cos((i * 2 * Math.PI) / cutsceneFrameSides),
          outlineRadius * Math.sin((i * 2 * Math.PI) / cutsceneFrameSides),
        )
      }
    } else {
      ctx.arc(0, 0, outlineRadius, 0, Math.PI * 2)
    }

    ctx.lineWidth = strokeWidth

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#444' // Draw as unhighlighted for buffer

    ctx.save()

    ctx.fill()
    ctx.clip()

    if (levelDatum.runAsCutscene) {
      ctx.rotate((-(180 / cutsceneFrameSides) * Math.PI) / 180)
      ctx.drawImage(bubbletCanvas, -radius, -radius, radius * 2, radius * 2)
    } else {
      ctx.drawImage(bubbletCanvas, -radius, -radius, radius * 2, radius * 2)
    }

    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'hanging'
    ctx.font = '1px Roboto Mono'
    ctx.scale(0.8, 0.8)
    // ctx.fillText(levelDatum.name, 0, radius)

    ctx.restore()

    // ctx.globalAlpha = 1

    ctx.lineCap = 'butt'
    ctx.miterLimit = 20
    ctx.lineJoin = 'miter'

    ctx.beginPath()
    if (levelDatum.runAsCutscene) {
      ctx.beginPath()
      ctx.moveTo(outlineRadius + strokeWidth / 2 - 0.02, 0)

      for (var i = 1; i < cutsceneFrameSides; i += 1) {
        ctx.lineTo(
          (outlineRadius + strokeWidth / 2 - 0.02) *
            Math.cos((i * 2 * Math.PI) / cutsceneFrameSides),
          (outlineRadius + strokeWidth / 2 - 0.02) *
            Math.sin((i * 2 * Math.PI) / cutsceneFrameSides),
        )
      }
      ctx.closePath()
    } else {
      ctx.arc(0, 0, outlineRadius + strokeWidth / 2 - 0.02, 0, Math.PI * 2)
    }

    ctx.stroke()
  }

  function drawLocal() {
    const opacity = visible ? (playable ? 1 : 0.5) : 0
    ctx.globalAlpha = opacity

    ctx.drawImage(previewCanvas, -radius, -radius, radius * 2, radius * 2)

    // if (playable) {
    //   if (hilighted) strokeWidth = 0.4
    //   else if (playable) strokeWidth = 0.2

    //   if (clickable.hovering) strokeWidth *= 2
    // }

    if (playable && (hilighted || clickable.hovering)) {
      let strokeWidth = 0.24
      if (clickable.hovering) strokeWidth *= 1.5
      let outlineRadius = radius - 0.2

      ctx.lineWidth = strokeWidth

      ctx.fillStyle = '#fff'
      ctx.strokeStyle = hilighted ? '#f88' : '#444'

      const cutsceneFrameSides = 8

      ctx.beginPath()
      if (levelDatum.runAsCutscene) {
        ctx.beginPath()
        ctx.rotate(((180 / cutsceneFrameSides) * Math.PI) / 180)
        ctx.moveTo(outlineRadius + strokeWidth / 2 - 0.02, 0)

        for (var i = 1; i < cutsceneFrameSides; i += 1) {
          ctx.lineTo(
            (outlineRadius + strokeWidth / 2 - 0.02) *
              Math.cos((i * 2 * Math.PI) / cutsceneFrameSides),
            (outlineRadius + strokeWidth / 2 - 0.02) *
              Math.sin((i * 2 * Math.PI) / cutsceneFrameSides),
          )
        }
        ctx.closePath()
      } else {
        ctx.arc(0, 0, outlineRadius + strokeWidth / 2 - 0.02, 0, Math.PI * 2)
      }

      ctx.stroke()
    }
  }

  function refreshPlayable() {
    unlocked = _.every(requirements, 'completed')

    if (unlocked) {
      playable = true
      hilighted = !completed
    } else {
      playable = getShowAll()
      hilighted = false
    }

    visible = playable || _.some(requirements, (v) => v.playable)
  }

  function refreshArrows() {
    _.each(arrows, (v) => {
      v.opacity = visible
        ? playable
          ? 1
          : 0.5
        : v.fromBubble.visible
        ? 0.5
        : 0
      v.dashed = !v.toBubble.unlocked
      v.fadeIn = visible && !v.fromBubble.visible
      v.fadeOut = !visible && v.fromBubble.visible
    })
  }

  function intersectsScreen() {
    let center = transform.position

    let left = camera.lowerLeft.x - radius
    let right = camera.upperRight.x + radius
    let top = camera.upperRight.y + radius
    let bottom = camera.lowerLeft.y - radius

    return (
      center.x > left && center.x < right && center.y > bottom && center.y < top
    )
  }

  function draw() {
    if (!visible) return

    if (!intersectsScreen()) return

    levelBubblesDrawn++

    ctx.save()

    // Use drawLocal directly instead of passing
    // to camera to use rounded image coordinates
    camera.drawThrough(ctx, drawLocal, transform)

    ctx.restore()
  }

  function complete() {
    if (completed) return

    completed = true
    refreshPlayable()

    _.invokeEach(dependencies, 'refreshPlayable')
  }

  function linkRequirements() {
    for (let i = 0; i < requirements.length; i++) {
      let requiredBubble = getBubbleByNick(requirements[i])
      requiredBubble.dependencies.push(self)
      requirements[i] = requiredBubble
    }
  }

  function mouseDown(point) {
    // If not playable, then delegate to parent
    if (!playable) {
      parent.updatePanVelocity(point, clickable.holding)
    }
  }

  // TODO: Doesn't work if mouse is held on LevelBubble
  function hoverMove(point) {
    // If not playable, then delegate to parent
    if (!playable && clickable.holding) {
      parent.updatePanVelocity(point, clickable.holding)
    }
  }

  function click(point) {
    if (!playable) return

    ui.veil.setAttribute('hide', false)

    assets.sounds.enter_level.play()
    assets.sounds.map_zoom_in.play()

    completeAllRequirements()

    panCamera(transform.position, () => {
      setLevel(levelDatum.nick)
      ui.veil.setAttribute('hide', true)
    })
  }

  function completeAllRequirements() {
    for (requirement of requirements) {
      requirement.complete()
      requirement.completeAllRequirements()
    }

    refreshPlayable()
  }

  return self.mix({
    transform,
    clickable,

    start,
    startLate,
    awake,

    resize,

    tick,
    draw,

    render,

    mouseDown,
    hoverMove,

    click,

    dependencies,
    linkRequirements,

    refreshPlayable,
    refreshArrows,

    get nick() {
      return nick
    },

    get rendered() {
      return rendered
    },

    get completed() {
      return completed
    },
    get hilighted() {
      return hilighted
    },

    get playable() {
      return playable
    },
    get visible() {
      return visible
    },
    get unlocked() {
      return unlocked
    },

    complete,
    completeAllRequirements,
  })
}
