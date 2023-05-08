const TIME = [
  {
    name: 'Time',
    nick: 'TIME_NEGATE',
    biome: 'eternalCanyon',
    x: 20,
    y: 0,
    requirements: ['SLOPE_SCALE_TRANSLATE'],
    defaultExpression: '-t',
    goals: [
      {
        x: 0,
        y: 4,
        order: 'A',
      },
      {
        x: 0,
        y: 6,
        order: 'B',
      },
      {
        x: 0,
        y: 8,
        order: 'C',
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.3,
            y: 0.7,
            content: '"do whatever you want."',
            direction: 'up-up-right',
            distance: 0.8,
          },
        ],
      },
    ],
  },
  {
    name: 'Time Constant',
    nick: 'TIME_CONSTANT',
    biome: 'eternalCanyon',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: 't-1',
    goals: [
      {
        x: 0,
        y: 6,
        order: 'A',
      },
      {
        x: 0,
        y: 4,
        order: 'B',
      },
      {
        x: 0,
        y: -4,
        order: 'C',
      },
      {
        x: 0,
        y: -6,
        order: 'D',
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.3,
            y: 0.7,
            content: 'This is what I want. Adventure!',
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
            content: 'Wee…',
            direction: 'up',
            distance: 0.8,
          },
        ],
      },
    ],
  },
  {
    name: 'Time Constant',
    nick: 'TIME_SLOPE_UP',
    biome: 'eternalCanyon',
    x: 10,
    y: 0,
    requirements: ['TIME_CONSTANT'],
    defaultExpression: '-\\frac{x}{3}+t',
    goals: [
      {
        type: 'path',
        expression: 'x/2',
        x: 2,
        y: 0.5,
        pathX: 8,
      },
    ],
    sledders: [
      {
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.3,
            y: 0.7,
            content: 'Just the void.',
            direction: 'up-up-right',
            distance: 0.8,
            speech: [
              {
                content: "But now there's nobody to talk to…",
                direction: 'up',
                distance: 0.8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Time Translate Y',
    nick: 'TIME_PARABOLA_TRANSLATE_Y',
    biome: 'eternalCanyon',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '\\left(x-1\\right)^2+t-1',
    goals: [
      {
        x: 3,
        y: 3,
        order: 'C',
      },
      {
        x: 3,
        y: 0,
        order: 'B',
      },
      {
        x: 3,
        y: -3,
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
    name: 'Time Translate X',
    nick: 'TIME_PARABOLA_TRANSLATE_X',
    biome: 'eternalCanyon',
    x: 0,
    y: 10,
    requirements: null,
    defaultExpression: '\\left(x-3-\\frac{t}{2}\\right)^2',
    goals: [
      {
        x: 1.5,
        y: 0.5,
        order: 'C',
      },
      {
        x: 2.5,
        y: 0.5,
        order: 'B',
      },
      {
        x: 3.5,
        y: 0.5,
        order: 'A',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.3,
            y: 0.7,
            content: '*sigh*',
            color: '#FFF',
            direction: 'up',
            distance: 0.8,
          },
        ],
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
    defaultExpression: '\\left(x-t-2\\right)^2+t',
    goals: [
      {
        x: -3,
        y: -6,
        order: 'C',
      },
      {
        x: 0,
        y: -3,
        order: 'B',
      },
      {
        x: 3,
        y: 0,
        order: 'A',
      },
      // {
      //   type: 'path',
      //   expression: 'x',
      //   x: 2,
      //   y: 2,
      //   pathX: 6,
      // },
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
            content: 'Being alone sucks.',
            color: '#FFF',
            direction: 'up',
            distance: 1.5,
          },
        ],
      },
    ],
  },
  {
    name: 'Time Hard',
    nick: 'TIME_HARD',
    biome: 'eternalCanyon',
    x: 0,
    y: 10,
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
        y: 16,
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
    name: 'time vertical oscillator',
    nick: 'TIME_SIN',
    biome: 'eternalCanyon',
    x: -20,
    y: 0,
    requirements: ['SIN_TRANSLATE_X_Y'],
    defaultExpression: '\\sin \\left(t\\right)',
    goals: [
      {
        x: 0,
        y: -4,
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
        x: 0,
        y: 0,
        speech: [
          {
            distance: 2,
            speakerX: 0.4,
            speakerY: 0.7,
            content: 'How do the islands float?',
            direction: 'up-up-right',
            align: 'right',
          },
          {
            distance: 1.5,
            speakerX: -0.25,
            speakerY: 0.6,
            content: 'Noogler hats.',
            direction: 'up-left',
          },
        ],
      },
    ],
  },
  {
    name: 'time parabola vertical oscillator',
    nick: 'TIME_PARABOLA_HORIZONTAL_OSCILLATOR',
    biome: 'eternalCanyon',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '\\left(x-2\\sin \\left(t\\right)\\right)^2',
    goals: [
      {
        x: -5,
        y: 0,
        order: 'A',
      },
      {
        x: 5,
        y: 0,
        order: 'B',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        speech: [
          {
            speakerX: 0.4,
            speakerY: 0.7,
            content: "Maybe they're ghost islands?",
            direction: 'up-up-right',
            distance: 2,
          },
        ],
      },
    ],
  },
  {
    name: 'time parabola vertical oscillator',
    nick: 'TIME_PARABOLA_CIRCLE',
    biome: 'eternalCanyon',
    x: -20,
    y: 0,
    requirements: null,
    defaultExpression:
      '\\left(x-2\\sin \\left(t\\right)\\right)^2-2\\cos \\left(t\\right)',
    goals: [
      {
        x: 0,
        y: 6,
        order: 'A',
      },
      {
        x: 6,
        y: 0,
        order: 'B',
      },
      {
        x: 0,
        y: -6,
        order: 'C',
      },
      {
        x: -6,
        y: 0,
        order: 'D',
      },
    ],
    sledders: [
      {
        x: 0,
        y: 0,
        speech: [
          {
            x: -0.2,
            y: 0.65,
            content: 'This place is cool.',
            direction: 'up-up-right',
            distance: 1,
            speech: [
              {
                content: 'You were right.',
                direction: 'up',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'time parabola vertical oscillator',
    nick: 'TIME_PARABOLA_WAVE',
    biome: 'eternalCanyon',
    x: 0,
    y: -10,
    requirements: null,
    defaultExpression:
      '-\\cos \\left(2x-2t\\right)+\\left(\\frac{x}{3}\\right)^2',
    goals: [
      {
        x: 3,
        y: 6,
        type: 'dynamic',
        order: 'B',
      },
      {
        type: 'path',
        expression: 'x',
        order: 'A',
        x: 6,
        y: 0,
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
    name: 'time parabola vertical oscillator',
    nick: 'TIME_PARABOLA_RISER',
    biome: 'eternalCanyon',
    x: 0,
    y: -20,
    requirements: ['TIME_SIN'],
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
        asset: 'images.ada_jack_sled',
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
    x: -10,
    y: -10,
    requirements: ['TIME_PARABOLA_HORIZONTAL_OSCILLATOR'],
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
    name: 'sin time oscillate expand',
    nick: 'TIME_SIN_EXPANDING_OSCILLATOR',
    biome: 'eternalCanyon',
    x: 0,
    y: -10,
    requirements: [null],
    defaultExpression: '\\left(x-\\sin \\left(t\\right)\\right)^2',
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
      },
    ],
  },
]
