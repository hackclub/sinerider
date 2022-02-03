const SLOPE = [{
  name: 'A Solid Slope',
  nick: 'SLOPE_POSITIVE',
  colors: Colors.biomes.alps,
  x: 10,
  y: 0,
  camera: {
    x: -2,
    y: -2,
    fov: 7,
  },
  requirements: null,
  defaultExpression: '-x',
  hint: 'hint: x makes a slope',
  goals: [
    {
      type: 'path',
      expression: 'x',
      pathX: -6,
      x: -2,
      y: 0,
    },
  ],
  sledders: [{
    speech: [{
      speakerX: -0.4,
      content: 'Ready to go?',
      direction: 'up-up-left',
      distance: 1.5,
    },{
      speakerX: 0.3,
      content: 'Let’s do it!',
      direction: 'right-up',
      distance: 1,
    }]
  }],
},
{
  name: 'Try facing forwards?',
  nick: 'SLOPE_NEGATIVE',
  colors: Colors.biomes.alps,
  x: 10,
  y: 0,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: null,
  defaultExpression: 'x',
  hint: 'hint: go negative',
  goals: [
    {
      type: 'path',
      expression: '-x',
      pathX: 6,
      x: 2,
      y: 0,
    },
  ],
  sledders: [{
    speech: [{
      speakerX: -0.4,
      content: '…forward this time? Please?',
      direction: 'up',
      distance: 1.5,
    },{
      speakerX: 0.3,
      content: 'Wuss.',
      direction: 'up-right',
      distance: 1,
    }]
  }],
},
/*{
  name: 'Constant Lake',
  nick: 'SLOPE_CONVERSATION_1',
  colors: Colors.biomes.alps,
  radius: 2,
  x: 7.5,
  y: 0,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: ['SLOPE_NEGATIVE'],
  defaultExpression: '\\frac{2}{1+\\frac{1}{e^{x-5}}}+\\frac{-8}{1+\\frac{1}{e^{x-32}}}',
  hint: 'hint: go negative',
  directors: [{
    type: 'lerp',
    point0: [-1, 0],
    point1: [8, 0],
    state0: {
      position: [-2, 2],
      fov: 5,
    },
    state1: {
      position: [10, 4],
      fov: 12,
    },
  }],
  goals: [],
  sledders: [],
  walkers: [{
    x: -4,
    asset: 'images.benny_float',
  }],
},*/
{
  name: 'A real steep hill',
  nick: 'SLOPE_STEEPER',
  colors: Colors.biomes.alps,
  x: 10,
  y: -10,
  camera: {
    x: 2,
    y: -5.5,
    fov: 11,
  },
  requirements: ['SLOPE_NEGATIVE'],
  defaultExpression: '-x',
  hint: 'hint: try multiplying',
  goals: [
    {
      type: 'path',
      expression: '-x*2',
      pathX: 6,
      x: 2,
      y: 0,
    },
  ],
  sledders: [{
    speech: [{
      speakerX: -0.4,
      content: 'Wuss!',
      direction: 'up-up-left',
      distance: 1.3,
    },{
      speakerX: 0.3,
      content: '…shut up.',
      direction: 'up-right-right',
      distance: 1,
      speech: {
        content: 'This seems dangerous.',
        distance: 1,
      }
    }]
  }],
},
{
  name: 'The bunny slope',
  nick: 'SLOPE_SHALLOWER',
  colors: Colors.biomes.alps,
  x: 10,
  y: 0,
  camera: {
    x: 2,
    y: 0,
    fov: 7,
  },
  requirements: null,
  hint: 'hint: what’s the opposite of multiplying?',
  defaultExpression: '-x',
  goals: [
    {
      type: 'path',
      expression: '-x/2',
      pathX: 6,
      x: 2,
      y: 0,
    },
  ],
  sledders: [{
    speech: [{
      speakerX: -0.4,
      content: 'But also definitely less fun.',
      direction: 'up',
      distance: 1.5,
      speech: {
        content: 'This is definitely safer.',
        direction: 'up-up-left',
        distance: 0.8,
      }
    },{
      speakerX: 0.3,
      content: 'There’s probably a connection there.',
      direction: 'right-up',
      distance: 0.8,
    }]
  }],
},
{
  name: 'Moving up in the world',
  nick: 'SLOPE_HIGHER',
  colors: Colors.biomes.alps,
  x: 10,
  y: 10,
  camera: {
    x: 5,
    y: 2,
    fov: 9,
  },
  requirements: ['SLOPE_NEGATIVE'],
  defaultExpression: '-x-3',
  hint: 'hint: add a constant',
  goals: [
    {
      type: 'path',
      expression: '-x+7',
      pathX: 6,
      x: 2,
      y: 0,
    },
  ],
  sledders: [{
    speech: [{
      speakerX: -0.4,
      content: '…sorry.',
      direction: 'up-left',
      distance: 1,
      speech: {
        content: 'Things seem better today!',
        distance: 1,
      }
    },{
      speakerX: 0.3,
      content: 'Yeah. Can we not talk about it?',
      direction: 'right-up-up',
      distance: 1.3,
    }]
  }],
},
{
  name: 'About halfway down',
  nick: 'SLOPE_LOWER',
  colors: Colors.biomes.alps,
  x: 10,
  y: 0,
  camera: {
    x: 2,
    y: -4,
    fov: 11,
  },
  requirements: null,
  defaultExpression: '-x',
  hint: 'hint: if adding makes it go up…',
  goals: [
    {
      type: 'path',
      expression: '-x-3',
      pathX: 4,
      x: 3,
      y: 0,
    },
  ],
  sledders: [{
    speech: [{
      speakerX: -0.4,
      content: 'I love you.',
      direction: 'up',
      distance: 1.5,
    },{
      speakerX: 0.4,
      content: 'I love you too, Sam.',
      direction: 'right-up',
      distance: 0.75,
    }]
  }],
},
{
  name: 'We\'re at the bottom',
  nick: 'SLOPE_SCALE_TRANSLATE',
  colors: Colors.biomes.alps,
  x: 10,
  y: -10,
  camera: {
    x: 10,
    y: -5,
    fov: 12,
  },
  requirements: [
    'SLOPE_LOWER',
    'SLOPE_SHALLOWER',
  ],
  defaultExpression: '-\\frac{x}{2}',
  hint: 'put it all together!',
  goals: [
    {
      type: 'path',
      expression: '-x/3-5',
      pathX: 18,
      x: 3,
      y: 0,
    },
  ],
  sprites: [{
    x: 4,
    size: 2,
    asset: 'images.sam_float',
    speech: [{
      speakerX: -0.4,
      content: 'I’m gonna split off and check out the valley.',
      direction: 'up-up-right',
      distance: 1.5,
    }]
  }],
  sledders: [{
    asset: 'images.lunchbox_sled',
    speech: [{
      speakerX: 0.3,
      content: 'catch up with you later!',
      direction: 'up-up-left',
      distance: 1,
    }]
  }],
}]