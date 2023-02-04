function LevelBubble(spec) {
  const { ui, self, screen, camera, assets } = Entity(spec, 'LevelBubble')

  const {
    setLevel,
    waypointDirector,
    levelDatum,
    getEditing,
    tickDelta,
    getBubbleByNick,
    getShowAll,
    quad,
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

  let bubbletPixels = 512
  bubbletCanvas.width = bubbletPixels
  bubbletCanvas.height = bubbletPixels

  ui.bubblets.appendChild(bubbletCanvas)
  const bubbletScreen = Screen({
    canvas: bubbletCanvas,
    element: bubbletCanvas,
  })

  const bubbletCamera = Camera({
    screen: bubbletScreen,
  })

  let bubbletLevel = Level({
    datum: levelDatum,
    screen: bubbletScreen,
    camera: bubbletCamera,
    globalScope: bubbletGlobalScope,
    parent: self,
    useDragCamera: false,
    isBubbleLevel: true,
    drawOrder: LAYERS.levelBubbles,
  })

  bubbletLevel.sendEvent('draw')
  bubbletLevel.active = false

  bubbletLevel.destroy()

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
        drawOrde: LAYERS.arrows,
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

  function drawLocal() {
    const opacity = visible ? (playable ? 1 : 0.5) : 0
    ctx.globalAlpha = opacity

    ctx.beginPath()

    let strokeWidth = 0.2

    if (playable) {
      if (hilighted) strokeWidth = 0.4
      else if (playable) strokeWidth = 0.2

      if (clickable.hovering) strokeWidth *= 2
    }

    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.lineWidth = strokeWidth

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = hilighted ? '#f88' : '#444'

    ctx.save()

    ctx.fill()
    ctx.clip()
    ctx.drawImage(bubbletCanvas, -radius, -radius, radius * 2, radius * 2)

    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'hanging'
    ctx.font = '1px Roboto Mono'
    ctx.scale(0.8, 0.8)
    // ctx.fillText(levelDatum.name, 0, radius)

    ctx.restore()

    // ctx.globalAlpha = 1

    ctx.beginPath()
    ctx.arc(0, 0, radius + strokeWidth / 2 - 0.02, 0, Math.PI * 2)

    ctx.stroke()
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

    // visible = playable || _.some(requirements, v => v.playable)
    visible = true //TODO: implement gradient fade for invisible unmet requirements. Until then, inaccessible levels will always be shown.

    const opacity = visible ? (playable ? 1 : 0.5) : 0

    _.each(arrows, (v) => {
      v.opacity = opacity
      v.dashed = !v.toBubble.unlocked
    })
  }

  function draw() {
    camera.drawThrough(ctx, drawLocal, transform)
    ctx.globalAlpha = 1
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

  function click(point) {
    if (!playable) return

    ui.veil.setAttribute('hide', false)

    assets.sounds.enter_level.play()
    assets.sounds.map_zoom_in.play()

    completeAllRequirements()

    waypointDirector.moveTo(
      null,
      {
        position: transform.position,
        fov: radius * 2,
      },
      1,
      () => {
        setLevel(levelDatum.nick)
        ui.veil.setAttribute('hide', true)
      },
    )
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

    tick,
    draw,

    click,

    level: bubbletLevel,

    dependencies,
    linkRequirements,

    refreshPlayable,

    get nick() {
      return nick
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
