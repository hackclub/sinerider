function CloudRow(spec) {
    const {
      self,
      camera,
      screen,
      globalScope,
      ctx,
    } = Entity(spec, 'CloudRow')

    const {graph} = spec;
    
    const clouds = []
    const vels = []
    const pos = [];
    let firstFrame = true;


    function tick() {
        if (firstFrame) {
            for (i = 0; i < camera.fov; i+=0.2) {
                let cloudPos = camera.lowerLeft.x + Math.random() * (camera.upperRight.x - camera.lowerLeft.x)
                clouds.push(Sprite({
                    name: 'Cloud '+i,
                    parent: self,
                    camera,
                    graph,
                    globalScope,
                    asset: `images.cloud${Math.floor(Math.random()*3) + 1}`,
                    size: 2,
                    x: cloudPos,
                    y: 3.5 + 2*Math.random(),
                    drawOrder: -100
                }))
                vels.push(Math.random()*0.8 + 0.3)
                pos.push(cloudPos) 
            }
        }
        firstFrame = false

        for (cloud in clouds) {
            clouds[cloud].size = camera.fov/2 - 0.5
            pos[cloud] += vels[cloud]*clouds[cloud].size/2.5*tickDelta
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

        if (Math.random() < 0.02) {
            clouds.push(Sprite({
                name: 'Cloud '+Math.random(),
                parent: self,
                camera,
                graph,
                globalScope,
                asset: `images.cloud${Math.floor(Math.random()*3) + 1}`,
                size: 2,
                x: camera.lowerLeft.x - camera.fov/2 + 0.5,
                y: 3.5 + 2*Math.random(),
                drawOrder: -100
            }))
            vels.push(Math.random()*0.8 + 0.3)
            pos.push(camera.lowerLeft.x - camera.fov/2 + 0.5) 
        }
    }

    return self.mix({
        tick
    })
  }