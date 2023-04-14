let assets, globalScope

function World(spec) {
  const self = Entity(spec, 'World')

  const { ui, screen, levelData, requestDraw, tickDelta, version } = spec

  const storage = PlayerStorage()

  let running = false
  let runTime = 0
  let completionTime = null

  const quads = {}

  globalScope = {
    customT: 0,

    get t() {
      return running ? runTime : globalScope.customT
    },

    get T() {
      return runTime
    },

    set runTime(_runTime) {
      runTime = _runTime
    },

    timescale: 1,
    get dt() {
      return tickDelta * globalScope.timescale
    },

    lerp: (a, b, t) => {
      t = math.clamp01(t)
      return a * (1 - t) + b * t
    },

    get running() {
      return running
    },

    get quads() {
      return quads
    },

    get completionTime() {
      return completionTime
    },
  }

  let navigating = false
  let editing = false

  function loadQuad() {
    quads.water = WaterQuad(assets)
    quads.sunset = SunsetQuad('(sin(x)-(y-2)*i)*i/2', assets)
    quads.volcano = VolcanoQuad(assets)
    quads.volcanoSunset = VolcanoSunsetQuad(
      '((sin(x)*i)/2)+(x/4)+((y*i)/5)',
      assets,
    )
    quads.lava = LavaQuad(assets)
  }

  assets = Assets({
    paths: spec.assets,
    callbacks: {
      complete: assetsComplete,
      progress: assetsProgress,
    },
  })

  const clickableContext = ClickableContext({
    entity: self,
  })

  let backgroundMusicAsset = null
  let backgroundMusicSound = null

  let navigator

  let level
  let levelDatum
  let levelBubble

  function start() {
    // Only show the level info if we're not in debug
    if (!window.location.hostname.endsWith('sinerider.com')) {
      ui.levelInfoDiv.setAttribute('hide', false)
      ui.hideLevelInfoButton.addEventListener('click', hideLevelInfoClicked)
    }
  }

  function tick() {
    if (!self.drawArrayIsUnsorted) self.sortDrawArray()
    if (
      window.innerHeight != screen.height ||
      window.innerWidth != screen.width
    )
      screen.resize()

    if (running) runTime += tickDelta
  }

  function draw() {
    levelBubblesDrawn = 0
  }

  function hideLevelInfoClicked() {
    ui.levelInfoDiv.setAttribute('hide', true)
  }

  function loadingVeilClicked() {
    ui.loadingVeil.setAttribute('hide', true)

    navigator = Navigator({
      ui,
      screen,
      assets,
      levelData,
      getEditing,
      setLevel,
      active: false,
      parent: self,
      drawOrder: LAYERS.navigator,
    })

    const url = new URL(location)

    if (url.search) {
      try {
        urlData = JSON.parse(LZString.decompressFromBase64(url.search.slice(1)))
        setLevel(urlData.nick, urlData)

        // Very stupid, maybe Navigator should just be instantiated after this block?
        const bubble = navigator.getBubbleByNick(urlData.nick)
        if (bubble) navigator.initialBubble = bubble

        return
      } catch (err) {
        console.error('Error loading url:', err)
        // TODO: Maybe switch to modal
        alert('Sorry, this URL is malformed :(')
      }
    }

    if (_.endsWith(location.href, '#random')) setLevel('RANDOM')
    else setLevel(levelData[0].nick)
  }

  function assetsComplete() {
    loadQuad()

    ui.loadingVeilString.innerHTML = 'click to begin'
    ui.loadingVeil.addEventListener('click', loadingVeilClicked)
  }

  function assetsProgress(progress, total) {
    ui.loadingVeilString.innerHTML = `loading…<br>${Math.round(
      (100 * progress) / total,
    )}%`
  }

  function setLevel(nick, urlData = null) {
    if (level) level.destroy()

    levelBubble = navigator.getBubbleByNick(nick)
    isPuzzle = urlData?.isPuzzle ?? false
    var savedLatex
    if (isPuzzle) {
        levelDatum = generatePuzzleLevel(urlData)
        savedLatex = levelDatum.expressionOverride ? levelDatum.expressionOverride : levelDatum.defaultExpression
    } else {
      if (nick == 'RANDOM') {
        levelDatum = generateRandomLevel()
      }
      else { 
        levelDatum = _.find(levelData, (v) => v.nick == nick)
      }
      savedLatex = urlData?.savedLatex ?? storage.getLevel(nick)?.savedLatex

      if (urlData?.goals && urlData?.goals.length)
        levelDatum.goals = (levelDatum.goals ?? []).concat(urlData?.goals)    
    }

    level = Level({
      ui,
      screen,
      assets,
      parent: self,
      name: levelDatum.nick,
      datum: levelDatum,
      globalScope,
      active: !navigating,
      levelCompleted,
      playBackgroundMusic,
      tickDelta,
      isBubbleLevel: false,
      world: self,

      storage,
      savedLatex,
      urlData,
    })

    level.playOpenMusic()
    level.restart()

    ui.levelText.value = levelDatum.name
    ui.levelButtonString.innerHTML = levelDatum.name

    ui.levelInfoNameStr.innerHTML = levelDatum.name
    ui.levelInfoNickStr.innerHTML = levelDatum.nick

    setNavigating(false)
  }

  function setNavigating(_navigating) {
    navigating = _navigating

    if (navigating) self.sendEvent('onToggleMap', [_navigating])

    editor.active = level.isEditor() && !navigating
    level.active = !navigating
    navigator.active = navigating

    if (!navigating) self.sendEvent('onToggleMap', [_navigating])

    ui.controlBar.setAttribute('hide', navigating)
    ui.navigatorFloatingBar.setAttribute('hide', !navigating)
    // ui.topBar.setAttribute('hide', navigating)

    if (navigating) {
      navigator.revealHighlightedLevels(levelDatum.nick)
      navigator.refreshBubbles()
      canvas.classList.add('map')
    } else {
      // ui.variablesBar.setAttribute('hide', true)
      canvas.classList.remove('map')

      navigator.showAll = false
      // if (navigator.showAllUsed)
      ui.showAllButton.setAttribute('hide', false)
    }
  }

  function makeTwitterSubmissionUrl() {
    return "https://twitter.com/intent/tweet?text=" + encodeURIComponent("#sinerider " + levelDatum.nick + " " + level.currentLatex.replace(/\s/g, ''))
  }

  function levelCompleted(soft = false) {
    setCompletionTime(runTime)

    const timeTaken = Math.round(runTime * 100) / 100
    const charCount = ui.mathFieldStatic.latex().length

    ui.timeTaken.innerHTML =
      timeTaken + ' second' + (timeTaken === 1 ? '' : 's')
    ui.charCount.innerHTML =
      charCount + ' character' + (charCount === 1 ? '' : 's')

    if (soft) {
      nextLevel(2.5)
    } else {
      ui.victoryBar.setAttribute('hide', false)
      ui.expressionEnvelope.setAttribute('hide', true)
      ui.showAllButton.setAttribute('hide', true)
    }

    const isPuzzle = true
    if ("isPuzzle" in levelDatum && levelDatum["isPuzzle"]) {
      ui.submitTwitterScoreDiv.setAttribute('hide', false)
      ui.submitTwitterScoreLink.setAttribute('href', makeTwitterSubmissionUrl())
    } else {
      ui.submitTwitterScoreDiv.setAttribute('hide', true)
    }
    levelBubble?.complete()
  }

  function transitionNavigating(_navigating, duration = 1, cb) {
    ui.veil.setAttribute('style', `transition-duration: ${duration}s;`)
    ui.veil.setAttribute('hide', false)

    if (_navigating) self.sendEvent('onLevelFadeOut', [_navigating, duration])
    else self.sendEvent('onMapFadeOut', [_navigating, duration])

    setTimeout(() => {
      // HACK: to fix camera flicker
      setTimeout(() => {
        ui.veil.setAttribute('style', `transition-duration: ${1}s;`)
        ui.veil.setAttribute('hide', true)
      }, 100)
      setNavigating(_navigating)

      if (_navigating) self.sendEvent('onMapFadeIn', [_navigating, duration])
      else self.sendEvent('onLevelFadeIn', [_navigating, duration])

      if (cb) cb()
    }, duration * 1000)
  }

  function nextLevel(transitionDuration = 1) {
    transitionNavigating(true, transitionDuration, () => {
      stopRunning(false)
    })
  }

  function onClickNextButton() {
    assets.sounds.next_button.play()
    nextLevel()
  }

  function getEditing() {
    return editing
  }

  function setEditing(_editing) {
    editing = _editing
  }

  function startRunning(
    playSound = true,
    hideNavigator = true,
    disableExpressionEditing = true,
  ) {
    running = true
    setCompletionTime(null)

    ui.mathField.blur()
    ui.expressionEnvelope.setAttribute('disabled', disableExpressionEditing)
    ui.menuBar.setAttribute('hide', true)

    ui.runButton.setAttribute('hide', true)
    ui.stopButton.setAttribute('hide', false)
    if (hideNavigator) ui.navigatorButton.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', true)
    ui.tryAgainButton.setAttribute('hide', true)

    if (playSound) assets.sounds.start_running.play()

    self.sendEvent('startRunning', [])

    requestDraw()
  }

  function setCompletionTime(t) {
    completionTime = t
    ui.completionTime.innerHTML = t
  }

  function stopRunning(playSound = true) {
    runTime = 0
    running = false
    setCompletionTime(null)

    ui.mathField.blur()
    ui.expressionEnvelope.setAttribute('disabled', false)
    ui.menuBar.setAttribute('hide', false)
    ui.victoryBar.setAttribute('hide', true)

    ui.controlBar.setAttribute('hide', navigating)
    ui.navigatorButton.setAttribute('hide', false)
    ui.expressionEnvelope.setAttribute('hide', false)
    ui.runButton.setAttribute('hide', false)
    ui.tryAgainButton.setAttribute('hide', true)
    ui.stopButton.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', false)

    if (!navigating) {
      // HACK: Timed to avoid bug in Safari (at least) that causes whole page to be permanently offset when off-screen text input is focused
      setTimeout(() => ui.expressionText.focus(), 250)
    }

    if (playSound) assets.sounds.stop_running.play()

    self.sendEvent('stopRunning', [])

    requestDraw()
  }

  function toggleRunning() {
    if (running) stopRunning()
    else startRunning()
  }

  function generateRandomLevel() {
    const goalCount = _.random(2, 5)
    const goals = []

    for (let i = 0; i < goalCount; i++) {
      const goalPosition = {}

      do {
        goalPosition.x = _.random(-10, 10)
        goalPosition.y = _.random(-10, 10)
      } while (
        _.find(goals, (v) => v.x == goalPosition.x && v.y == goalPosition.y)
      )

      goals.push(goalPosition)
    }

    const sledderCount = 1
    const sledders = []

    for (let i = 0; i < sledderCount; i++) {
      let sledderX

      do {
        sledderX = _.random(-10, 10)
      } while (
        _.find(goals, (v) => v.x == sledderX) ||
        _.find(sledders, (v) => v.x == sledderX)
      )

      sledders.push({ x: sledderX })
    }

    const biomes = _.values(Colors.biomes)

    return {
      name: 'Random Level',
      nick: 'RANDOM',
      drawOrder: LAYERS.level,
      x: -10,
      y: 0,
      colors: biomes[_.random(0, biomes.length)],
      defaultExpression: '0',
      hint: 'Soft eyes, grasshopper.',
      goals,
      sledders,
    }
  }

  function generatePuzzleLevel(urlData) {
    return {
      isPuzzle: true,
      name: urlData.name,
      nick: urlData.nick,
      drawOrder: LAYERS.level,
      slider:urlData.slider,
      x: urlData.x,
      y: urlData.y,
      biome: urlData.biome,
      colors: urlData.colors,
      defaultExpression: urlData.defaultExpression,
      expressionOverride: urlData.expressionOverride,
      hint: urlData.hint,
      goals: urlData.goals,
      sledders: urlData.sledders,
      sprites: urlData.sprites
    }
  }

  function playBackgroundMusic(datum, level) {
    let asset

    if (!_.isObject(datum)) datum = { asset: datum }

    asset = datum.asset

    if (asset == backgroundMusicAsset) return

    if (backgroundMusicSound != null) {
      backgroundMusicSound.fadeDestroy()
      backgroundMusicAsset = null
      backgroundMusicSound = null
    }

    if (asset == null) return

    backgroundMusicAsset = asset
    backgroundMusicSound = Sound({
      asset,
      assets,
      level,
      name: 'Sound ' + asset,
      parent: self,
      loop: true,
      fadeOnNavigating: false,
      ...datum,
    })

    console.log(`Playing sound ${backgroundMusicAsset}`)
  }

  function onClickMapButton() {
    transitionNavigating(!navigating)
    assets.sounds.map_button.play()
  }

  function onResetConfirm() {
    level.restart()
    assets.sounds.restart_button.play()
  }

  function onMathFieldFocus() {
    self.sendEvent('mathFieldFocused')
  }

  function onMathFieldBlur() {
    self.sendEvent('mathFieldBlurred')
  }

  function onGridlinesDeactive() {
    self.sendEvent('disableGridlines')
  }
  function onGridlinesActive() {
    self.sendEvent('enableGridlines')
  }
  function onCoordinate(x, y) {
    self.sendEvent('setCoordinates', [x, y])
  }

  return self.mix({
    start,
    tick,
    draw,

    globalScope,

    _startRunning: startRunning,
    _stopRunning: stopRunning,
    toggleRunning,

    nextLevel,
    setLevel,

    clickableContext,

    setNavigating,
    transitionNavigating,

    onClickMapButton,
    onResetConfirm,
    onClickNextButton,

    onMathFieldFocus,
    onMathFieldBlur,

    onGridlinesActive,
    onGridlinesDeactive,
    onCoordinate,

    get navigator() {
      return navigator
    },
    get running() {
      return running
    },

    get editing() {
      return editing
    },
    set editing(v) {
      setEditing(v)
    },

    get level() {
      return level
    },

    get navigating() {
      return navigating
    },
    set navigating(v) {
      setNavigating(v)
    },
  })
}
