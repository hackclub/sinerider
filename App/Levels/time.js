const TIME = [{
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
      y: -3
    },
    {
      x: 0,
      y: -2
    },
    {
      x: 0,
      y: -1
    },
    {
      x: 0,
      y: 2
    },
    {
      x: 0,
      y: 3
    },
    {
      x: 0,
      y: 4
    }
  ],
  sledders: [{
    asset: 'images.lunchbox_sled',
    speech: [{
      speakerX: 0.3,
      content: '…where did she get the other sled?',
      direction: 'right-right-up',
      distance: 1,
    }]
  }],
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
      y: -3
    },
    {
      x: 0,
      y: -2
    },
    {
      x: 0,
      y: -1
    },
    {
      x: 0,
      y: 2
    },
    {
      x: 0,
      y: 3
    },
    {
      x: 0,
      y: 4
    }
  ],
  sledders: [{
    asset: 'images.lunchbox_sled',
    x: -4,
    y: 0,
  }],
},
{
  name: 'Time Translate X',
  nick: 'TIME_PARABOLA_TRANSLATE_X',
  colors: Colors.biomes.gunnison,
  x: 10,
  y: 10,
  requirements: ['TIME_CONSTANT'],
  defaultExpression: '(x+t)^2',
  goals: [
    {
      x: 2,
      y: 0
    },
    {
      x: 3,
      y: 0
    },
    {
      x: 4,
      y: 0
    },
    {
      x: 5,
      y: 0
    },
    {
      x: 6,
      y: 0
    }
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
    speech: [{
      speakerX: 0.3,
      content: 'So slowly I’ll never see it.',
      direction: 'right-right-up',
      distance: 1,
      speech: {
        content: 'It’s like the river is slicing up the rock',
        direction: 'up-left',
        distance: 1,
        speech: {
          content: 'Canyons freaks me out.',
          direction: 'right-up',
          distance: 1,
        },
      },
    }],
  }],
},
{
  name: 'Time Translate XY',
  nick: 'TIME_PARABOLA_TRANSLATE_X_Y',
  colors: Colors.biomes.gunnison,
  x: 10,
  y: 10,
  requirements: [null],
  defaultExpression: '(x-t)^2',
  goals: [
    {
      x: 2,
      y: 2
    },
    {
      x: 3,
      y: 3
    },
    {
      x: 4,
      y: 4
    },
    {
      x: 5,
      y: 5
    },
    {
      x: 6,
      y: 6
    }
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
    speech: [{
      speakerX: 0.3,
      content: 'Maybe I should tweet these cosmic moments',
      direction: 'right',
      alignment: 'middle',
      distance: 1,
    }],
  }],
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
      x: 2,
      y: 1
    },
    {
      x: 3,
      y: 1.5
    },
    {
      x: 4,
      y: 2
    },
    {
      x: 5,
      y: 2.5
    },
    {
      x: 6,
      y: 3
    }
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
  }],
},
{
  name: 'sin time translate',
  nick: 'TIME_SIN_TRANSLATE_X',
  colors: Colors.biomes.gunnison,
  x: 20,
  y: 0,
  requirements: ['TIME_PARABOLA_TRANSLATE_X', 'SIN_TRANSLATE_X'],
  defaultExpression: 'sin(x-t)',
  goals: [
    {
      x: 2,
      y: 0
    },
    {
      x: 3,
      y: 0
    },
    {
      x: 4,
      y: 0
    },
    {
      x: 5,
      y: 0
    },
    {
      x: 6,
      y: 0
    }
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
  }],
},
{
  name: 'sin time escalate',
  nick: 'TIME_SIN_ESCALATOR',
  colors: Colors.biomes.gunnison,
  x: -10,
  y: -10,
  requirements: [null, 'TIME_PARABOLA_TRANSLATE_X_Y'],
  defaultExpression: 'sin(x-t)+x/5',
  goals: [
    {
      type: 'path',
      expression: 'x/2',
      x: 2,
      y: 0,
      pathX: 5,
    },
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
  }],
},
{
  name: 'sin time oscillate expand',
  nick: 'TIME_SIN_EXPANDING_OSCILLATOR',
  colors: Colors.biomes.gunnison,
  x: -10,
  y: -10,
  requirements: [null],
  defaultExpression: '-cos(x-sin(t))',
  goals: [
    {
      x: -2,
      y: 0,
      order: 'A'
    },
    {
      x: -3,
      y: 0,
      order: 'B'
    },
    {
      x: -4,
      y: 0,
      order: 'C'
    },
    {
      x: 2,
      y: 0,
      order: 'A'
    },
    {
      x: 3,
      y: 0,
      order: 'B'
    },
    {
      x: 4,
      y: 0,
      order: 'C'
    },
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
  }]
},
{
  name: 'sin time oscillate parabola',
  nick: 'TIME_SIN_PARABOLA_OSCILLATOR',
  colors: Colors.biomes.gunnison,
  x: -10,
  y: 0,
  requirements: [null],
  defaultExpression: '\\left(\\frac{x}{4}\\right)^2',
  goals: [
    {
      x: -6,
      y: 6,
      order: 'D'
    },
    {
      x: -6,
      y: 0,
      order: 'C'
    },
    {
      x: 6,
      y: 6,
      order: 'B'
    },
    {
      x: 6,
      y: 0,
      order: 'A'
    },
  ],
  sledders: [{
    x: 0,
    y: 0,
    asset: 'images.lunchbox_sled',
  }]
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
      order: 'B'
    },
    {
      x: -6,
      y: -1,
      order: 'A'
    },
    {
      x: 0,
      y: 0,
      order: 'C'
    },
    {
      x: 9,
      y: 3,
      order: 'B'
    },
    {
      x: 6,
      y: -1,
      order: 'A'
    },
  ],
  sledders: [{
    x: 3,
    y: 0,
    asset: 'images.lunchbox_sled',
  },{
    x: -3,
    y: 0,
    asset: 'images.sam_sled',
  }]
}]