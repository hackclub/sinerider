const PARABOLA = [
  {
    name: 'Way too steep for us.',
    nick: 'PARABOLA_NEGATE',
    biome: 'valleyParabola',
    x: 20,
    y: 20,
    requirements: ['SLOPE_SCALE_TRANSLATE'],
    defaultExpression: '-x^2',
    hint: 'do as she says!',
    slider: {
      expression: '$\\cdot x^2',
      bounds: [-1, 0, -1],
    },
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
        x: -2.5,
        y: 0,
        speech: [
          {
            x: 0.5,
            y: 0.6,
            content: 'Be positive.',
            direction: 'up-up-right',
            distance: 1,
          },
        ],
      },
    ],
    sprites: [],
  },
  {
    name: 'Translate Y',
    nick: 'PARABOLA_TRANSLATE_Y',
    biome: 'valleyParabola',
    x: 10,
    y: 0,
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: 'x^2-1',
    hint: 'hint: subtract from (everything)',
    slider: {
      expression: 'x^2+$',
      bounds: [-2, 2, -1],
    },
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
        speech: [
          {
            x: 0.5,
            y: 0.6,
            content: 'Easier to move with only one!',
            direction: 'up-up-right',
            distance: 1,
          },
        ],
        x: -2,
        y: 0,
      },
    ],
  },
  {
    name: 'Translate X',
    nick: 'PARABOLA_TRANSLATE_X',
    biome: 'valleyParabola',
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
    slider: {
      expression: '\\left(x+$\\right)^2',
      bounds: [-2, 2, 0],
    },
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
        speech: [
          {
            x: 0.5,
            y: 0.6,
            content: 'Although I guess ghosts don\'t weigh much...',
            direction: 'up-up-right',
            distance: 1.5,
          },
        ],
        x: -1,
        y: 0,
      },
    ],
  },
  {
    name: 'Translate XY',
    nick: 'PARABOLA_TRANSLATE_X_Y',
    biome: 'valleyParabola',
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
        speech: [
          {
            x: 0.5,
            y: 0.6,
            content: 'If he hadn\'t stopped every 20 ft, every level would be this easy!',
            direction: 'up-up-right',
            distance: 1.75,
          },
        ],
        x: -1,
        y: 0,
      },
    ],
  },
  {
    name: 'Way too steep for us.',
    nick: 'PARABOLA_SCALE_Y',
    biome: 'valleyParabola',
    x: 0,
    y: 10,
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: '\\left(\\frac{x}{4}\\right)^2',
    slider: {
      expression: '\\left(\\frac{x}{$}\\right)^2',
      bounds: [1, 6, 4],
    },
    goals: [
      {
        type: 'path',
        expression: '(x/8)^2',
        x: -8,
        y: 0,
        pathX: 16,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        // speech: [
        //   {
        //     x: 0.5,
        //     y: 0.6,
        //     content: 'I hope he didn\'t fall.',
        //     direction: 'up',
        //     distance: 1,
        //   },
        // ],
        x: -12,
        y: 0,
      },
    ],
  },
  {
    name: 'Scale X',
    nick: 'PARABOLA_SCALE_X',
    biome: 'valleyParabola',
    x: 10,
    y: 10,
    requirements: null,
    slider: {
      expression: '\\left(\\frac{x}{$}\\right)^2',
      bounds: [3, 5, 4],
    },
    defaultExpression: 'x^2',
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
        // speech: [
        //   {
        //     x: 0.5,
        //     y: 0.6,
        //     content: 'Jack would go and check...',
        //     direction: 'up',
        //     distance: 1,
        //     speech: {
        //       content: 'Ok also why are the islands floating?',
        //       distance: 1,
        //       direction: 'up',
        //     },
        //   },
        // ],
        speech: [
          {
            x: 0.5,
            y: 0.6,
            content: 'I hope he doesn\'t fall.',
            direction: 'up-up-right',
            distance: 1.5,
          },
        ],
        x: -5,
        y: 0,
      },
    ],
  },
  {
    name: 'Translate Scale X',
    nick: 'PARABOLA_TRANSLATE_SCALE_X',
    biome: 'valleyParabola',
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
        speech: [
          {
            x: 0.5,
            y: 0.6,
            content: 'At least it wasn\'t so quiet when he was here.',
            direction: 'up-up-right',
            distance: 1,
          },
        ],
        x: 3,
        y: 0,
      },
    ],
  },
  {
    name: 'Translate Scale XY',
    nick: 'PARABOLA_TRANSLATE_SCALE_X_Y',
    biome: 'valleyParabola',
    x: 20,
    y: 0,
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
        speech: [
          {
            speakerX: 0.5,
            speakerY: 0.4,
            color: '#fff',
            content: 'I do miss him.',
            direction: 'up-up-right',
            distance: 1.5,
          },
        ],
      },
    ],
  },
]
