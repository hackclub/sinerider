function Gridlines(spec) {
  const { self, screen } = Entity(spec, 'Gridlines')

  const transform = Transform()

  let { camera } = spec

  const ctx = screen.ctx

  let active = false

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

    ctx.strokeStyle = '#aaa'
    ctx.lineWidth = camera.screenToWorldScalar(0.7)

    ctx.stroke()
  }
  function draw() {
    if (active){
    camera.drawThrough(ctx, drawLocal, transform)}
  }
  function setActiveTrue(){
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
  })
}
