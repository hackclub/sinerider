const TIME = [
  {
    name: 'Time',
    nick: 'TIME_CONSTANT',
    biome: 'eternalCanyon',
    x: 30,
    y: 0,
    requirements: ['SLOPE_SCALE_TRANSLATE'],
    defaultExpression: '-1-t',
    goals: [
      {
        x: 0,
        y: -5,
      },
      {
        x: 0,
        y: -4,
      },
      {
        x: 0,
        y: -3,
      },
      {
        x: 0,
        y: 4,
      },
      {
        x: 0,
        y: 5,
      },
      {
        x: 0,
        y: 6,
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.3,
            y: 0.7,
            content: '"Do whatever you want."',
            direction: 'up-up-right',
            distance: 0.8,
          },
        ],
      },
    ],
  },
  {
    name: 'Time Cool',
    nick: 'TIME_COOL',
    biome: 'eternalCanyon',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '\\left(x+1\\right)\\cdot \\left(t-1\\right)',
    goals: [
      {
        x: -4,
        y: 0,
      },
      {
        x: -4,
        y: 1,
      },
      {
        x: -4,
        y: 2,
      },
      {
        x: 4,
        y: 0,
      },
      {
        x: 4,
        y: 1,
      },
      {
        x: 4,
        y: 2,
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
            y: 0.7,
            content: '…where did she get the other sled?',
            direction: 'up',
            distance: 0.8,
          },
        ],
      },
    ],
  },
  {
    name: 'Time Translate X',
    nick: 'TIME_PARABOLA_TRANSLATE_X',
    biome: 'eternalCanyon',
    x: 10,
    y: 0,
    requirements: ['TIME_CONSTANT'],
    defaultExpression: '\\left(x+t+1\\right)^2',
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
      },
    ],
  },
  {
    name: 'Time Translate XY',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y',
    biome: 'eternalCanyon',
    x: 10,
    y: 0,
    requirements: [null],
    defaultExpression: '\\left(x-t\\right)^2+1',
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
        // speech: [
        //   {
        //     speakerX: 0.3,
        //     speakerY: 0.8,
        //     content: 'I find myself thinking that a lot.',
        //     direction: 'up',
        //     distance: 2.2,
        //     speech: {
        //       speakerX: 0.3,
        //       content: "I wish she didn't seem so mad.",
        //       direction: 'up',
        //       distance: 1,
        //     },
        //   },
        // ],
      },
    ],
  },
  {
    name: 'Time Translate',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y_SCALE_Y',
    biome: 'eternalCanyon',
    x: 10,
    y: 10,
    requirements: [null],
    defaultExpression: '\\left(x-t\\right)^2+t',
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
        speech: [
          {
            x: 0.25,
            y: 0.7,
            content: 'being alone sucks.',
            direction: 'up',
            distance: 1.5,
          },
        ],
        // speech: {
        //   speakerX: 0.3,
        //   speakerY: 0.8,
        //   content: "I don't want to be a constant disappointment.",
        //   direction: 'up',
        //   distance: 2,
        // },
      },
    ],
  },
  {
    name: 'Time Hard',
    nick: 'TIME_HARD',
    biome: 'eternalCanyon',
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression: `4\\cdot \\sin \\left(x-\\sin \\left(\\frac{t}{2}\\right)\\cdot 11\\right)\\cdot \\cos \\left(\\frac{t}{3}\\right)+8\\cdot \\sin \\left(\\frac{t+\\sin \\left(t\\cdot e\\right)}{2}\\right)`,
    goals: [
      {
        type: 'dynamic',
        x: 2,
        y: 1,
        order: 'A',
      },
      {
        type: 'dynamic',
        x: 12,
        y: 4,
        order: 'B',
      },
      {
        type: 'dynamic',
        x: -8,
        y: 4,
        order: 'B',
      },
      {
        type: 'dynamic',
        x: -7,
        y: 4,
        order: 'C',
      },
      {
        x: -2,
        y: 8,
        order: 'C',
      },
      {
        x: -12,
        y: -4,
        order: 'B',
      },
    ],

    texts: [
      {
        x: 0,
        y: 20,
        size: 1,
        fill: '#fff',
        content: '(this level is impossible)',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.25,
            y: 0.7,
            content: 'ok lol this is too hard',
            direction: 'up',
            distance: 1,
          },
        ],
        // speech: {
        //   speakerX: 0.3,
        //   speakerY: 0.8,
        //   content: "I don't want to be a constant disappointment.",
        //   direction: 'up',
        //   distance: 2,
        // },
      },
    ],
  },
  {
    name: 'time parabola vertical oscillator',
    nick: 'TIME_PARABOLA_RISER',
    biome: 'eternalCanyon',
    x: -20,
    y: 0,
    requirements: ['SIN_TRANSLATE_X_Y'],
    defaultExpression: '\\left(\\frac{x}{4}\\right)^2-t-1',
    goals: [
      {
        x: 4,
        y: 0,
        order: 'A',
      },
      {
        x: 0,
        y: 4,
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
  },
  {
    name: 'time parabola negator',
    nick: 'TIME_PARABOLA_NEGATOR',
    biome: 'eternalCanyon',
    x: -10,
    y: -10,
    requirements: [null],
    defaultExpression: '\\left(\\frac{x}{4}\\right)^2\\cdot \\left(t-1\\right)',
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
  },
  {
    name: 'sin time oscillate parabola',
    nick: 'TIME_SIN_PARABOLA_OSCILLATOR',
    biome: 'eternalCanyon',
    x: -20,
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
  },
  {
    name: 'sin time translate',
    nick: 'TIME_SIN_TRANSLATE_X',
    biome: 'eternalCanyon',
    x: 0,
    y: -10,
    requirements: ['TIME_PARABOLA_RISER'],
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
  },
  {
    name: 'sin time escalate',
    nick: 'TIME_SIN_ESCALATOR',
    biome: 'eternalCanyon',
    x: -10,
    y: -10,
    requirements: [null],
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
  },
  {
    name: 'sin time escalate oscillate',
    nick: 'TIME_SIN_ESCALATOR_OSCILLATOR',
    biome: 'eternalCanyon',
    x: -20,
    y: 0,
    requirements: [null],
    defaultExpression: '-2\\cos \\left(x-2\\sin \\left(t\\right)\\right)+x+1',
    goals: [
      {
        type: 'path',
        expression: 'x',
        x: -2,
        y: -2,
        pathX: -4,
      },
      {
        type: 'path',
        expression: 'x',
        x: 2,
        y: 2,
        pathX: 4,
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
      },
    ],
  },
  {
    name: 'sin time oscillate expand',
    nick: 'TIME_SIN_EXPANDING_OSCILLATOR',
    biome: 'eternalCanyon',
    x: -10,
    y: -10,
    requirements: ['TIME_SIN_ESCALATOR'],
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
  },
]
