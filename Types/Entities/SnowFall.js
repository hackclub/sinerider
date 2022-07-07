function SnowFall(spec) {
    const {
        self,
        camera,
        screen,
        globalScope,
        assets,
        ctx,
    } = Entity(spec, 'SnowFall')

    const {
        density = 0.4,
        velocityX = 0.2,
        velocityY = 0.4
    } = spec

    const transform = Transform(spec, self)
    let pastFOV = camera.fov
    let deltaFOV = 0
    let initialFrame = 2
    
    let {
    } = spec
    let particles = []

    function drawLocal() {
        if (initialFrame > 0) {
            initialFrame--
            for (i = 0; i < Math.random()*100 && initialFrame == 0; i+=density/20)
                particles.push([Math.random()*(camera.upperRight.x-camera.lowerLeft.x+3) + camera.lowerLeft.x-3,Math.random()*(camera.upperRight.y-camera.lowerLeft.y) - camera.upperRight.y, Math.random()])
        } else {
            for (flake in particles)
                if (particles[flake][1] + deltaFOV+3 < camera.lowerLeft.y )
                    delete particles[flake]
            particles = particles.filter(f => f != null)
        }

        deltaFOV = camera.fov - pastFOV
        pastFOV = camera.fov
        if (deltaFOV > 0.01) {
            for (i = 0; i < Math.random(); i+=density/deltaFOV)
                particles.push([Math.random()*deltaFOV+ camera.upperRight.x,Math.random()*(camera.upperRight.y-camera.lowerLeft.y) - camera.upperRight.y, Math.random()])
            for (i = 0; i < Math.random(); i+=density/deltaFOV)
                particles.push([-Math.random()*deltaFOV+ camera.lowerLeft.x,Math.random()*(camera.upperRight.y-camera.lowerLeft.y) - camera.upperRight.y, Math.random()])
            for (i = 0; i < Math.random(); i+=density/deltaFOV)
                particles.push([Math.random()*(camera.upperRight.x-camera.lowerLeft.x+3) + camera.lowerLeft.x-3,-Math.random()*deltaFOV + camera.lowerLeft.y, Math.random()])
        }
        if (Math.random() < density) 
            particles.push([Math.random()*(camera.upperRight.x-camera.lowerLeft.x+3) + camera.lowerLeft.x-3,-camera.upperRight.y, Math.random()])
        for (flake in particles) {
            particles[flake][0]+=(velocityX*tickDelta)//(flake[2]+1)
            particles[flake][1]+=velocityY*tickDelta*(particles[flake][2]+1)
        }
        for (flake of particles) {
            ctx.beginPath();
            ctx.arc(flake[0], flake[1], 0.03+0.03*flake[2], 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.lineWidth = 0.01
            ctx.stroke();
        }
    }

    function draw() {
        camera.drawThrough(ctx, drawLocal, transform)
    }
    return self.mix({
      draw
    })
  }