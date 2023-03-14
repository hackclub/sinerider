const SLOPE = [
  {
    name: 'A Solid Slope',
    nick: 'SLOPE_POSITIVE',
    biome: 'westernSlopes',
    x: 10,
    y: 0,
    requirements: ['HELLO_WORLD'],
    flashMathField: true,
    defaultExpression: '-x',
    goals: [
      {
        x: -2,
        y: -2,
      },
      {
        x: -4,
        y: -4,
      },
      {
        x: -6,
        y: -6,
      },
    ],
    sledders: [
      {
        // speech: [
        //   {
        //     speakerX: -0.4,
        //     content: 'Remember, follow the WHOLE path.',
        //     direction: 'up-up-left',
        //     distance: 1.5,
        //   },
        //   {
        //     speakerX: 0.3,
        //     content: 'I know how to do this, Ada!',
        //     direction: 'right-up',
        //     distance: 1,
        //   },
        // ],
      },
    ],
    texts: [
      {
        x: -1.5,
        y: 0.6,
        size: 0.6,
        align: 'right',
        // fill: '#fff',
        content: 'Edit the function to sled through the squares',
      },
    ],
    slider: {
      expression: '$\\cdot x',
      bounds: [-1, 1, -1],
    },
    textBubbles: [
      {
        content: 'Edit function here',
        domSelector: '#expression-envelope',
        place: 'top-right',
        destroyOnClick: true,
      },
      {
        content: 'Click here to sled',
        domSelector: '#run-button',
        place: 'top-left',
        destroyOnClick: true,
        // style: { fontSize: '1.1rem' },
      },
      // {
      //   content: 'Click here ',
      //   domSelector: '#dotted-math-button',
      //   place: 'top-left',
      //   destroyOnClick: true,
      // },
    ],
    sprites: [],
  },
  {
    name: 'Try facing forwards?',
    nick: 'SLOPE_NEGATIVE',
    biome: 'westernSlopes',
    x: 10,
    y: 0,
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
    sledders: [
      {
        speech: [
          {
            speakerX: -0.25,
            speakerY: 0.6,
            content: '…forward this time? Please?',
            direction: 'up-up-left',
            distance: 2,
          },
          {
            speakerX: 0.35,
            speakerY: 0.6,
            content: 'Wuss.',
            direction: 'up-up-right',
            distance: 1.2,
          },
        ],
      },
    ],
    texts: [
      {
        x: 3,
        y: 0.6,
        size: 0.6,
        align: 'left',
        // fill: '#fff',
        content: 'Well done! Now sled through this path',
      },
    ],
    slider: { expression: '$\\cdot x', bounds: [-1, 1, 1] },
    sprites: [],
  },
  {
    name: 'A real steep hill',
    nick: 'SLOPE_STEEPER',
    biome: 'westernSlopes',
    x: 10,
    y: -10,
    requirements: ['SLOPE_NEGATIVE'],
    defaultExpression: '-5x',
    slider: {
      expression: '$x',
      bounds: [-6, -3, -5],
    },
    texts: [
      {
        x: 2,
        y: 4,
        size: 1,
        align: 'left',
        content: 'ABC goals must be hit in order',
      },
    ],
    goals: [
      {
        order: 'A',
        x: 2,
        y: -4,
      },
      {
        order: 'B',
        x: 4,
        y: -8,
      },
      {
        order: 'C',
        x: 6,
        y: -12,
      },
    ],
    sledders: [
      {
        speech: [
          {
            x: -0.3,
            y: 0.6,
            content: 'Steep!',
            direction: 'up-up-left',
            distance: 1.2,
          },
          // {
          //   speakerX: 0.4,
          //   speakerY: 0.7,
          //   content: 'Steep.',
          //   direction: 'right-up',
          //   distance: 1.4,
          //   // speech: {
          //   //   content: 'This seems dangerous.',
          //   //   distance: 1,
          //   // },
          // },
        ],
      },
    ],
    sprites: [],
  },
  {
    name: 'The bunny slope',
    nick: 'SLOPE_SHALLOWER',
    biome: 'westernSlopes',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '\\frac{x}{2}',
    slider: {
      expression: '-\\frac{x}{$}',
      bounds: [1, 2, 1],
    },
    goals: [
      {
        x: 4,
        y: -1,
        order: 'A',
      },
      {
        type: 'path',
        expression: '-x/4',
        pathX: 4,
        x: 6,
        y: 0,
        order: 'B',
      },
    ],
    sledders: [
      {
        speech: [
          {
            speakerX: -0.4,
            speakerY: 0.7,
            content: '…yes.',
            direction: 'up-up-left',
            distance: 1.4,
            speech: {
              content: 'No.',
              direction: 'up',
              distance: 0.8,
            },
          },
          {
            speakerX: 0.7,
            speakerY: 0.7,
            content: 'Do you want my scarf?',
            direction: 'right-up-up',
            distance: 2.2,
            speech: {
              content: 'Are you cold?',
              direction: 'up-up-left',
              distance: 1.2,
            },
          },
        ],
      },
    ],
    sprites: [],
  },
  {
    name: 'Moving up in the world',
    nick: 'SLOPE_HIGHER',
    biome: 'westernSlopes',
    x: 10,
    y: 10,
    camera: {
      x: 5,
      y: 2,
      fov: 9,
    },
    requirements: ['SLOPE_NEGATIVE'],
    defaultExpression: '-x-3',
    slider: {
      expression: '-x+$',
      bounds: [-3, 3, -3],
    },
    goals: [
      {
        type: 'path',
        expression: '-x+8',
        pathX: 4,
        x: 3,
        y: 0,
      },
    ],
    sledders: [
      {
        speech: [
          {
            y: 0.6,
            speakerX: -0.4,
            // speakerY: 0.6,
            content: '…ok.',
            direction: 'up-left',
            distance: 1,
            speech: {
              content: "Hey, I'm sorry about last night.",
              distance: 1,
            },
          },
          {
            y: 0.7,
            speakerX: 0.5,
            // speakerY: 0.7,
            content: 'Yeah. Can we not talk about it?',
            direction: 'right-up-up',
            distance: 1.25,
          },
        ],
      },
    ],
    sprites: [],
  },
  {
    name: 'About halfway down',
    nick: 'SLOPE_LOWER',
    biome: 'westernSlopes',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '-x+1',
    goals: [
      {
        type: 'path',
        expression: '-x-3',
        pathX: 4,
        x: 3,
        y: 0,
      },
    ],
    sledders: [
      {
        speech: [
          {
            x: -0.3,
            y: 0.65,
            content: 'I love you.',
            direction: 'up',
            distance: 1.2,
          },
          {
            x: 0.5,
            y: 0.7,
            content: 'love you too, Ada.',
            direction: 'right-up',
            distance: 0.6,
          },
        ],
      },
    ],
    slider: { expression: '-x+$', bounds: [-1, 2, 1] },
    sprites: [],
  },
  CONSTANT_LAKE,
  {
    name: "We're at the bottom",
    nick: 'SLOPE_SCALE_TRANSLATE',
    biome: 'westernSlopes',
    x: 10,
    y: 0,
    backgroundMusic: 'sounds.music.birds',
    requirements: ['CONSTANT_LAKE'],
    defaultExpression: '-\\frac{x}{2}',
    hint: 'put it all together!',
    goals: [
      {
        type: 'path',
        expression: '-x/3-5',
        pathX: 14,
        x: 3,
        y: 0,
      },
    ],
    sprites: [
      {
        x: 3,
        size: 2,
        asset: 'images.sam_float',
        speech: [
          {
            speakerX: 0.3,
            speakerY: -0.4,
            content: '…do whatever you want.',
            direction: 'up-right',
            distance: 1,
          },
        ],
      },
    ],
    sledders: [
      {
        asset: 'images.benny_sled',
        speech: [
          {
            speakerX: 0.2,
            y: 0.7,
            content: 'We never get to do my things.',
            direction: 'up-up-left',
            distance: 1,
            speech: {
              content: 'I want to see this canyon.',
              direction: 'up',
              distance: 1,
            },
          },
        ],
      },
    ],
  },
]
