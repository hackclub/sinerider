const OOO = [
  {
    name: 'Out of Order 1',
    nick: 'OUT_OF_ORDER_1',
    colors: Colors.biomes.everglades,
    x: 10,
    y: -10,
    requirements: ['TWO_BESIDE'],
    defaultExpression: '0',
    goals: [
      {
        x: 16,
        y: 0,
        order: 'A',
      },
      {
        x: 8,
        y: 0,
        order: 'B',
      },
    ],
    sledders: [{}],
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Out of Order 2',
    nick: 'OUT_OF_ORDER_2',
    colors: Colors.biomes.everglades,
    x: 0,
    y: -20,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 24,
        y: 0,
        order: 'A',
      },
      {
        x: 8,
        y: 0,
        order: 'B',
      },
      {
        x: 16,
        y: 0,
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
    name: 'Out of Order 3',
    nick: 'OUT_OF_ORDER_3',
    colors: Colors.biomes.everglades,
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 18,
        y: 0,
        order: 'A',
      },
      {
        x: 6,
        y: 0,
        order: 'B',
      },
      {
        x: 24,
        y: 0,
        order: 'C',
      },
      {
        x: 12,
        y: 0,
        order: 'D',
      },
    ],
    sledders: [{}],
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Out of Order 4',
    nick: 'OUT_OF_ORDER_4',
    colors: Colors.biomes.everglades,
    x: -10,
    y: -10,
    requirements: ['OUT_OF_ORDER_2'],
    defaultExpression: '0',
    goals: [
      {
        x: -8,
        y: 0,
        order: 'A',
      },
      {
        x: -4,
        y: 0,
        order: 'B',
      },
      {
        x: 4,
        y: 0,
        order: 'B',
      },
      {
        x: 8,
        y: 0,
        order: 'A',
      },
    ],
    sledders: [{}],
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
  {
    name: 'Out of Order 5',
    nick: 'OUT_OF_ORDER_5',
    colors: Colors.biomes.everglades,
    x: -10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: -12,
        y: 0,
        order: 'C',
      },
      {
        x: -8,
        y: 0,
        order: 'A',
      },
      {
        x: -4,
        y: 0,
        order: 'B',
      },
      {
        x: 4,
        y: 0,
        order: 'B',
      },
      {
        x: 8,
        y: 0,
        order: 'A',
      },
      {
        x: 12,
        y: 0,
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
    name: 'Out of Order 6',
    nick: 'OUT_OF_ORDER_6',
    colors: Colors.biomes.everglades,
    x: 10,
    y: -10,
    requirements: ['OUT_OF_ORDER_2'],
    defaultExpression: '0',
    goals: [
      {
        x: -6,
        y: 0,
        order: 'C',
      },
      {
        x: -3,
        y: 0,
        order: 'A',
      },
      {
        x: 0,
        y: 0,
        order: 'B',
      },
      {
        x: 3,
        y: 0,
        order: 'A',
      },
      {
        x: 6,
        y: 0,
        order: 'C',
      },
    ],
    sledders: [
      { x: -12, y: 0, asset: 'images.sam_sled' },
      { x: 12, y: 0, asset: 'images.lunchbox_sled' },
    ],
    sky: {
      asset: 'images.hilbert_swamp_background',
      margin: 1,
    },
  },
]
