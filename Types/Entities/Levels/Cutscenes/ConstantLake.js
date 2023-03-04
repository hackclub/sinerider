function ConstantLake(spec) {
  const { screen } = spec

  let levelOpacity = 1

  const darkenBuffer = ScreenBuffer({
    parent: self,
    screen,
    drawOrder: LAYERS.lighting,
    postProcess: (ctx, width, height) => {
      // Darken screen
      ctx.globalCompositeOperation = 'source-atop'
      ctx.fillStyle = `rgba(1.0, 0.5, 0, ${levelOpacity})`
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
    },
  })

  const darkenBufferScreen = Screen({
    canvas: darkenBuffer.canvas,
  })

  const base = Level(
    {
      ...spec,
      screen: darkenBufferScreen,
    },
    'Puzzle',
  )

  // TODO
}
