let assets, globalScope
let arrowsDrawn = 0,
  _arrowsDrawn

function World(spec) {
  const self = Entity(spec, 'World')

  const { ui, screen, levelData, requestDraw, tickDelta, version } = spec

  const playerStorage = PlayerStorage()

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
    if (self.drawArrayIsUnsorted) self.sortDrawArray()
    if (
      window.innerHeight != screen.height ||
      window.innerWidth != screen.width
    )
      screen.resize()

    if (running) runTime += tickDelta
  }

  function draw() {
    levelBubblesDrawn = 0
    _arrowsDrawn = arrowsDrawn
    arrowsDrawn = 0
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
      playerStorage,
      active: false,
      parent: self,
      drawOrder: LAYERS.navigator,
    })

    const url = new URL(location)

    if (url.search) {
      try {
        urlData = JSON.parse(LZString.decompressFromBase64(url.search.slice(1)))
        setLevel(urlData.nick, urlData)
        // hide map if it's a puzzle
        if (world.level.name.includes('puzzle'))
          ui.navigatorButton.setAttribute('hide', true)

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
    else setLevel(playerStorage.activeLevel ?? levelData[0].nick)
  }

  function assetsComplete() {
    loadQuad()

    // Remove the loading bar
    ui.loadingProgressBarContainer.setAttribute('hide', true)

    ui.loadingVeilString.innerHTML = 'click to begin'
    ui.loadingVeil.addEventListener('click', loadingVeilClicked)

    const c = playerStorage.getCompletedLevels().length
    const total = levelData.length
    const percent = Math.round((100 * c) / total)
    const congrats = percent < 100 ? '' : 'well done, '
    if (c) {
      ui.resetSolutionsString.setAttribute('hide', false)
      ui.resetSolutionsString.innerHTML = `You have completed ${c}/${total} levels (${congrats}${percent}%). Reset?`
      ui.resetSolutionsString.addEventListener('click', (event) => {
        ui.resetProgressConfirmationDialog.showModal(), event.stopPropagation()
      })
      ui.resetProgressConfirmButton.addEventListener('click', (event) => {
        resetSavedSolutions()
        ui.resetProgressConfirmationDialog.close()
      })
      ui.resetProgressCancelButton.addEventListener('click', (event) => {
        ui.resetProgressConfirmationDialog.close()
        event.stopPropagation()
      })
    }
  }

  function resetSavedSolutions(event) {
    ui.resetSolutionsString.remove()
    playerStorage.clear()
  }

  function assetsProgress(progress, total) {
    const percent = Math.round((100 * progress) / total)
    ui.loadingProgressBar.style.width = `${percent}%`
  }

  function setLevel(nick, urlData = null) {
    if (level) level.destroy()

    levelBubble = navigator.getBubbleByNick(nick)
    isPuzzle = urlData?.isPuzzle ?? false
    let savedLatex
    let completed = false
    if (isPuzzle) {
      levelDatum = generatePuzzleLevel(urlData)
      savedLatex = levelDatum.expressionOverride
        ? levelDatum.expressionOverride
        : levelDatum.defaultExpression
    } else {
      if (nick == 'RANDOM') {
        levelDatum = generateRandomLevel()
      } else {
        levelDatum = _.find(levelData, (v) => v.nick == nick)
      }
      savedLatex =
        urlData?.savedLatex ?? playerStorage.getLevel(nick)?.savedLatex
      completed =
        urlData?.completed ?? playerStorage.getLevel(nick)?.completed ?? false

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

      storage: playerStorage,
      savedLatex,
      completed,
      urlData,
    })

    level.playOpenMusic()
    level.restart()

    if (ui.levelText) {
      ui.levelText.value = levelDatum.name
      ui.levelButtonString.innerHTML = levelDatum.name

      ui.levelInfoNameStr.innerHTML = levelDatum.name
      ui.levelInfoNickStr.innerHTML = levelDatum.nick
    }

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
    const linkToPuzzle = `https://sinerider.com/puzzle/${levelDatum.nick}`
    const solution = ui.mathField.getPlainExpression().replace(/\s/g, '')
    const twitterPrefill = `#${levelDatum.nick} My solution for the #sinerider puzzle of the day took ${Math.round(timeTaken() * 10) / 10} seconds & ${charCount()} characters
    
    ${solution}
    
    Try solving it yourself: ${linkToPuzzle}`
    return (
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterPrefill)}`
    )
    // @msw: While implementing a quick-fix, the following is a noop
    return (
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(
        'I did it! #sinerider ' +
          levelDatum.nick +
          ' ' +
          level.currentLatex.replace(/\s/g, ''),
      )
    )
  }

  function openRedditModal() {
    ui.redditOpenModal.setAttribute('hide', false)
    let text = `#sinerider ${levelDatum.nick} \`${level.currentLatex.replace(
      /\s/g,
      '',
    )}\``
    ui.redditOpenCommand.setAttribute('value', text)
    // It would be nice to use this, but it doesn't work for whatever reason
    // navigator.clipboard.writeText(text)
    ui.redditOpenCommand.select()
    document.execCommand('copy')
  }

  function charCount() {
    return ui.mathFieldStatic.latex().length
  }

  function timeTaken() {
    return Math.round(runTime * 100) / 100
  }

  function levelCompleted(soft = false) {
    setCompletionTime(runTime)

    ui.timeTaken.innerHTML =
      timeTaken() + ' second' + (timeTaken() === 1 ? '' : 's')
    ui.charCount.innerHTML =
      charCount() + ' character' + (charCount() === 1 ? '' : 's')

    if (soft) {
      nextLevel(2.5)
    } else {
      ui.victoryBar.setAttribute('hide', false)
      ui.expressionEnvelope.setAttribute('hide', true)
      ui.showAllButton.setAttribute('hide', true)
    }

    const isPuzzle = true
    if ('isPuzzle' in levelDatum && levelDatum['isPuzzle']) {
      // hide next button
      ui.nextButton.setAttribute('hide', true)

      const puzzleMsgs = document.getElementsByClassName('puzzle-msg')
      for (let idx = 0; idx < puzzleMsgs.length; idx++) {
        puzzleMsgs[idx].setAttribute('hide', false)
      }

      $('#twitter-submission-url').setAttribute(
        'href',
        makeTwitterSubmissionUrl(),
      )

      // Hide reddit for the time being
      // console.log($('#submit-reddit-score'))
      // $('#submit-reddit-score').onclick = openRedditModal

      ui.redditOpenCloseButton.onclick = () =>
        ui.redditOpenModal.setAttribute('hide', true)
    } else {
      ui.submitTwitterScoreDiv?.setAttribute('hide', true)
      ui.submitRedditScoreDiv?.setAttribute('hide', true)
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
    if ('isPuzzle' in levelDatum && levelDatum['isPuzzle']) {
      ui.victoryBar.setAttribute('hide', true)
      stopRunning(false)
      level.restart()
    } else {
      transitionNavigating(true, transitionDuration, () => {
        stopRunning(false)
      })
    }
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
    ui.expressionEnvelope.setAttribute('hide', false)
    ui.runButton.setAttribute('hide', false)
    ui.tryAgainButton.setAttribute('hide', true)
    ui.stopButton.setAttribute('hide', true)
    ui.resetButton.setAttribute('hide', false)

    if (!level.name.startsWith('puzzle_'))
      ui.navigatorButton.setAttribute('hide', false)

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
    const goals = []
    // Skew towards 3-goal levels, with potential for as many as 7
    const goalCount = _.random(_.random(2, 3), _.random(3, 7))

    // Generate goals at random locations
    for (let i = 0; i < goalCount; i++) {
      let x = 0
      let y = 0

      const type = Math.random() < 1 / (goalCount + 1) ? 'dynamic' : 'fixed'

      do {
        x = _.random(-16, 16)
        y = _.random(-12, 12)
      } while (
        _.find(goals, (v) => {
          const d = Math.sqrt(Math.pow(x - v.x, 2) + Math.pow(y - v.y, 2))

          if (type == 'dynamic' && v.type == 'dynamic') {
            if (Math.abs(v.x - x) < 1.5) return true
          } else if (type == 'dynamic' || v.type == 'dynamic') {
            if (Math.abs(v.x - x) < 1.5) return true
          } else {
            if (d <= 1.9) return true
          }
        })
      )

      goals.push({
        x,
        y,
        type,
      })
    }

    // Apply ordering to goals
    {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

      const ordered =
        Math.random() < 0.5 ||
        _.filter(goals, (v) => v.type == 'dynamic').length > 1
      const orderCount = !ordered ? 0 : Math.max(2, _.random(0, goalCount))

      let i = 0
      let a = [...goals]
      while (i < orderCount) {
        i++

        a = _.shuffle(a)
        const v = a.pop()

        if (alphabet[0] == 'A' && i == orderCount) v.order = 'B'
        else if (Math.random() < 0.5) v.order = alphabet[0]
        else v.order = alphabet.shift()
      }
    }

    // Guarantee that there is never more than one unordered dynamic goal
    {
      let unorderedDynamicGoals = 0
      for (goal of goals) {
        if (goal.type == 'dynamic') {
          if (unorderedDynamicGoals > 0) goal.type = 'fixed'
          unorderedDynamicGoals++
        }
      }
    }

    const sledderCount =
      goalCount > 2 && Math.random() < 0.5 ? _.random(1, 2) : 1
    const sledders = []
    const sledderAssets = [
      'images.ada_sled',
      'images.jack_sled',
      'images.ada_jack_sled',
    ]

    for (let i = 0; i < sledderCount; i++) {
      let sledderX

      do {
        sledderX = _.random(-16, 16)
      } while (
        _.find(goals, (v) => Math.abs(v.x - sledderX) < 1.5) ||
        _.find(sledders, (v) => Math.abs(v.x - sledderX) < 3.5)
      )

      sledders.push({
        x: sledderX,
        asset: sledderCount == 1 ? _.sample(sledderAssets) : sledderAssets[i],
      })
    }

    const biome = _.sample([
      'westernSlopes',
      'valleyParabola',
      'eternalCanyon',
      'sinusoidalDesert',
      'logisticDunes',
      'hilbertDelta',
    ])

    return {
      name: 'Random Level',
      nick: 'RANDOM',
      drawOrder: LAYERS.level,
      x: -10,
      y: 0,
      defaultExpression: '0',
      goals,
      sledders,
      biome,
    }
  }

  function generatePuzzleLevel(urlData) {
    return {
      isPuzzle: true,
      name: urlData.name,
      nick: urlData.nick,
      drawOrder: LAYERS.level,
      slider: urlData.slider,
      x: urlData.x,
      y: urlData.y,
      biome: urlData.biome,
      colors: urlData.colors,
      defaultExpression: urlData.defaultExpression,
      expressionOverride: urlData.expressionOverride,
      hint: urlData.hint,
      goals: urlData.goals,
      sledders: urlData.sledders,
      sprites: urlData.sprites,
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
