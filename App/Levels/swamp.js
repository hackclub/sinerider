const SWAMP = [
  {
    name: 'Two Beside',
    nick: 'TWO_BESIDE',
    biome: 'hilbertDelta',
    x: -30,
    y: 0,
    requirements: ['TIME_SIN_PARABOLA_OSCILLATOR'],
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: 0,
      },
      {
        x: 8,
        y: -8,
      },
    ],
    sledders: [{}],
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
    sledders: [{}],
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
        y: -8,
      },
      {
        x: 8,
        y: 0,
      },
      {
        x: 0,
        y: 8,
      },
      {
        x: -8,
        y: 0,
      },
    ],
    sledders: [{}],
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
