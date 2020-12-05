const LOGISTIC = [{
  name: 'logistic',
  nick: 'LOGISTIC',
  colors: Colors.biomes.mojave,
  x: -10,
  y: -10,
  requirements: ['SIN_TRANSLATE_X_Y'],
  defaultExpression: '1/(1+x^2)',
  goals: [
    {
      order: 'C',
      x: -5,
      y: 0
    },
    {
      order: 'B',
      x: -3,
      y: 0
    },
    {
      order: 'A',
      x: -1,
      y: 0
    },
    {
      order: 'A',
      x: 6,
      y: 0
    },
    {
      order: 'B',
      x: 8,
      y: 0
    },
    {
      order: 'C',
      x: 10,
      y: 0
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: 1,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: 3,
    y: 0
  }],
},{
  name: 'logistic',
  nick: 'LOGISTIC_PARABOLA',
  colors: Colors.biomes.mojave,
  x: -10,
  y: -10,
  requirements: ['LOGISTIC'],
  defaultExpression: '1/(1+x^2)',
  goals: [
    {
      order: 'C',
      x: -8,
      y: 1,
    },
    {
      order: 'B',
      x: -6,
      y: 1/4,
    },
    {
      order: 'A',
      x: -4,
      y: 0,
    },
    {
      order: 'A',
      x: 4,
      y: 0,
    },
    {
      order: 'B',
      x: 6,
      y: 1/4,
    },
    {
      order: 'C',
      x: 8,
      y: 1,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: -1,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: 1,
    y: 0
  }],
},{
  name: 'logistic reorder',
  nick: 'LOGISTIC_REORDER',
  colors: Colors.biomes.mojave,
  x: -10,
  y: 0,
  requirements: ['LOGISTIC'],
  defaultExpression: '1/(1+(x+8)^2) + 1/(1+(x+1)^2)',
  goals: [
    {
      order: 'B',
      x: -2,
      y: 0.5
    },
    {
      type: 'dynamic',
      order: 'A',
      x: 0,
      y: 0.5
    },
    {
      order: 'C',
      x: 2,
      y: 0.5
    },
  ],
  sledders: [{
    x: -8,
    y: 0
  }],
},{
  name: 'logistic reorder 2',
  nick: 'LOGISTIC_REORDER_2',
  colors: Colors.biomes.mojave,
  x: -10,
  y: 0,
  requirements: [null],
  defaultExpression: '1/(1+(x+8)^2) + 1/(1+(x+1-t)^2)',
  goals: [
    {
      order: 'B',
      x: -2,
      y: 0.5
    },
    {
      order: 'C',
      x: 2,
      y: 0.5
    },
  ],
  sledders: [{
    x: -8,
    y:0.5
  },{
    x: 0,
    y:0.5
  },{
    x: 2,
    y: 0.5
  }],
},{
  name: 'logistic jump',
  nick: 'LOGISTIC_JUMP',
  colors: Colors.biomes.mojave,
  x: -10,
  y: 0,
  requirements: [null],
  defaultExpression: '1/(1+(x+8)^2) - 1/(1+x^2) + 1/(1+(x-8)^2)',
  goals: [
    {
      order: 'A',
      x: -4,
      y: 0.5
    },
    {
      order: 'C',
      x: 2,
      y: 0.5
    },
    {
      order: 'B',
      x: 6,
      y: 0.5
    },
  ],
  sledders: [{
    x: -8,
    y: 0
  }],
}]