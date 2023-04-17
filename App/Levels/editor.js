const EDITOR = [
  {
    name: 'Level Editor',
    nick: 'LEVEL_EDITOR',
    colors: Colors.biomes.alps,
    x: -10,
    y: 0,
    requirements: ['HELLO_WORLD'],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 1,
        y: 0,
      },
    ],
    defaultExpression: '-\\frac{2}{1+e^{-\\left(x-5\\right)}}',
    camera: {
      x: 0,
      y: 0,
      fov: 7,
    },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
  },
]
