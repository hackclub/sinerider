function CloudRow(spec) {
  const { self, camera, screen, globalScope, ctx } = Entity(spec, 'CloudRow')

  const {
    velocities = [0.1, 0.8],
    heights = [8, 25],
    sizes = [8, 16],
    graph,
  } = spec

  const clouds = []
  const vels = []
  const pos = []
  let firstFrame = 3
  let pastFOV = camera.fov
  let deltaFOV = 0

  function pushCloud(start = false) {
    let cloudPos
    let cloudSize = math.lerp(sizes[0], sizes[1], Math.random())
    let velocity = math.lerp(velocities[0], velocities[1], Math.random())

    if (start)
      cloudPos =
        camera.lowerLeft.x +
        Math.random() * (camera.upperRight.x - camera.lowerLeft.x)
    else {
      if (Math.abs(deltaFOV) > 0.001)
        cloudPos =
          Math.random() > 0.5
            ? camera.lowerLeft.x - cloudSize
            : camera.upperRight.x + cloudSize
      else
        cloudPos =
          velocity > 0
            ? camera.lowerLeft.x - cloudSize
            : camera.upperRight.x + cloudSize
    }

    const cloud = Sprite({
      name: 'Cloud ' + i,
      parent: self,
      camera,
      graph,
      globalScope,
      asset: `images.cloud_${Math.floor(Math.random() * 4.99999) + 1}`,
      size: cloudSize,
      opacity: math.lerp(0.5, 0.9, Math.random()),
      x: cloudPos,
      y: math.lerp(heights[0], heights[1], Math.pow(Math.random(), 8)),
    })
    clouds.push(cloud)
    vels.push(velocity)
    pos.push(cloudPos)
    return cloud
  }

  function draw() {
    deltaFOV = camera.fov - pastFOV
    pastFOV = camera.fov
    if (firstFrame > 0) {
      firstFrame--
      for (i = 0; i < camera.fov && firstFrame == 0; i += 0.4) {
        pushCloud(true)
      }
    }
    for (cloud in clouds) {
      // clouds[cloud].size = 2
      pos[cloud] += vels[cloud] * tickDelta
      clouds[cloud].transform.x = pos[cloud]
      if (
        pos[cloud] > camera.upperRight.x + clouds[cloud].size + 1 ||
        pos[cloud] < camera.lowerLeft.x - clouds[cloud].size - 1
      ) {
        clouds[cloud].destroy()
        delete clouds[cloud]
        delete pos[cloud]
        delete vels[cloud]
      }
    }
    clouds.filter((v) => v != null)
    pos.filter((v) => v != null)
    vels.filter((v) => v != null)

    if (Math.random() < 0.007 + deltaFOV * 3) {
      pushCloud()
    }
  }

  return self.mix({
    draw,
  })
}
