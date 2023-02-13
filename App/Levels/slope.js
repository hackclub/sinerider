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
        type: 'path',
        expression: 'x',
        pathX: -4,
        x: -2,
        y: 0,
      },
    ],
    sledders: [
      {
        speech: [
          {
            speakerX: -0.4,
            content: 'Remember, follow the WHOLE path.',
            direction: 'up-up-left',
            distance: 1.5,
          },
          {
            speakerX: 0.3,
            content: 'I know how to do this, Ada!',
            direction: 'right-up',
            distance: 1,
          },
        ],
      },
    ],
    texts: [
      {
        x: -3,
        y: -2,
        size: 0.4,
        align: 'right',
        content: 'This is your objective →',
      },
      {
        x: -3.1,
        y: -6.8,
        size: 0.4,
        align: 'center',
        content: 'Edit this function to hit it!',
      },
    ],
    slider: {
      expression: 'nx',
      bounds: [-1, 1, -1],
    },
    textBubbles: [
      {
        content: 'Click here to edit your function',
        domSelector: '#expression-envelope',
        place: 'top-right',
        destroyOnClick: true,
      },
      {
        content: 'slide me up',
        domSelector: '#dotted-slider-box',
        place: 'bottom-left',
        destroyOnClick: true,
      },
    ],
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [      
    ],
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
            speakerX: -0.4,
            content: '…forward this time? Please?',
            direction: 'up',
            distance: 1.5,
          },
          {
            speakerX: 0.3,
            content: 'Wuss.',
            direction: 'up-right',
            distance: 1,
          },
        ],
      },
    ],
    slider: { expression: 'nx', bounds: [-1, 1, 1] },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [      
    ],
  },
  {
    name: 'A real steep hill',
    nick: 'SLOPE_STEEPER',
    colors: Colors.biomes.alps,
    x: 5,
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
            speakerX: -0.4,
            content: 'Wuss!',
            direction: 'up-up-left',
            distance: 1.3,
          },
          {
            speakerX: 0.3,
            content: '…shut up.',
            direction: 'up-right-right',
            distance: 1,
            speech: {
              content: 'This seems dangerous.',
              distance: 1,
            },
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
    sprites: [      
    ],
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
    sprites: [      
    ],
  },
  {
    name: 'Moving up in the world',
    nick: 'SLOPE_HIGHER',
    colors: Colors.biomes.alps,
    x: 5,
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
    sprites: [
    ],
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
            speakerX: -0.4,
            content: 'I love you.',
            direction: 'up',
            distance: 1.5,
          },
          {
            speakerX: 0.4,
            content: 'I love you too, Sam.',
            direction: 'right-up',
            distance: 0.75,
          },
        ],
      },
    ],
    slider: { expression: '-x + n', bounds: [-2, 0, 0] },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    sprites: [      
    ],
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
    ],
    sledders: [
      {
        asset: 'images.benny_sled',
        speech: [
          {
            speakerX: 0.4,
            y: 0.5,
            content: 'I wanna see it. Could be a shortcut.',
            direction: 'up-up-left',
            distance: 1.5,
            speech: {
              content: 'Woah, see that canyon down there??',
              direction: 'up',
              distance: 1.5,
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
  VOLCANO,
]
