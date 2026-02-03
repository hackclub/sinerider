let assets, globalScope
let arrowsDrawn = 0,
  _arrowsDrawn,
  originalAssets

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

    get completionTime() {
      return completionTime
    },
  }

  let navigating = false
  let editing = false

  let sampleDensitySetting
  let terrainLayersSetting

  const clickableContext = ClickableContext({
    entity: self,
    screen /* Pass screen for downsampling ratio */,
  })

  let backgroundMusicAsset = null
  let backgroundMusicSound = null

  let navigator

  let level
  let levelDatum
  let levelBubble

  // Preprocess all level datums at start (TODO: Make lazy?)
  levelData.map(preprocessDatum)

  // Get first level datum, load general + level-specific assets,
  // wait and then set level
  originalAssets = _.cloneDeep(spec.assets)

  assets = Assets()

  const urlData = getUrlData()
  const firstLevelNick = getFirstLevelNick(urlData)
  const firstLevelDatum = getLevelDatum(firstLevelNick, urlData)
  if (!firstLevelDatum) {
    // TODO: Clean up error handling
    alert(`Level specified ('${firstLevelNick}') doesn\'t exist :(`)
  }

  _.merge(spec.assets, firstLevelDatum.assets)

  // Loading veil, loading bar handled by assets
  assets.load(spec.assets, assetsComplete)

  function start() {
    // Only show the level info if we're not in debug
    if (!window.location.hostname.endsWith('sinerider.com')) {
      ui.levelInfoDiv.setAttribute('hide', false)
      ui.hideLevelInfoButton.addEventListener('click', hideLevelInfoClicked)
    }
  }

  function loadWebGLQuads() {
    quads.water = WaterQuad(assets)
    quads.sunset = ConstantLakeSunsetQuad('(sin(x)-(y-2)*i)*i/2', assets)
    quads.volcanoSunset = VolcanoSunsetQuad(
      '((sin(x)*i)/2)+(x/4)+((y*i)/5)',
      assets,
    )
    quads.lava = LavaQuad(assets)
  }

  function renderEntityToImage(
    width,
    height,
    entityGenerator,
    entityDatum = {},
    fov = 1,
  ) {
    const canvas = document.createElement('canvas')

    canvas.width = width * 2
    canvas.height = height * 2

    const screen = Screen({
      canvas,
      element: canvas,
      alpha: true,
    })

    const camera = Camera({
      screen,
      fov,
    })

    const entity = entityGenerator({
      ...entityDatum,
      camera,
      screen,
    })

    entity.sendEvent('tick')
    entity.sendEvent('awake')
    entity.sendEvent('start')
    entity.sendEvent('tick')
    entity.sendEvent('draw')
    entity.destroy()

    return canvas
  }

  function renderAndAddSpawnerButtons() {
    // Add path goal
    const pathGoalImage = renderEntityToImage(
      90,
      45,
      PathGoal,
      {
        parent: self,
        assets,
        globalScope,
        drawOrder: LAYERS.goals,
        world,
        goalCompleted: () => {},
        goalFailed: () => {},
        goalDeleted: () => {},
        x: -2,
      },
      1.5,
    )

    ui.editorSpawner.addPath.appendChild(pathGoalImage)

    // Add fixed goal
    const fixedGoalImage = renderEntityToImage(
      64,
      45,
      FixedGoal,
      {
        parent: self,
        assets,
        globalScope,
        drawOrder: LAYERS.goals,
        world,
        goalCompleted: () => {},
        goalFailed: () => {},
        goalDeleted: () => {},
      },
      0.6,
    )

    ui.editorSpawner.addFixed.appendChild(fixedGoalImage)

    // Add dynamic goal
    const dynamicGoalImage = renderEntityToImage(
      64,
      45,
      DynamicGoal,
      {
        parent: self,
        // HACK: Pass height to dynamic goal via graph
        graph: {
          sample: () => -0.5,
          sampleSlope: () => 0,
        },
        assets,
        globalScope,
        drawOrder: LAYERS.goals,
        world,
        goalCompleted: () => {},
        goalFailed: () => {},
        goalDeleted: () => {},
        y: 1,
      },
      0.6,
    )

    ui.editorSpawner.addDynamic.appendChild(dynamicGoalImage)
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

  function getSavedLatexFromURL(urlData) {
    const isPuzzle = urlData?.isPuzzle ?? false

    if (isPuzzle) {
      return levelDatum.expressionOverride
        ? levelDatum.expressionOverride
        : levelDatum.defaultExpression
    } else {
      return urlData?.savedLatex ?? playerStorage.getLevel(nick)?.savedLatex
    }
  }

  function preprocessDatum(datum) {
    // Reuse datum across levels/bubbles
    if (datum._preprocessed) return

    // Add biome defaults + required assets
    const biomeName = datum.biome ?? 'westernSlopes'
    const biome = BIOMES[biomeName]
    _.defaults(datum, biome)
    if (biome.assets) _.merge(datum.assets, biome.assets)

    // Expand `dialogue` array to individual speech objects
    const dialogue = datum.dialogue
    const walkers = datum.walkers ?? []
    const allWalkers = [
      ...walkers,
      ..._.flatten(
        walkers.map((v) =>
          _.isArray(v.walkers)
            ? v.walkers
            : _.isObject(v.walkers)
            ? [v.walkers]
            : [],
        ),
      ),
    ]

    if (dialogue) {
      for (const line of dialogue) {
        if (!line.speaker) {
          throw new Error(
            `Line of dialogue '${line.content}' has no speaker specified in level '${datum.name}'`,
          )
        }
        const speaker = allWalkers.find((walker) => walker.name == line.speaker)
        if (!speaker) {
          throw new Error(
            `Tried to add line of dialogue for unknown speaker '${line.speaker}' in level '${datum.name}'`,
          )
        }

        // Add default length and gap values
        if (_.isUndefined(line.domain)) {
          if (_.isUndefined(line.length)) line.length = 3
          if (_.isUndefined(line.gap)) line.gap = 2
        }

        // Add default positions
        if (line.speaker == 'Ada') {
          if (_.isUndefined(line.x)) line.x = 0
          if (_.isUndefined(line.y)) line.y = 0.7
        } else if (line.speaker == 'Jack') {
          if (_.isUndefined(line.x)) line.x = 0
          if (_.isUndefined(line.y)) line.y = 0.8
        }

        if (!speaker.speech) speaker.speech = []
        speaker.speech.push(line)
      }

      let previous = null

      for (const line of dialogue) {
        if (line.length) {
          if (line.domain) {
            throw new Error(
              `Tried to set length of line of dialogue in level '${datum.name}' with existing domain`,
            )
          }

          // Hard-coded assumption that the speaker we care about is the first one.
          // We only support a single top-level walker anyway…
          const speaker = walkers[0]

          // By default start at speaker x
          const endOfLastLine =
            (previous && previous.domain && previous.domain[1]) || speaker.x
          const start = endOfLastLine + line.gap
          const domain = [start, start + line.length]
          line.domain = domain
        }

        previous = line
      }
    }

    // Also split up processed speech bubbles with \n
    for (const walker of walkers) {
      if (!walker.speech) continue

      const newLines = []
      const removeIndices = []

      for (let i = 0; i < walker.speech.length; i++) {
        const speech = walker.speech[i]
        const content = speech.content
        if (!content) continue
        let lines = content.split('\n')
        if (lines.length > 0) {
          removeIndices.push(i)
          let previous = null
          for (let line of lines) {
            const newSpeech = _.cloneDeep(speech)
            newSpeech.content = line
            newSpeech.distance =
              ((previous && previous.distance) || lines.length * 0.4 + 1.1) -
              0.4
            if (!newSpeech.content)
              console.log(
                'adding new lines',
                newLines.filter((line) => line.content == null),
                newSpeech,
              )
            newLines.push(newSpeech)
            previous = newSpeech
          }
        }
      }

      for (let i = removeIndices.length; i--; i >= 0) {
        walker.speech.splice(removeIndices[i], 1)
      }

      walker.speech = walker.speech.concat(newLines)
    }

    datum._preprocessed = true
  }

  function getLevelDatum(nick, urlData = null) {
    let levelDatum

    isPuzzle = urlData?.isPuzzle ?? false

    // Ensure URL Data is, at minimum, an empty object instead of an unqueryable null. Needs to be explicitly redefined because sometimes null is explicitly passed.
    if (urlData == null) urlData = {}

    if (isPuzzle) {
      levelDatum = generatePuzzleLevel(urlData)
      savedLatex = levelDatum.expressionOverride
        ? levelDatum.expressionOverride
        : levelDatum.defaultExpression
    } else {
      if (nick == 'RANDOM') {
        levelDatum = generateRandomLevel()
      } else if (nick == 'CUSTOM_LEVEL') {
        // console.log('Custom Level URL Data:', urlData)
        levelDatum = {
          nick,
          goals: urlData.goals ?? [],
          sledders: urlData.sledders ?? [],
          defaultExpression: urlData.defaultExpression ?? '0',
          biome: urlData.biome ?? 'westernSlopes',
        }

        // Load assets from the specific biome specified in the URL data
        if (urlData.biome) _.mixIn(levelDatum, BIOMES[urlData.biome])

        // console.log('Custom Level Datum:', levelDatum)
      } else if (nick == 'LEVEL_EDITOR') {
        // console.log('Level Editor URL Data:', urlData)
        levelDatum = {
          nick,
        }

        // Mix in EDITOR level properties from editor.js
        _.mixIn(levelDatum, EDITOR[0])

        // Mix in any overrides contained in url data
        _.mixIn(levelDatum, urlData)

        // Mix in any specific properties associated with this biome
        if (urlData.biome) _.mixIn(levelDatum, BIOMES[urlData.biome])

        // But still guarantee that all assets required for all biomes are loaded to editor
        levelDatum.assets = EDITOR[0].assets

        // console.log('Level Editor Datum:', levelDatum)
      } else {
        levelDatum = _.find(levelData, (v) => v.nick == nick)
      }
    }

    return levelDatum
  }

  function getUrlData() {
    const url = new URL(location)

    if (url.search) {
      try {
        const urlData = JSON.parse(
          LZString.decompressFromBase64(url.search.slice(1)),
        )
        return urlData
      } catch (err) {
        console.error('Error loading url:', err)
        // TODO: Maybe switch to modal
        alert('Sorry, this URL is malformed :(')
      }
    }

    return null
  }

  function getFirstLevelNick(urlData) {
    if (IS_DEVELOPMENT && DEBUG_LEVEL_NICK) return DEBUG_LEVEL_NICK
    if (urlData?.nick) return urlData.nick
    if (_.endsWith(location.href, '#random')) return 'RANDOM'
    else if (
      playerStorage.activeLevel &&
      _.find(levelData, (v) => v.nick == playerStorage.activeLevel)
    )
      return playerStorage.activeLevel
    else return levelData[0].nick
  }

  function assetsComplete() {
    // Show loading veil again for click
    ui.loadingVeil.setAttribute('hide', false)

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

  function loadingVeilClicked() {
    ui.loadingVeil.setAttribute('hide', true)

    // TODO: Encapsulate loading veil click vs. loading
    ui.loadingVeilString.innerHTML = ''
    ui.loadingVeil.removeEventListener('onclick', loadingVeilClicked)

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
      world: self,
      drawOrder: LAYERS.navigator,
    })
    navigator.active = false

    const startingBubble = navigator.getBubbleByNick(firstLevelNick)
    navigator.initialBubble = startingBubble

    // Set misc. page settings (e.g. volume)
    initPageState()

    renderAndAddSpawnerButtons()

    setLevel(firstLevelNick, urlData)
  }

  function resetSavedSolutions() {
    ui.resetSolutionsString.remove()
    playerStorage.clear()
  }

  function assetsProgress(progress, total) {
    const percent = Math.round((100 * progress) / total)
    ui.loadingProgressBar.style.width = `${percent}%`
  }

  function setLevel(nick, urlData = null) {
    if (level) level.destroy()

    emitEvent('setLevel', {
      event_category: nick.toLowerCase().startsWith('puzzle_')
        ? 'daily'
        : 'campaign',
      value: nick,
    })

    // Don't bother recalculating level datum if first
    levelDatum =
      nick === firstLevelNick ? firstLevelDatum : getLevelDatum(nick, urlData)

    levelBubble = navigator.getBubbleByNick(nick)

    let savedLatex

    const isPuzzle = urlData?.isPuzzle ?? false

    if (isPuzzle) {
      savedLatex = levelDatum.expressionOverride
        ? levelDatum.expressionOverride
        : levelDatum.defaultExpression
    } else {
      savedLatex =
        urlData?.savedLatex ?? playerStorage.getLevel(nick)?.savedLatex
    }

    const generator =
      {
        CONSTANT_LAKE: ConstantLake,
        VOLCANO: Volcano,
        DESERT: Desert,
        LEVEL_EDITOR: LevelEditor,
        CREDITS: Credits,
      }[levelDatum.nick] || Level

    const completed =
      urlData?.completed ?? playerStorage.getLevel(nick)?.completed ?? false

    level = generator({
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
      quads,

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
      ui.nextButtonText.innerHTML = levelDatum.name == "Level Editor" ? "Exit" : "Next"
    }

    setNavigating(false)
  }

  function setNavigating(_navigating) {
    // TODO: Either collect assets needed for level bubbles (backgrounds)
    // load and wait, or generate small 512x512 backgrounds for level bubbles
    // (GitHub action?)
    navigating = _navigating

    if (navigating) self.sendEvent('onToggleMap', [_navigating])

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
    const twitterPrefill = `#${
      levelDatum.nick
    } My solution for the #sinerider puzzle of the day took ${
      Math.round(timeTaken() * 10) / 10
    } seconds & ${charCount()} characters
    ${solution}

    Try solving it yourself: ${linkToPuzzle}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterPrefill,
    )}`
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
    ui.redditOpenCommand.setAttribute('hide', false)
    $('#submit-reddit-score-subreddit').setAttribute('hide', false)

    let text = `#sinerider ${levelDatum.nick} \`${level.currentLatex.replace(
      /\s/g,
      '',
    )}\``
    $('#submit-reddit-score-subreddit').setAttribute(
      'href',
      `https://sinerider.com/reddit/${levelDatum.nick}`,
    )
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

    emitEvent('levelCompleted', {
      event_category: level.name.toLowerCase().startsWith('puzzle_')
        ? 'daily'
        : 'campaign',
      value: level.name,
    })

    ui.timeTaken.innerHTML =
      timeTaken() + ' second' + (timeTaken() === 1 ? '' : 's')
    ui.charCount.innerHTML =
      charCount() + ' character' + (charCount() === 1 ? '' : 's')

    if (soft) {
      nextLevel(2.5)
    } else {
      ui.victoryBar.setAttribute('hide', false)
      ui.expressionEnvelope.setAttribute('hide', true)
      // Disabled this behavior because it's just too annoying when trying to show the game to people, and it kinda feels like a bug.
      // So now the "Show All" button will always be visible.
      // ui.showAllButton.setAttribute('hide', true)
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
      $('#submit-reddit-score').onclick = openRedditModal

      ui.redditOpenCloseButton.onclick = () =>
        ui.redditOpenModal.setAttribute('hide', true)
    } else {
      // TODO: Causing error… commenting for now
      // ui.redditOpenCommand
      //   ?.setAttribute(
      //     'hide',
      //     false,
      //   )('#submit-reddit-score-subreddit')
      //   ?.setAttribute('hide', false)
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

  function startRunning(playSound = true, hideNavigator = true) {
    running = true
    setCompletionTime(null)

    ui.mathField.blur()
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

    get terrainLayersSetting() {
      return terrainLayersSetting
    },
    set terrainLayersSetting(v) {
      terrainLayersSetting = v
      if (level && level.graph) level.graph.terrainLayers = v
    },

    set sampleDensitySetting(v) {
      sampleDensitySetting = v
      if (level && level.graph) level.graph.sampleCount = v
    },
    get sampleDensitySetting() {
      return sampleDensitySetting
    },
  })
}
