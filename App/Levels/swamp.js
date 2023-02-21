const SWAMP = [
  {
    name: 'Two Beside',
    nick: 'TWO_BESIDE',
    colors: Colors.biomes.everglades,
    x: -30,
    y: 0,
    requirements: ['TIME_SIN_ESCALATOR_OSCILLATOR'],
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Two Below',
    nick: 'TWO_BELOW',
    colors: Colors.biomes.everglades,
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Four Around',
    nick: 'FOUR_AROUND',
    colors: Colors.biomes.everglades,
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'False Cubic',
    nick: 'FALSE_CUBIC',
    colors: Colors.biomes.everglades,
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Zig Zag',
    nick: 'ZIG_ZAG',
    colors: Colors.biomes.everglades,
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Big Bump',
    nick: 'BIG_BUMP',
    colors: Colors.biomes.everglades,
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Dip Traverse',
    nick: 'DIP_TRAVERSE',
    colors: Colors.biomes.everglades,
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
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  ...OOO,
  ...CONVERGENCE,
]
