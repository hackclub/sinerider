function CloudRow(spec) {
    const {
      self,
      camera,
      screen,
      globalScope,
      ctx,
    } = Entity(spec, 'CloudRow')

    const {
        velocity,
        heights,
        graph
    } = spec;
    
    const clouds = []
    const vels = []
    const pos = []
    let firstFrame = 3
    let pastFOV = camera.fov
    let deltaFOV = 0


    function draw() {
        deltaFOV = camera.fov - pastFOV
        pastFOV = camera.fov
        if (firstFrame > 0) {
            firstFrame--
            for (i = 0; i < camera.fov && firstFrame == 0; i+=0.2) {
                let cloudPos = camera.lowerLeft.x + Math.random() * (camera.upperRight.x - camera.lowerLeft.x)
                clouds.push(Sprite({
                    name: 'Cloud '+i,
                    parent: self,
                    camera,
                    graph,
                    globalScope,
                    asset: `images.cloud_${Math.floor(Math.random()*3) + 1}`,
                    size: 2,
                    x: cloudPos,
                    y: Math.random() * (heights[1] - heights[0] + 1) + heights[0],
                }))
                vels.push(velocity)
                pos.push(cloudPos) 
            }
        }
        for (cloud in clouds) {
            clouds[cloud].size = 2
            pos[cloud] += vels[cloud]*tickDelta
            clouds[cloud].transform.x = pos[cloud]
            if (pos[cloud] > camera.upperRight.x+clouds[cloud].size || pos[cloud] < camera.lowerLeft.x-clouds[cloud].size) {
                clouds[cloud].destroy()
                delete clouds[cloud]
                delete pos[cloud]
                delete vels[cloud]
            }
        }
        clouds.filter(v => v != null)
        pos.filter(v => v != null)
        vels.filter(v => v != null)

        if (Math.random() < 0.02 + (deltaFOV*3)) {
            let cloudPos;
            if (Math.abs(deltaFOV) > 0.001) {
                cloudPos = Math.random() > 0.5 ? camera.lowerLeft.x - 2 : camera.upperRight.x + 2;
            } else
                cloudPos = velocity > 0 ? camera.lowerLeft.x - 2 : camera.upperRight.x + 2;
            clouds.push(Sprite({
                name: 'Cloud '+Math.random(),
                parent: self,
                camera,
                graph,
                globalScope,
                asset: `images.cloud_${Math.floor(Math.random()*3) + 1}`,
                size: 2,
                x: cloudPos,
                y: Math.random() * (heights[1] - heights[0] + 1) + heights[0],
            }))
            vels.push((Math.random()+0.03)*velocity)
            pos.push(cloudPos) 
        }
    }

    return self.mix({
        draw
    })
  }