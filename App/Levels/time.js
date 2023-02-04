const TIME = [
  {
    name: 'Time',
    nick: 'TIME_CONSTANT',
    colors: Colors.biomes.gunnison,
    x: 20,
    y: -20,
    requirements: ['SLOPE_SCALE_TRANSLATE'],
    defaultExpression: '-t',
    goals: [
      {
        x: 0,
        y: -3,
      },
      {
        x: 0,
        y: -2,
      },
      {
        x: 0,
        y: -1,
      },
      {
        x: 0,
        y: 2,
      },
      {
        x: 0,
        y: 3,
      },
      {
        x: 0,
        y: 4,
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        speech: [
          {
            speakerX: 0.3,
            content: '…where did she get the other sled?',
            direction: 'right-right-up',
            distance: 1,
          },
        ],
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'Time Translate',
    nick: 'TIME_COOL',
    colors: Colors.biomes.gunnison,
    x: -20,
    y: 0,
    requirements: null,
    defaultExpression: 't',
    goals: [
      {
        x: 0,
        y: -3,
      },
      {
        x: 0,
        y: -2,
      },
      {
        x: 0,
        y: -1,
      },
      {
        x: 0,
        y: 2,
      },
      {
        x: 0,
        y: 3,
      },
      {
        x: 0,
        y: 4,
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        x: -4,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'Time Translate X',
    nick: 'TIME_PARABOLA_TRANSLATE_X',
    colors: Colors.biomes.gunnison,
    x: 10,
    y: 10,
    requirements: ['TIME_CONSTANT', 'PARABOLA_TRANSLATE_X'],
    defaultExpression: '(x+t)^2',
    goals: [
      {
        x: -2,
        y: 0.5,
      },
      {
        type: 'path',
        expression: '0.5',
        x: 2,
        y: 0.5,
        pathX: 8,
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
        speech: [
          {
            speakerX: 0.3,
            speakerY: 0.8,
            content: 'I hate being alone.',
            direction: 'up',
            distance: 2,
          },
        ],
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'Time Translate XY',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y',
    colors: Colors.biomes.gunnison,
    x: 10,
    y: 10,
    requirements: [null],
    defaultExpression: '\\left(x-t\\right)^2',
    goals: [
      {
        type: 'path',
        expression: 'x',
        x: 2,
        y: 2,
        pathX: 6,
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
        speech: [
          {
            speakerX: 0.3,
            speakerY: 0.8,
            content: 'I find myself thinking that a lot.',
            direction: 'up',
            distance: 2.2,
            speech: {
              speakerX: 0.3,
              content: "I wish she didn't seem so mad.",
              direction: 'up',
              distance: 1,
            },
          },
        ],
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'Time Translate',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y_SCALE_Y',
    colors: Colors.biomes.gunnison,
    x: 10,
    y: 0,
    requirements: [null],
    defaultExpression: '(x-t)^2',
    goals: [
      {
        type: 'path',
        expression: 'x/2',
        x: 2,
        y: 1,
        pathX: 6,
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
        speech: {
          speakerX: 0.3,
          speakerY: 0.8,
          content: "I don't want to be a constant disappointment.",
          direction: 'up',
          distance: 2,
        },
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'sin time translate',
    nick: 'TIME_SIN_TRANSLATE_X',
    colors: Colors.biomes.gunnison,
    x: 20,
    y: 0,
    requirements: ['TIME_PARABOLA_TRANSLATE_X', 'SIN_TRANSLATE_X'],
    defaultExpression: '\\sin \\left(x-t\\right)',
    goals: [
      {
        x: -12,
        y: 0,
        order: 'A',
      },
      {
        type: 'path',
        expression: '0',
        x: -8,
        y: 0,
        pathX: 4,
        order: 'B',
      },
      {
        x: -2,
        y: 0,
        order: 'A',
      },
      {
        type: 'path',
        expression: '0',
        x: 2,
        y: 0,
        pathX: 4,
        order: 'B',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.sam_sled',
      },
      {
        x: -10,
        y: 0,
        asset: 'images.lunchbox_sled',
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'sin time escalate',
    nick: 'TIME_SIN_ESCALATOR',
    colors: Colors.biomes.gunnison,
    x: -10,
    y: -10,
    requirements: [null, 'TIME_PARABOLA_TRANSLATE_X_Y'],
    defaultExpression: '\\sin \\left(\\frac{2x}{pi}-t\\right)',
    goals: [
      {
        x: -12,
        y: -12,
        order: 'A',
      },
      {
        type: 'path',
        expression: 'x',
        x: -8,
        y: 0,
        pathX: 4,
        order: 'B',
      },
      {
        x: -2,
        y: -2,
        order: 'A',
      },
      {
        type: 'path',
        expression: 'x',
        x: 2,
        y: 0,
        pathX: 4,
        order: 'B',
      },
    ],
    sledders: [
      {
        x: -10,
        y: 0,
        asset: 'images.lunchbox_sled',
      },
      {
        x: 0,
        y: 0,
        asset: 'images.sam_sled',
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'sin time oscillate expand',
    nick: 'TIME_SIN_EXPANDING_OSCILLATOR',
    colors: Colors.biomes.gunnison,
    x: -10,
    y: -10,
    requirements: [null],
    defaultExpression: '-\\cos \\left(x-\\sin \\left(t\\right)\\right)',
    goals: [
      {
        x: -2,
        y: 0,
        order: 'A',
      },
      {
        x: -3,
        y: 0,
        order: 'B',
      },
      {
        x: -4,
        y: 0,
        order: 'C',
      },
      {
        x: 2,
        y: 0,
        order: 'A',
      },
      {
        x: 3,
        y: 0,
        order: 'B',
      },
      {
        x: 4,
        y: 0,
        order: 'C',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'sin time oscillate parabola',
    nick: 'TIME_SIN_PARABOLA_OSCILLATOR',
    colors: Colors.biomes.gunnison,
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression: '\\left(\\frac{x}{4}-\\sin \\left(t\\right)\\right)^2',
    goals: [
      {
        x: -6,
        y: 6,
        order: 'D',
      },
      {
        x: -6,
        y: 0,
        order: 'C',
      },
      {
        x: 6,
        y: 6,
        order: 'B',
      },
      {
        x: 6,
        y: 0,
        order: 'A',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'time parabola negator',
    nick: 'TIME_PARABOLA_NEGATOR',
    colors: Colors.biomes.gunnison,
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression: '-\\left(\\frac{x}{4}\\right)^2',
    goals: [
      {
        x: -9,
        y: 3,
        order: 'B',
      },
      {
        x: -6,
        y: -1,
        order: 'A',
      },
      {
        x: 0,
        y: 0,
        order: 'C',
      },
      {
        x: 9,
        y: 3,
        order: 'B',
      },
      {
        x: 6,
        y: -1,
        order: 'A',
      },
    ],
    sledders: [
      {
        x: 3,
        y: 0,
        asset: 'images.lunchbox_sled',
      },
      {
        x: -3,
        y: 0,
        asset: 'images.sam_sled',
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  {
    name: 'time parabola vertical oscillator',
    nick: 'TIME_PARABOLA_VERTICAL_OSCILLATOR',
    colors: Colors.biomes.gunnison,
    x: 0,
    y: -10,
    requirements: ['TIME_SIN_PARABOLA_OSCILLATOR'],
    defaultExpression: '\\left(\\frac{x}{4}\\right)^2',
    goals: [
      {
        x: 4,
        y: 0.5,
        order: 'A',
      },
      {
        x: 0,
        y: 0.5,
        order: 'B',
      },
    ],
    sledders: [
      {
        x: -4,
        y: 0,
        asset: 'images.sam_sled',
      },
    ],
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
]
