const DESERT = {
  name: 'Desert',
  nick: 'DESERT',
  colors: Colors.biomes.mojave,
  axesEnabled: false,
  x: -15,
  y: -15,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: ['LOGISTIC_JUMP'],
  defaultExpression: '\\frac{1}{3}\\sin\\left(\\frac{x}{10}\\right)+\\frac{1}{4}\\sin\\left(\\frac{x}{20}+\\frac{\\pi}{3}\\right)+\\frac{1}{2}\\sin\\left(\\frac{x}{53}+3\\frac{\\pi}{6}\\right)',
  directors: [{
    type: 'lerp',
    point0: [-1, 0],
    point1: [10, 0],
    state0: {
      position: [-2, 3.5],
      fov: 5,
    },
    state1: {
      position: [16, 10],
      fov: 12,
    },
  }],
  goals: [],
  sky: {
    asset: 'images.logistic_dunes_background',
    margin: 1
  },
  walkers: [{
    x: -4,
    victoryX: 26,
    asset: 'images.benny_float',
    range: [NINF, 28],
    speech: [],
    walkers: {
      x: -6,
      asset: 'images.sam_float',
      bobSpeed: 0.918218,
      speech: [],
    },
  }],
  sprites: [],
  sounds: [],
}