const SLOPE = [
  {
    name: 'A Solid Slope',
    nick: 'SLOPE_POSITIVE',
    colors: Colors.biomes.alps,
    x: 10,
    y: 0,
    camera: {
      x: 0,
      y: 0,
      fov: 7,
    },
    requirements: ['HELLO_WORLD'],
    flashMathField: true,
    defaultExpression: '-x',
    hint: 'hint: x makes a slope',
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
      expression: 'nx',
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
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [],
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
    slider: { expression: 'nx', bounds: [-1, 1, 1] },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [],
  },
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
    sledders: [
      {
        speech: [
          {
            x: -0.4,
            y: 0.65,
            content: 'Woah.',
            direction: 'up-up-left',
            distance: 1.2,
          },
          {
            x: 0.4,
            y: 0.7,
            content: 'Steep.',
            direction: 'up-right-right',
            distance: 0.6,
            // speech: {
            //   content: 'This seems dangerous.',
            //   distance: 1,
            // },
          },
        ],
      },
    ],
    slider: {
      expression: 'nx',
      bounds: [-1.5, -1, -1],
    },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [],
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
    slider: { expression: '\\frac{-x}{n}', bounds: [1, 1.5, 1] },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [],
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
    sledders: [
      {
        speech: [
          {
            speakerX: -0.4,
            content: '…sorry.',
            direction: 'up-left',
            distance: 1,
            speech: {
              content: 'Things seem better today!',
              distance: 1,
            },
          },
          {
            speakerX: 0.3,
            content: 'Yeah. Can we not talk about it?',
            direction: 'right-up-up',
            distance: 1.3,
          },
        ],
      },
    ],
    slider: { expression: '-x + n', bounds: [-3, 1, -3] },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [],
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
    slider: { expression: '-x + n', bounds: [-2, 0, 0] },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [],
  },
  CONSTANT_LAKE,
  {
    name: "We're at the bottom",
    nick: 'SLOPE_SCALE_TRANSLATE',
    colors: Colors.biomes.alps,
    x: 10,
    y: 0,
    camera: {
      x: 10,
      y: -5,
      fov: 12,
    },
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
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
  },
]
