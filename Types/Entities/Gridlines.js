function Gridlines(spec) {
  const { self, screen } = Entity(spec, 'Gridlines')

  const transform = Transform()

  let { camera } = spec

  const ctx = screen.ctx

  let active = false
  let x = 0
  let y = 0

  function tick() {}
  function drawLocal(){
    const xTicks = Math.ceil(camera.upperRight.x-camera.lowerLeft.x)+1
    const yTicks = Math.ceil(camera.upperRight.y-camera.lowerLeft.y)+1
    ctx.beginPath()
    // Draw vertical lines
    for (let i=0; i<xTicks; i++){ 
      ctx.moveTo(i, -camera.lowerLeft.y)
      ctx.lineTo(i, -camera.upperRight.y)
      ctx.moveTo(-i, -camera.lowerLeft.y)
      ctx.lineTo(-i, -camera.upperRight.y)
    }
    // Draw horizontal lines
    for (let i=0; i<yTicks; i++){
      ctx.moveTo(camera.lowerLeft.x, -i)
      ctx.lineTo(camera.upperRight.x, -i)
      ctx.moveTo(camera.lowerLeft.x,i)
      ctx.lineTo(camera.upperRight.x, i)
    }
    ctx.strokeStyle = 'rgba(170, 170, 170, 0.5)'
    ctx.lineWidth = camera.screenToWorldScalar(1)

    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(camera.lowerLeft.x, -y)
    ctx.lineTo(camera.upperRight.x, -y)
    ctx.moveTo(x, -camera.lowerLeft.y)
    ctx.lineTo(x, -camera.upperRight.y)
    ctx.strokeStyle = 'rgba(136, 187, 221, 1)'
    ctx.lineWidth = camera.screenToWorldScalar(1)
    ctx.stroke()
  }
  function getactive(){
    return active
  }
  function draw() {
    if (active){
      camera.drawThrough(ctx, drawLocal, transform)
    }
  }
  function setActiveTrue(newx=x, newy=y){
    x = newx
    y = newy
    active = true
  }
  function setActiveFalse(){
    active = false
  }

  return self.mix({
    transform,

    tick,
    draw,
    setActiveTrue,
    setActiveFalse,
    getactive,
  })
}
