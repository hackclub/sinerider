/**
 * Level subtype that has everything a Level does, but has goals.
 * Calls levelCompleted when they're all met correctly.
 */
function Puzzle(spec) {
  const { self, assets, screen, ui, graph, camera } = Level(spec, 'Puzzle')

  const base = _.mix(self)

  const goals = []

  base.trackEntities(goals)

  let lowestOrder = 'A'
  let highestOrder = 'A'

  function goalCompleted(goal) {
    if (!completed) {
      refreshLowestOrder()

      let levelComplete = true

      for (goal of goals) {
        if (!goal.completed) {
          levelComplete = false
          break
        }
      }

      assets.sounds.goal_success.play()

      if (levelComplete) {
        completed = true
        levelCompleted()
        assets.sounds.level_success.play()
      }
    }
  }

  function goalFailed(goal) {
    if (goal.order) {
      for (g of goals) {
        if (g.order && !g.completed) g.fail()
      }
    }

    assets.sounds.goal_fail.play()

    // Show try again button in place of reset button
    ui.tryAgainButton.setAttribute('hide', false)
    ui.stopButton.setAttribute('hide', true)
  }

  function addGoal(goalDatum) {
    const generator = {
      path: PathGoal,
      fixed: FixedGoal,
      dynamic: DynamicGoal,
    }[goalDatum.type || 'fixed']

    const goal = generator({
      name: 'Goal ' + goals.length,
      parent: self,
      camera,
      graph,
      assets,
      sledders,
      globalScope,
      drawOrder: LAYERS.goals,
      goalCompleted,
      goalFailed,
      getLowestOrder: () => lowestOrder,
      world,
      ...goalDatum,
    })

    goals.push(goal)
  }

  function goalAdded(type) {
    addGoal({
      type,
    })
  }

  function goalDeleted(goal) {
    goals.splice(
      goals.findIndex((g) => g.id == goal.id),
      1,
    )
  }

  function refreshLowestOrder() {
    lowestOrder = 'Z'
    for (goal of goals) {
      if (!goal.completed && goal.order < lowestOrder) {
        lowestOrder = goal.order
      }
    }

    _.invokeEach(goals, 'refresh')
  }

  function loadDatum(datum) {
    base.loadDatum(datum)
    _.each(datum.goals, addGoal)
  }

  function serialize() {
    return {
      ...base.serialize(),
      goals: goals.map((g) => {
        return {
          type: g.type,
          x: g.transform.x,
          y: g.transform.y,
          order: g.order,
        }
      }),
    }
  }

  function tick() {
    base.tick()
    let time = (Math.round(globalScope.t * 10) / 10).toString()
    if (globalScope.running && !_.includes(time, '.')) time += '.0'
    ui.runButtonString.innerHTML = 'T=' + time
    ui.stopButtonString.innerHTML = 'T=' + time
  }

  return self.mix({
    tick,
    loadDatum,

    // Puzzle
    goalAdded,
    goalDeleted,
    goals,
    serialize,
  })
}
