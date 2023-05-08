const SWAMP = [
  {
    name: 'Two Beside',
    nick: 'TWO_BESIDE',
    biome: 'hilbertDelta',
    x: -30,
    y: 0,
    requirements: ['TIME_PARABOLA_CIRCLE'],
    defaultExpression: '0',
    goals: [
      {
        x: 12,
        y: 0,
      },
      {
        x: 6,
        y: -6,
      },
    ],
    sledders: [
      {
        speech: [
          {
            speakerX: -0.4,
            speakerY: 0.7,
            content: 'This place creeps me out.',
            direction: 'up-up-left',
            distance: 2.2,
            color: '#FFF',
          },
          {
            speakerX: 0.5,
            speakerY: 0.65,
            content: 'Yeah...',
            color: '#FFF',
            direction: 'up-up-right',
            distance: 1.6,
          },
        ],
      },
    ],
    sprites: [],
  },
  {
    name: 'Two Below',
    nick: 'TWO_BELOW',
    biome: 'hilbertDelta',
    x: -10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: -8,
      },
      {
        x: -8,
        y: -8,
      },
    ],
    sprites: [],
    sledders: [
      {
        speech: [
          {
            distance: 1.6,
            speakerX: 0.6,
            speakerY: 0.6,
            color: '#FFF',
            direction: 'up-up-right',
            content: 'Just follow me!!',
            speech: {
              distance: 1,
              color: '#FFF',
              direction: 'up',
              content: 'Come on. I have a shortcut.',
            },
          },
          {
            distance: 2.3,
            speakerX: -0.3,
            speakerY: 0.5,
            color: '#FFF',
            content: 'Jack…',
            direction: 'up-up-left',
            align: 'right',
          },
        ],
      },
    ],
  },
  {
    name: 'Four Around',
    nick: 'FOUR_AROUND',
    biome: 'hilbertDelta',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 0,
        y: -4,
      },
      {
        x: 4,
        y: 0,
      },
      {
        x: 0,
        y: 8,
      },
      {
        x: -4,
        y: 0,
      },
    ],
    sledders: [
      {
        speech: [
          {
            distance: 2,
            speakerX: 0.5,
            speakerY: 0.7,
            color: '#FFF',
            direction: 'up-up-right',
            content: 'But first, a little more exploring…',
          },
          {
            distance: 1.4,
            speakerX: -0.3,
            speakerY: 0.55,
            color: '#FFF',
            content: '…',
            direction: 'up-up-left',
            align: 'right',
          },
        ],
      },
    ],
  },
  {
    name: 'False Cubic',
    nick: 'FALSE_CUBIC',
    biome: 'hilbertDelta',
    x: -10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: -8,
        order: 'A',
      },
      {
        x: 16,
        y: -8,
        order: 'B',
      },
      {
        x: 24,
        y: -16,
        order: 'C',
      },
    ],
    sledders: [{}],
  },
  {
    name: 'Zig Zag',
    nick: 'ZIG_ZAG',
    biome: 'hilbertDelta',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 16,
        y: -4,
        order: 'A',
      },
      {
        x: 0,
        y: -8,
        order: 'B',
      },
      {
        x: 16,
        y: -12,
        order: 'C',
      },
    ],
    sledders: [{}],
  },
  {
    name: 'Big Bump',
    nick: 'BIG_BUMP',
    biome: 'hilbertDelta',
    x: 0,
    y: -10,
    requirements: ['FALSE_CUBIC'],
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: 4,
      },
      {
        x: 16,
        y: 0,
      },
    ],
    sledders: [{}],
  },
  {
    name: 'Dip Traverse',
    nick: 'DIP_TRAVERSE',
    biome: 'hilbertDelta',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 16,
        y: 0,
        order: 'A',
      },
      {
        x: 8,
        y: -8,
        order: 'B',
      },
    ],
    sledders: [{}],
  },
  ...OOO,
  ...CONVERGENCE,
]
