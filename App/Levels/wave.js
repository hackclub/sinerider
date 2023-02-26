const WAVE = [
  {
    name: 'Sin',
    nick: 'SIN',
    colors: Colors.biomes.arches,
    x: 20,
    y: -20,
    requirements: [
      'PARABOLA_TRANSLATE_SCALE_X_Y',
      'TIME_PARABOLA_TRANSLATE_X_Y_SCALE_Y',
    ],
    defaultExpression: '\\sin \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: '-sin(x)',
        x: 1,
        y: 0,
        pathX: 2.5,
      },
      {
        type: 'path',
        expression: '-sin(x)',
        x: TAU + 1,
        y: 0,
        pathX: 2.5,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 0,
        y: 0,
        speech: [
          {
            x: 0.3,
            y: 0.65,
            content: 'Hey…',
            color: '#FFF',
            direction: 'up-up-right',
            distance: 1,
          },
        ],
      },
      {
        asset: 'images.lunchbox_sled',
        x: TAU,
        y: 0,
        speech: [
          {
            x: 0.3,
            y: 0.7,
            content: 'Hi.',
            color: '#FFF',
            direction: 'up-up-left',
            distance: 1,
          },
        ],
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
  DESERT,
  {
    name: 'Cos',
    nick: 'COS',
    colors: Colors.biomes.arches,
    x: 10,
    y: 10,
    requirements: ['DESERT'],
    defaultExpression: '\\cos \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: 'cos(x)+4',
        x: 1,
        y: 0,
        pathX: 4.5,
      },
      {
        type: 'path',
        expression: 'cos(x)+4',
        x: TAU + 1,
        y: 0,
        pathX: 4.5,
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        x: 0,
        y: 0,
      },
      {
        asset: 'images.sam_sled',
        x: TAU,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
  {
    name: 'Cos',
    nick: 'COS_SCALE_X_Y',
    colors: Colors.biomes.arches,
    x: 0,
    y: -20,
    requirements: ['DESERT'],
    defaultExpression: '\\sin \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: '-cos(x/2)',
        x: -TAU + 1.5,
        y: 0,
        pathX: 4.5,
      },
      {
        type: 'path',
        expression: '-cos(x/2)',
        x: TAU - 1.5,
        y: 0,
        pathX: -4.5,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -TAU + 0.1,
        y: 0,
      },
      {
        asset: 'images.lunchbox_sled',
        x: TAU - 0.1,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
  {
    name: 'Sin Translate X',
    nick: 'SIN_TRANSLATE_X',
    colors: Colors.biomes.arches,
    x: -10,
    y: -10,
    requirements: ['DESERT'],
    defaultExpression: '\\sin \\left(x+\\frac{pi}{3}\\right)',
    goals: [
      {
        type: 'path',
        expression: 'cos(x)',
        x: 1,
        y: 0,
        pathX: 4,
      },
      {
        type: 'path',
        expression: 'cos(x)',
        x: TAU + 1,
        y: 0,
        pathX: 4,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 0,
        y: 0,
      },
      {
        asset: 'images.lunchbox_sled',
        x: TAU,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
  {
    name: 'Sin Translate XY',
    nick: 'SIN_TRANSLATE_X_Y',
    colors: Colors.biomes.arches,
    x: 0,
    y: -20,
    requirements: [null],
    defaultExpression: '\\cos \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: 'cos(x-1)+4',
        x: 2,
        y: 0,
        pathX: 4,
      },
      {
        type: 'path',
        expression: 'cos(x-1)+4',
        x: TAU + 2,
        y: 0,
        pathX: 4,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 1,
        y: 0,
      },
      {
        asset: 'images.lunchbox_sled',
        x: TAU + 1,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
  {
    name: 'Sin Scale X',
    nick: 'SIN_SCALE_X',
    colors: Colors.biomes.arches,
    x: 10,
    y: -10,
    requirements: ['DESERT'],
    defaultExpression: '\\sin \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: 'sin(x/2)',
        x: -1,
        y: 0,
        pathX: -5,
      },
      {
        type: 'path',
        expression: 'sin(x/2)',
        x: TAU + 1,
        y: 0,
        pathX: 5,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 0,
        y: 0,
      },
      {
        asset: 'images.lunchbox_sled',
        x: TAU,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
  {
    name: 'Sin Scale XY',
    nick: 'SIN_SCALE_X_Y',
    colors: Colors.biomes.arches,
    x: 0,
    y: -20,
    requirements: [null],
    defaultExpression: '2\\sin \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: '-sin(x/3)*2',
        x: TAU - 1,
        y: 0,
        pathX: -5,
      },
      {
        type: 'path',
        expression: '-sin(x/3)*2',
        x: TAU + 1,
        y: 0,
        pathX: 5,
      },
    ],
    sledders: [
      {
        x: (-TAU * 2) / 3,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.sinusoidaldesertbiome_1',
      margin: 1,
    },
  },
]
