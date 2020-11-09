worldData = []

worldData.push({
  name: 'Eden',
  levelData: [{
    name: 'Welcome',
    nick: 'HELLO_WORLD',
    x: 0,
    y: 0,
    requirements: [],
    defaultExpression: '-16/(1+((x-32)/4)^2)',
    goals: [
      {
        x: 4,
        y: 0.5
      }
    ],
    sledders: [{
      
    }],
    texts: [{
      x: 2,
      y: -2,
      size: 0.5,
      content: 'Click Go / Hit Enter'
    }],
  },
  {
    name: 'A Solid Slope',
    nick: 'SLOPE_POSITIVE',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: -2,
        y: -2
      },
      {
        x: -4,
        y: -4
      },
      {
        x: -6,
        y: -6
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'Try facing forwards?',
    nick: 'SLOPE_NEGATIVE',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '+x',
    goals: [
      {
        x: 2,
        y: -2
      },
      {
        x: 4,
        y: -4
      },
      {
        x: 6,
        y: -6
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'A real steep hill',
    nick: 'SLOPE_STEEPER',
    x: 10,
    y: -10,
    requirements: null,
    defaultExpression: '-x*1',
    goals: [
      {
        x: 2,
        y: -4
      },
      {
        x: 4,
        y: -8
      },
      {
        x: 6,
        y: -12
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'The bunny slope',
    nick: 'SLOPE_SHALLOWER',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '-x/1',
    goals: [
      {
        x: 2,
        y: -1
      },
      {
        x: 4,
        y: -2
      },
      {
        x: 6,
        y: -3
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'Let\'s go farther up!',
    nick: 'SLOPE_HIGHER',
    x: 10,
    y: 10,
    requirements: ['SLOPE_NEGATIVE'],
    defaultExpression: '-x+0',
    goals: [
      {
        x: 2,
        y: 4
      },
      {
        x: 6,
        y: 0
      },
      {
        x: 10,
        y: -4
      },
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'About halfway down',
    nick: 'SLOPE_LOWER',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '-x+2',
    goals: [
      {
        x: 3,
        y: -6
      },
      {
        x: 5,
        y: -8
      },
      {
        x: 7,
        y: -10
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'We\'re at the bottom',
    nick: 'SLOPE_SCALE_TRANSLATE',
    x: 10,
    y: -10,
    requirements: [
      'SLOPE_LOWER',
      'SLOPE_SHALLOWER',
    ],
    defaultExpression: '-x/2',
    goals: [
      {
        x: 3,
        y: -5
      },
      {
        x: 9,
        y: -7
      },
      {
        x: 15,
        y: -9
      },
      {
        x: 21,
        y: -11
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'Way too steep for us.',
    nick: 'PARABOLA_NEGATE',
    x: 10,
    y: 10,
    requirements: ['SLOPE_SCALE_TRANSLATE'],
    defaultExpression: '-x^2',
    goals: [
      {
        x: -1.5,
        y: 2.25
      },
      {
        x: -1,
        y: 1
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 1
      },
      {
        x: 1.5,
        y: 2.25
      },
    ],
    sledders: [{
      x: -2,
      y: 0
    }],
  },
  {
    name: 'Translate Y',
    nick: 'PARABOLA_TRANSLATE_Y',
    x: 10,
    y: -10,
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: 'x^2+1',
    goals: [
      {
        x: -1.5,
        y: -0.75
      },
      {
        x: -1,
        y: -2
      },
      {
        x: 0,
        y: -3
      },
      {
        x: 1,
        y: -2
      },
      {
        x: 1.5,
        y: -0.75
      },
    ],
    sledders: [{
      x: -2,
      y: 0
    }],
  },
  {
    name: 'Translate X',
    nick: 'PARABOLA_TRANSLATE_X',
    x: 10,
    y: 10,
    requirements: null,
    defaultExpression: '(x-4)^2',
    goals: [
      {
        x: -4.5,
        y: 2.25
      },
      {
        x: -4,
        y: 1
      },
      {
        x: -3,
        y: 0
      },
      {
        x: -2,
        y: 1
      },
      {
        x: -1.5,
        y: 2.25
      },
    ],
    sledders: [{
      x: -1,
      y: 0
    }],
  },
  {
    name: 'Translate XY',
    nick: 'PARABOLA_TRANSLATE_X_Y',
    x: 10,
    y: 10,
    requirements: null,
    defaultExpression: '(x-3)^2+2',
    goals: [
      {
        x: -4.5,
        y: -1.75
      },
      {
        x: -4,
        y: -3
      },
      {
        x: -3,
        y: -4
      },
      {
        x: -2,
        y: -3
      },
      {
        x: -1.5,
        y: -1.75
      },
    ],
    sledders: [{
      x: -1,
      y: 0
    }],
  },
  {
    name: 'Way too steep for us.',
    nick: 'PARABOLA_SCALE_Y',
    x: 10,
    y: 10,
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: 'x^2',
    goals: [
      {
        x: -4,
        y: 4
      },
      {
        x: -2,
        y: 1
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 2,
        y: 1
      },
      {
        x: 4,
        y: 4
      },
    ],
    sledders: [{
      x: -5,
      y: 0
    }],
  },
  {
    name: 'Scale X',
    nick: 'PARABOLA_SCALE_X',
    x: 10,
    y: 10,
    requirements: null,
    defaultExpression: '(x/4)^2',
    goals: [
      {
        x: -4,
        y: 4
      },
      {
        x: -2,
        y: 1
      },
      {
        x: -0,
        y: 0
      },
      {
        x: 2,
        y: 1
      },
      {
        x: 4,
        y: 4
      },
    ],
    sledders: [{
      x: -5,
      y: 0
    }],
  },
  {
    name: 'Translate Scale XY',
    nick: 'PARABOLA_TRANSLATE_SCALE_X',
    x: 0,
    y: 10,
    requirements: ['PARABOLA_TRANSLATE_X_Y', 'PARABOLA_SCALE_X'],
    defaultExpression: '((x+5)/4)^2',
    goals: [
      {
        x: -7,
        y: 4
      },
      {
        x: -5,
        y: 1
      },
      {
        x: -3,
        y: 0
      },
      {
        x: -1,
        y: 1
      },
      {
        x: 1,
        y: 4
      },
    ],
    sledders: [{
      x: 3,
      y: 0
    }],
  },
  {
    name: 'Translate Scale X',
    nick: 'PARABOLA_TRANSLATE_SCALE_X_Y',
    x: 10,
    y: 0,
    requirements: null,
    defaultExpression: '((x+5)/4)^2+1',
    goals: [
      {
        x: 4,
        y: -0
      },
      {
        x: 6,
        y: -3
      },
      {
        x: 8,
        y: -4
      },
      {
        x: 10,
        y: -3
      },
      {
        x: 12,
        y: -0
      },
    ],
    sledders: [{
      x: 2,
      y: 0
    }],
  },
  {
    name: 'Time',
    nick: 'TIME_CONSTANT',
    x: 20,
    y: -20,
    requirements: ['SLOPE_SCALE_TRANSLATE'],
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
      
    }],
  },
  {
    name: 'Time Translate',
    nick: 'TIME_COOL',
    x: -20,
    y: 0,
    requirements: null,
    defaultExpression: '(x-t)^2',
    goals: [
      {
        x: -2,
        y: 0
      },
      {
        x: -1,
        y: 0
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0
      }
    ],
    sledders: [{
      x: -4,
      y: 0
    }],
  },
  {
    name: 'Time Translate',
    nick: 'TIME_PARABOLA_TRANSLATE_X',
    x: 10,
    y: 10,
    requirements: ['TIME_CONSTANT', 'PARABOLA_TRANSLATE_X'],
    defaultExpression: '(x-t)^2',
    goals: [
      {
        x: -2,
        y: 0
      },
      {
        x: -1,
        y: 0
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0
      }
    ],
    sledders: [{
      x: -4,
      y: 0
    }],
  },
  {
    name: 'Time Translate',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y',
    x: 10,
    y: 10,
    requirements: ['TIME_PARABOLA_TRANSLATE_X', 'PARABOLA_TRANSLATE_X_Y'],
    defaultExpression: '(x-t)^2',
    goals: [
      {
        x: -2,
        y: 0
      },
      {
        x: -1,
        y: 0
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0
      }
    ],
    sledders: [{
      x: -4,
      y: 0
    }],
  }],
})

// Allows you to leave requirements as null to signify dependence on the previous level
for (world of worldData) {
  const levelData = world.levelData
  
  for (let i = 1; i < levelData.length; i++) {
    const d = levelData[i]
    if (d.requirements == null) {
      d.requirements = [levelData[i-1].nick]
    }
  }
}