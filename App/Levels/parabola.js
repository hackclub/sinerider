const PARABOLA = [
  {
    name: 'Way too steep for us.',
    nick: 'PARABOLA_NEGATE',
    colors: Colors.biomes.champlain,
    x: 10,
    y: 10,
    camera: {
      x: 0,
      y: 0,
      fov: 8,
    },
    requirements: ['SLOPE_SCALE_TRANSLATE'],
    defaultExpression: '-x^2',
    hint: 'do as she says!',
    goals: [
      {
        type: 'path',
        expression: 'x^2',
        pathX: 3,
        x: -1.5,
        y: 0,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -2,
        y: 0,
        speech: [
          {
            speakerX: 0.5,
            speakerY: 0.5,
            content: 'Be positive.',
            direction: 'up-right',
            distance: 1.2,
          },
        ],
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
    sprites: [
    ],
  },
  {
    name: 'Translate Y',
    nick: 'PARABOLA_TRANSLATE_Y',
    colors: Colors.biomes.champlain,
    x: 10,
    y: 0,
    camera: {
      x: 0,
      y: 0,
      fov: 8,
    },
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: 'x^2-1',
    hint: 'hint: subtract from (everything)',
    goals: [
      {
        type: 'path',
        expression: 'x^2-3',
        pathX: 3,
        x: -1.5,
        y: 0,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -2,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Translate X',
    nick: 'PARABOLA_TRANSLATE_X',
    colors: Colors.biomes.champlain,
    x: 10,
    y: 10,
    camera: {
      x: -2,
      y: 5,
      fov: 8,
    },
    requirements: null,
    defaultExpression: '(x-2)^2',
    hint: 'hint: add to (x)',
    goals: [
      {
        type: 'path',
        expression: '(x+3)^2',
        pathX: -3,
        x: -1.5,
        y: 0,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -1,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Translate XY',
    nick: 'PARABOLA_TRANSLATE_X_Y',
    colors: Colors.biomes.champlain,
    x: 10,
    y: 10,
    camera: {
      x: -2,
      y: 0,
      fov: 8,
    },
    requirements: null,
    defaultExpression: '(x-1)^2+2',
    hint: 'seeing a pattern yet?',
    goals: [
      {
        type: 'path',
        expression: '(x+3)^2-4',
        pathX: -3,
        x: -1.5,
        y: 0,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -1,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Way too steep for us.',
    nick: 'PARABOLA_SCALE_Y',
    colors: Colors.biomes.champlain,
    x: 0,
    y: 10,
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: 'x^2',
    goals: [
      {
        type: 'path',
        expression: 'x^2/4',
        x: -4,
        y: 0,
        pathX: 8,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -5,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Scale X',
    nick: 'PARABOLA_SCALE_X',
    colors: Colors.biomes.champlain,
    x: 10,
    y: 10,
    requirements: null,
    defaultExpression: '\\left(\\frac{x}{4}\\right)^2',
    hint: '(x/4)^2 = x^2/4^2 = x^2/16',
    goals: [
      {
        type: 'path',
        expression: '(x/2)^2',
        x: -4,
        y: 0,
        pathX: 8,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -5,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Translate Scale X',
    nick: 'PARABOLA_TRANSLATE_SCALE_X',
    colors: Colors.biomes.champlain,
    x: -10,
    y: 10,
    requirements: ['PARABOLA_TRANSLATE_X_Y', 'PARABOLA_SCALE_X'],
    defaultExpression: '\\left(\\frac{x-5}{4}\\right)^2',
    hint: '(x/4)^2 = x^2/4^2 = x^2/16',
    goals: [
      {
        type: 'path',
        expression: '((x+3)/2)^2',
        x: 1,
        y: 0,
        pathX: -8,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 3,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Translate Scale XY',
    nick: 'PARABOLA_TRANSLATE_SCALE_X_Y',
    colors: Colors.biomes.champlain,
    x: 0,
    y: 10,
    requirements: null,
    defaultExpression: '\\left(\\frac{x+5}{4}\\right)^2',
    goals: [
      {
        type: 'path',
        expression: '((x-8)/2)^2-4',
        x: 4,
        y: 0,
        pathX: 8,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 2,
        y: 0,
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
  {
    name: 'Parabola Reverse Order',
    nick: 'PARABOLA_REVERSE_ORDER',
    colors: Colors.biomes.champlain,
    x: 0,
    y: 10,
    requirements: null,
    defaultExpression: '\\left(\\frac{x}{8}\\right)^2',
    goals: [
      {
        type: 'dynamic',
        x: 12,
        y: 0,
        order: 'A',
      },
      {
        type: 'dynamic',
        x: 8,
        y: 0,
        order: 'B',
      },
      {
        type: 'dynamic',
        x: 4,
        y: 0,
        order: 'C',
      },
      {
        type: 'dynamic',
        x: -12,
        y: 0,
        order: 'A',
      },
      {
        type: 'dynamic',
        x: -8,
        y: 0,
        order: 'B',
      },
      {
        type: 'dynamic',
        x: -4,
        y: 0,
        order: 'C',
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 0,
        y: 0,
        speech: [
          {
            speakerX: 0.5,
            speakerY: 0.4,
            content: 'I do miss him.',
            direction: 'up-up-right',
            distance: 1.5,
          },
        ],
      },
    ],
    sky: {
      asset: 'images.valley_background',
      margin: 1,
    },
  },
]
