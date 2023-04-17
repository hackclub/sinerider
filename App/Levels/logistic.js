const LOGISTIC = [
  {
    name: 'logistic',
    nick: 'LOGISTIC',
    biome: 'logisticDunes',
    x: 0,
    y: -30,
    requirements: ['SIN_SCALE_X_Y'],
    defaultExpression: '\\frac{1}{1+x^2}',
    // slider: {
    //   expression: '\\frac{1}{1+\\left(x+$\\right)^2}',
    //   bounds: [-3, 1, -1],
    // },
    goals: [
      {
        order: 'C',
        x: -5,
        y: 0,
      },
      {
        order: 'B',
        x: -3,
        y: 0,
      },
      {
        order: 'A',
        x: -1,
        y: 0,
      },
      {
        order: 'A',
        x: 6,
        y: 0,
      },
      {
        order: 'B',
        x: 8,
        y: 0,
      },
      {
        order: 'C',
        x: 10,
        y: 0,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: 1,
        y: 0,
        speech: [
          {
            x: 0.3,
            y: 0.65,
            content: "And we\'ll go back to sharing as soon as we get the checkpoints.",
            direction: 'up-up-left',
            distance: 1,
            content: {
              direction: 'up-up-left',
              content: 'You grab those ones over there!',
              distance: 1.5,
            }
          },
        ],
      },
      {
        asset: 'images.lunchbox_sled',
        speech: [
          {
            x: 0.3,
            y: 0.65,
            content: 'You literally just asked to share a sled again...',
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
    name: 'logistic',
    nick: 'LOGISTIC_PARABOLA',
    biome: 'logisticDunes',
    x: -10,
    y: -10,
    requirements: ['LOGISTIC'],
    defaultExpression: '\\frac{1}{1+x^2}+\\left(\\frac{x}{2}\\right)^2',
    goals: [
      {
        order: 'C',
        x: -8,
        y: 6,
      },
      {
        order: 'B',
        x: -6,
        y: 4,
      },
      {
        order: 'A',
        x: -4,
        y: 2,
      },
      {
        order: 'A',
        x: 4,
        y: 2,
      },
      {
        order: 'B',
        x: 6,
        y: 4,
      },
      {
        order: 'C',
        x: 8,
        y: 6,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -1,
        y: 0,
      },
      {
        asset: 'images.lunchbox_sled',
        x: 1,
        y: 0,
        speech: [
          {
            x: 0.3,
            y: 0.65,
            content: 'The sky looks tasty.',
            direction: 'up-up-right',
            distance: 1,
          },
        ],
      },
    ],
  },
  {
    name: 'logistic',
    nick: 'LOGISTIC_TRAJECTORY',
    biome: 'logisticDunes',
    x: -20,
    y: 0,
    requirements: [null],
    defaultExpression: '\\left(\\frac{x}{4}\\right)^2+\\frac{1}{(1+x^2)}',
    goals: [
      {
        type: 'path',
        expression: '-((x-4)/2)^2+8',
        x: 1,
        y: 0,
        pathX: 5,
      },
    ],
    sledders: [
      {
        asset: 'images.sam_sled',
        x: -12,
        y: 0,
      },
    ],
  },
  {
    name: 'logistic reorder',
    nick: 'LOGISTIC_REORDER',
    biome: 'logisticDunes',
    x: -10,
    y: 0,
    requirements: ['LOGISTIC'],
    defaultExpression:
      '\\frac{1}{1+\\left(x+8\\right)^2}+\\frac{1}{1+\\left(x+1\\right)^2}',
    goals: [
      {
        order: 'B',
        x: -2,
        y: 0.5,
      },
      {
        type: 'dynamic',
        order: 'A',
        x: 0,
        y: 0.5,
      },
      {
        order: 'C',
        x: 2,
        y: 0.5,
      },
    ],
    sledders: [
      {
        x: -8,
        y: 0,
        speech: [
          {
            speakerX: -0.4,
            speakerY: 0.7,
            content: 'Well I still want to finish the route!',
            direction: 'left-up-up',
            distance: 1.5,
          },
          {
            speakerX: 0.7,
            speakerY: 0.7,
            content: 'I thought you didn\'t want to race anymore.',
            direction: 'right-up-up',
            distance: 2.5,
          },
        ],
      },
    ],
  },
  {
    name: 'logistic jump',
    nick: 'LOGISTIC_JUMP',
    biome: 'logisticDunes',
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression:
      '\\frac{1}{1+\\left(x+8\\right)^2}-\\frac{1}{1+x^2}+\\frac{1}{1+\\left(x-8\\right)^2}',
    goals: [
      {
        order: 'A',
        x: -4,
        y: 0.5,
      },
      {
        order: 'C',
        x: 2,
        y: 0.5,
      },
      {
        order: 'B',
        x: 6,
        y: 0.5,
      },
    ],
    sledders: [
      {
        x: -8,
        y: 0,
        speech: [
          {
            speakerX: -0.4,
            speakerY: 0.7,
            content: 'Who even thinks of a logistic sledding race?',
            direction: 'up-up-left',
            distance: 2.6,
            speech: {
              content: 'This is such a weird slope.',
              direction: 'up',
              distance: 0.8,
            },
          },
          {
            speakerX: 0.7,
            speakerY: 0.7,
            content: 'You\'re thinking about it too much.',
            direction: 'right-up-up',
            distance: 1.5,
          },
        ],
      },
    ],
  },
]
