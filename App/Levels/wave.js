const WAVE = [
  {
    name: 'Sin',
    nick: 'SIN',
    biome: 'sinusoidalDesert',
    x: 20,
    y: -20,
    requirements: [
      'PARABOLA_TRANSLATE_SCALE_X_Y',
      'TIME_PARABOLA_TRANSLATE_X_Y',
    ],
    defaultExpression: '\\sin \\left(x\\right)',
    slider: {
      expression: '$\\cdot \\sin \\left(x\\right)',
      bounds: [-1, 1, 1],
    },
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
        asset: 'images.lunchbox_sled',
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
        asset: 'images.sam_sled',
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
  },
  {
    name: 'Cos',
    nick: 'COS',
    biome: 'sinusoidalDesert',
    x: 20,
    y: 0,
    requirements: [null],
    defaultExpression: '\\cos \\left(x\\right)',
    goals: [
      {
        type: 'path',
        expression: 'cos(x)+6',
        x: 1,
        y: 0,
        pathX: 4.5,
      },
      {
        type: 'path',
        expression: 'cos(x)+6',
        x: TAU + 1,
        y: 0,
        pathX: 4.5,
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
            content: 'I waited six hours.',
            color: '#FFF',
            direction: 'up',
            distance: 1.2,
          },
        ],
      },
      {
        asset: 'images.lunchbox_sled',
        x: TAU,
        y: 0,
        speech: [
          {
            x: 0.2,
            y: 0.5,
            content: '…and I apologize.',
            color: '#FFF',
            direction: 'left-left-up',
            distance: 0.6,
            speech: [
              {
                x: -1,
                content: 'I know.',
                color: '#FFF',
                direction: 'up',
                distance: 0.6,
              },
            ],
          },
        ],
      },
    ],
  },
  DESERT,
  {
    name: 'Cos',
    nick: 'COS_SCALE_X_Y',
    biome: 'sinusoidalDesert',
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
  },
  {
    name: 'Sin Translate X',
    nick: 'SIN_TRANSLATE_X',
    biome: 'sinusoidalDesert',
    x: -10,
    y: -10,
    requirements: ['DESERT'],
    defaultExpression: '\\sin \\left(x\\right)',
    slider: {
      expression: '\\sin \\left(x+$\\right)',
      bounds: [-2, 1, 0],
    },
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
  },
  {
    name: 'Sin Translate XY',
    nick: 'SIN_TRANSLATE_X_Y',
    biome: 'sinusoidalDesert',
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
  },
  {
    name: 'Sin Scale X',
    nick: 'SIN_SCALE_X',
    biome: 'sinusoidalDesert',
    x: 10,
    y: -10,
    requirements: ['DESERT'],
    defaultExpression: '\\sin \\left(\\frac{x}{4}\\right)',
    slider: {
      expression: '\\sin \\left(\\frac{x}{$}\\right)',
      bounds: [2.5, 5, 4],
    },
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
  },
  {
    name: 'Sin Scale XY',
    nick: 'SIN_SCALE_X_Y',
    biome: 'sinusoidalDesert',
    x: 0,
    y: -20,
    requirements: [null],
    defaultExpression: '\\sin \\left(\\frac{x}{2}\\right)',
    slider: {
      expression: '$\\cdot \\sin \\left(\\frac{x}{2}\\right)',
      bounds: [-2, 2, 1],
    },
    goals: [
      {
        type: 'path',
        expression: '-sin(x/3)*3',
        x: TAU - 1,
        y: 0,
        pathX: -5,
      },
      {
        type: 'path',
        expression: '-sin(x/3)*3',
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
  },
  {
    name: 'Sin Translate Scale XY',
    nick: 'SIN_TRANSLATE_SCALE_X_Y',
    biome: 'sinusoidalDesert',
    x: -10,
    y: -10,
    requirements: [null, 'COS_SCALE_X_Y', 'SIN_TRANSLATE_X_Y'],
    defaultExpression: '3\\cos \\left(\\frac{x+3}{2}\\right)-1',
    goals: [
      {
        type: 'path',
        expression: 'cos((x+4)/3)*2-4',
        x: -2,
        y: 0,
        pathX: 15,
      },
    ],
    sledders: [
      {
        x: -4,
        y: 0,
      },
    ],
  },
]
