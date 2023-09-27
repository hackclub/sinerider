const EDITOR = [
  {
    name: 'Level Editor',
    nick: 'LEVEL_EDITOR',
    colors: Colors.biomes.alps,
    x: -10,
    y: 0,
    requirements: [],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 1,
        y: 0,
      },
    ],
    texts: [
      {
        x: 4,
        y: 5,
        content: 'Click to edit!',
      },
    ],
    defaultExpression: '-\\frac{2}{1+e^{-\\left(x-5\\right)}}',
    camera: {
      x: 0,
      y: 0,
      fov: 7,
    },
    assets:{
      sounds: {
        music:{
          credits: '.mp3',
          valley_parabola_puzzle: '.mp3',
          western_slopes_puzzle: '.mp3',
          sinusoidal_desert_puzzle: '.mp3',
          eternal_canyon_puzzle: '.mp3',
          hilbert_delta_puzzle: '.mp3',
          logistic_dunes_puzzle: '.mp3',
        }
      }
    },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
  },
  
]
