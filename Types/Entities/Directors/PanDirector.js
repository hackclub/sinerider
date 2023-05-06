let n = 0.1
function PanDirector(spec) {
  const { self, screen, cameraState } = Director(spec, 'PanDirector')

  const { camera } = spec

  let {} = spec

  let velocity = Vector2()
  let newVelocity = Vector2()

  cameraState.position = Vector2()

  let justUpdatedVelocity = false

  let leftHeld = false
  let rightHeld = false
  let upHeld = false
  let downHeld = false

  let fromPoint = null
  let toPoint = null
  let callback = null

  let oldLerpPosition = Vector2()

  let transitDuration = 1
  let transitProgress = 0
  let transitComplete = false

  let panSpeed = 0.3

  let clickable = Clickable({
    entity: self,
  })

  let lowerLeftScreen = Vector2()

  function snapCameraToNearestPixel() {
    // camera.worldToScreen(camera.lowerLeft, lowerLeftScreen)
    // let { x, y } = lowerLeftScreen
    // let dx = Math.round(x) - x
    // let dy = Math.round(y) - y
    // cameraState.position.x += camera.screenToWorldScalar(dx)
    // cameraState.position.y += camera.screenToWorldScalar(dy)
  }

  function tick() {
    if (!transitComplete) {
      // If in transit, lerp between waypoints
      if (transitProgress == 1 && !transitComplete) {
        transitComplete = true

        if (callback) callback()
      }

      if (transitDuration == 0) transitProgress = 1
      else if (toPoint) transitProgress += camera.tickDelta / transitDuration

      transitProgress = math.clamp01(transitProgress)

      if (fromPoint && toPoint && !transitComplete) {
        // oldPosition.set(cameraState.position)
        fromPoint.lerp(toPoint, transitProgress, cameraState)
        // cameraState.position.subtract(oldLerpPosition, positionDiff)
        // oldLerpPosition.set(cameraState.position)
        // oldPosition.add(positionDiff, cameraState.position)
      }

      return
    }

    // Else, navigate through user interaction
    if (leftHeld || rightHeld || upHeld || downHeld) {
      newVelocity.set(rightHeld - leftHeld, upHeld - downHeld)
      if (newVelocity.magnitude > 0) {
        newVelocity.normalize().multiply(panSpeed)
      }
      justUpdatedVelocity = true
    }

    if (!clickable.holding && !justUpdatedVelocity) {
      newVelocity.multiply(0.85)
    }

    velocity.lerp(newVelocity, 0.7, velocity)

    if (velocity.magnitude > 0.01) {
      cameraState.position.add(velocity)
    }
    justUpdatedVelocity = false

    // cameraState.position.x = Math.floor(cameraState.position.x / 0.1) * 0.1
    // cameraState.position.y = Math.floor(cameraState.position.y / 0.1) * 0.1

    snapCameraToNearestPixel()
  }

  function updateVelocity(mousePoint, heldDown = clickable.holding) {
    // if (!transitComplete) return
    if (!heldDown) return
    transitComplete = true
    let left = camera.lowerLeft.x
    let right = camera.upperRight.x
    let top = camera.upperRight.y
    let bottom = camera.lowerLeft.y

    camera.worldToFrame(mousePoint, newVelocity)

    newVelocity.multiply(2)
    newVelocity.x = math.clamp(-1, 1, newVelocity.x)
    newVelocity.y = math.clamp(-1, 1, newVelocity.y)

    newVelocity.multiply(panSpeed)

    // console.log('Mouse move', x, y)

    justUpdatedVelocity = true
  }

  function updateKeysHeld(key, held) {
    switch (key) {
      case 'ArrowLeft':
      case 'a':
        leftHeld = held
        break

      case 'ArrowRight':
      case 'd':
        rightHeld = held
        break

      case 'ArrowUp':
      case 'w':
        upHeld = held
        break

      case 'ArrowDown':
      case 's':
        downHeld = held
        break
    }
    transitComplete = true
  }

  function keyup(key) {
    updateKeysHeld(key, false)
  }

  function keydown(key) {
    updateKeysHeld(key, true)
  }

  function moveTo(waypointA, waypointB, duration = 0, cb = null) {
    fromPoint = CameraState(waypointA || camera)
    toPoint = CameraState(waypointB)
    oldLerpPosition.set(fromPoint.position)

    transitDuration = duration
    transitProgress = 0
    transitComplete = false
    callback = cb
  }

  return self.mix({
    tick,
    draw,

    keydown,
    keyup,
    moveTo,

    clickable,
    updateVelocity,
    mouseDown: updateVelocity,
    hoverMove: updateVelocity,
  })
}
