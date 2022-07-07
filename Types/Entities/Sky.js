 function Sky(spec) {
    const {
        self,
        camera,
        screen,
        globalScope,
        assets,
        ctx,
    } = Entity(spec, 'Sky')
    
    let {
      asset,
      margin
    } = spec
    
    let initialBounding
    image = _.get(assets, asset, $('#error-sprite'))

    function drawLocal() {
        let deltaX = Math.abs(camera.lowerLeft.x - initialBounding[0].x)/10
        let deltaY = Math.abs(camera.lowerLeft.y - initialBounding[0].y)/10
        screen.ctx.drawImage(image, camera.lowerLeft.x - margin - (1-(1/(1+deltaX)))*margin,
        -camera.lowerLeft.y + margin - (1-(1/(1+deltaY)))*margin, 
        camera.upperRight.x-camera.lowerLeft.x + 2*margin,
        camera.lowerLeft.y-camera.upperRight.y - 2*margin)
    }

    function draw() {
        if (initialBounding == null) 
            initialBounding = [{...camera.lowerLeft}, {...camera.upperRight}]
        
        camera.drawThrough(ctx, drawLocal)
    }

    return self.mix({
      draw
    })
  }