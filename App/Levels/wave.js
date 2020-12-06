const WAVE = [{
  name: 'Sin',
  nick: 'SIN',
  colors: Colors.biomes.arches,
  x: 20,
  y: -20,
  requirements: ['PARABOLA_TRANSLATE_SCALE_X_Y'],
  defaultExpression: 'sin(x)',
  goals: [
    {
      type: 'path',
      expression: '-sin(x)',
      x: 1,
      y: 0,
      pathX: 2.5,
    },
    {
      type: 'path',
      expression: '-sin(x)',
      x: TAU+1,
      y: 0,
      pathX: 2.5,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: 0,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: TAU,
    y: 0
  }],
},
{
  name: 'Cos',
  nick: 'COS',
  colors: Colors.biomes.arches,
  x: 20,
  y: 0,
  requirements: ['SIN'],
  defaultExpression: '-cos(x)',
  goals: [
    {
      type: 'path',
      expression: 'cos(x)',
      x: 1,
      y: 0,
      pathX: 4.5,
    },
    {
      type: 'path',
      expression: 'cos(x)',
      x: TAU+1,
      y: 0,
      pathX: 4.5,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: 0,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: TAU,
    y: 0
  }],
},
{
  name: 'Cos',
  nick: 'COS_SCALE_X_Y',
  colors: Colors.biomes.arches,
  x: 0,
  y: -20,
  requirements: [null, 'SIN_SCALE_X'],
  defaultExpression: 'cos(x)',
  goals: [
    {
      type: 'path',
      expression: '-cos(x/2)',
      x: -TAU+1.5,
      y: 0,
      pathX: 4.5,
    },
    {
      type: 'path',
      expression: '-cos(x/2)',
      x: TAU-1.5,
      y: 0,
      pathX: -4.5,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: -TAU+0.1,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: TAU-0.1,
    y: 0
  }],
},
{
  name: 'Sin Translate X',
  nick: 'SIN_TRANSLATE_X',
  colors: Colors.biomes.arches,
  x: 0,
  y: -20,
  requirements: ['SIN'],
  defaultExpression: 'sin(x+1)',
  goals: [
    {
      type: 'path',
      expression: 'cos(x)',
      x: 1,
      y: 0,
      pathX: 4,
    },
    {
      type: 'path',
      expression: 'cos(x)',
      x: TAU+1,
      y: 0,
      pathX: 4,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: 0,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: TAU,
    y: 0
  }],
},
{
  name: 'Sin Translate XY',
  nick: 'SIN_TRANSLATE_X_Y',
  colors: Colors.biomes.arches,
  x: 0,
  y: -20,
  requirements: [null],
  defaultExpression: 'cos(x)',
  goals: [
    
    {
      type: 'path',
      expression: 'cos(x-1)+4',
      x: 2,
      y: 0,
      pathX: 4,
    },
    {
      type: 'path',
      expression: 'cos(x-1)+4',
      x: TAU+2,
      y: 0,
      pathX: 4,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: 1,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: TAU+1,
    y: 0
  }],
},
{
  name: 'Sin Scale X',
  nick: 'SIN_SCALE_X',
  colors: Colors.biomes.arches,
  x: 10,
  y: -10,
  requirements: ['SIN'],
  defaultExpression: 'sin(x/1)',
  goals: [
    {
      type: 'path',
      expression: 'sin(x/2)',
      x: -1,
      y: 0,
      pathX: -5,
    },
    {
      type: 'path',
      expression: 'sin(x/2)',
      x: TAU+1,
      y: 0,
      pathX: 5,
    },
  ],
  sledders: [{
    asset: 'images.sam_sled',
    x: 0,
    y: 0
  },{
    asset: 'images.lunchbox_sled',
    x: TAU,
    y: 0
  }],
},
{
  name: 'Sin Scale XY',
  nick: 'SIN_SCALE_X_Y',
  colors: Colors.biomes.arches,
  x: 0,
  y: -20,
  requirements: [null],
  defaultExpression: 'sin(x)',
  goals: [
    {
      type: 'path',
      expression: '-sin(x/3)*2',
      x: TAU-1,
      y: 0,
      pathX: -5,
    },
    {
      type: 'path',
      expression: '-sin(x/3)*2',
      x: TAU+1,
      y: 0,
      pathX: 5,
    },
  ],
  sledders: [{
    x: -TAU*2/3,
    y: 0
  }],
}]