const CONSTANT_LAKE = {
  name: 'Constant Lake',
  nick: 'CONSTANT_LAKE',
  colors: Colors.biomes.alps,
  // radius: 2,
  x: 5,
  y: 10,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: ['SLOPE_SHALLOWER', 'SLOPE_LOWER'],
  defaultExpression: '\\frac{2}{1+\\frac{1}{e^{x-5}}}+\\frac{-8}{1+\\frac{1}{e^{x-28}}}',
  directors: [{
    type: 'lerp',
    point0: [-1, 0],
    point1: [10, 0],
    state0: {
      position: [-2, 3.5],
      fov: 5,
    },
    state1: {
      position: [16, 8],
      fov: 12,
    },
  }],
  goals: [],
  sledders: [],
  sky: {
    asset: 'images.western_slopes_background_no_sky',
    margin: 1
  },
  sounds: [
    {
      asset: 'sounds.constant_lake.base',
      loop: true,
      volume: 0.2,
    },
    {
      asset: 'sounds.constant_lake.pad_1_loopable',
      loop: true,
      volume: 0.3,
    },
    {
      asset: 'sounds.constant_lake.pad_2_loopable',
      domain: [ 8, 12 ],
      fadeOut: 800,
      duration: 20000
    },
    {
      asset: 'sounds.constant_lake.pad_3_loopable',
      domain: [ 14, 17 ],
      fadeOut: 800,
      duration: 10000,
      volume: 1.2,  
    },
  ],
  walkers: [{
    x: -4,
    asset: 'images.benny_float',
    range: [NINF, 26],
    speech: [{
      speakerX: -0.4,
      content: 'The sun is setting soon',
      direction: 'up-up-left',
      domain: [-3, 0],
      distance: 1.5,
    },{
      speakerX: 0.3,
      content: 'NOT AS BEAUTIFUL AS YOU M\'LOVELY',
      direction: 'up-up-right',
      domain: [6, 9],
      distance: 1.8,
    }],
    walkers: {
      x: -6,
      asset: 'images.sam_float',
      bobSpeed: 0.918218,
      speech: [{
        speakerX: -0.4,
        content: 'It\'s beautiful!',
        direction: 'up-up-left',
        domain: [4, 8],
        distance: 1.3,
      },{
        color: '#fff',
        speakerX: -0.4,
        content: '...',
        direction: 'up-up-left',
        domain: [12, 14],
        distance: 1.0,
      },{
        color: '#fff',
        speakerX: -0.4,
        content: '…you\'re such a dork.',
        direction: 'up-up-left',
        domain: [14, 17],
        distance: 1.3,
      },{
        color: '#fff',
        speakerX: -0.4,
        content: 'I do love you, though.',
        direction: 'up-up-left',
        domain: [22, 26],
        distance: 1.3,
      }],
    },
  }],
  sprites: [
    {
      asset: 'images.tree_1',
      flipX: false,
      drawOrder: LAYERS.foreSprites,
      size: 4.8,
      x: -8,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_3',
      flipX: true,
      size: 4.1,
      x: -4.2,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_2',
      flipX: true,
      size: 5.6,
      x: -1.6,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_3',
      flipX: true,
      drawOrder: LAYERS.foreSprites,
      size: 4.4,
      x: 3.7,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.bush_1',
      flipX: false,
      size: 2.4,
      x: 4.8,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_2',
      flipX: false,
      size: 5,
      x: 6.3,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_1',
      flipX: true,
      drawOrder: LAYERS.foreSprites,
      size: 5,
      x: 7.4,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.bush_2',
      flipX: true,
      drawOrder: LAYERS.foreSprites,
      size: 2.8,
      x: 11,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_2',
      flipX: true,
      size: 5.4,
      x: 13.2,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.tree_1',
      flipX: false,
      drawOrder: LAYERS.foreSprites,
      size: 4.3,
      x: 15,
      y: 0,
      offset: [0, 0.9],
      anchored:true
    },
    {
      asset: 'images.rock_2',
      flipX: true,
      drawOrder: LAYERS.foreSprites,
      size: 3,
      x: -3,
      offset: [0, 0.6],
      anchored:true
    },
    {
      asset: 'images.rock_3',
      flipX: false,
      drawOrder: LAYERS.backSprites,
      size: 3,
      x: 9.1,
      offset: [0, 0.6],
      anchored:true
    },
    {
      asset: 'images.fox',
      flipX: false,
      drawOrder: LAYERS.backSprites,
      size: 1,
      x: 9.1,
      offset: [0, 2.8],
      anchored:true
    },
  ],
  // clouds: {
  //   velocity: 0.1,
  //   heights:[4,4.8]
  // },
}