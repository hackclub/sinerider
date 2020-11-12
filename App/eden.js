worldData = []

worldData.push({
  name: 'Eden',
  levelData: [{
    name: 'Welcome',
    nick: 'HELLO_WORLD',
    colors: Colors.biomes.alps,
    x: 0,
    y: 0,
    requirements: [],
    defaultExpression: '-16/(1+((x-32)/4)^2)',
    goals: [
      {
        x: 4,
        y: 0.5
      },
      {
        type: 'dynamic',
        x: 2,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.alps,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    colors: Colors.biomes.champlain,
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
    name: 'Sin',
    nick: 'SIN',
    colors: Colors.biomes.arches,
    x: 20,
    y: -20,
    requirements: ['PARABOLA_TRANSLATE_SCALE_X_Y'],
    defaultExpression: 'sin(x)',
    goals: [
      {
        x: PI/2-0.5,
        y: -Math.sin(PI/2-0.5)
      },
      {
        x: PI/2+0.5,
        y: -Math.sin(PI/2+0.5)
      },
      {
        x: PI/2+1.5,
        y: -Math.sin(PI/2+1.5)
      },
      {
        x: TAU+PI/2-0.5,
        y: -Math.sin(PI/2-0.5)
      },
      {
        x: TAU+PI/2+0.5,
        y: -Math.sin(PI/2+0.5)
      },
      {
        x: TAU+PI/2+1.5,
        y: -Math.sin(PI/2+1.5)
      },
    ],
    sledders: [{
      x: 0,
      y: 0
    },{
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
        x: 1,
        y: Math.cos(1)
      },
      {
        x: 2,
        y: Math.cos(2)
      },
      {
        x: 3,
        y: Math.cos(3)
      },
      {
        x: 4,
        y: Math.cos(4)
      },
      {
        x: 5,
        y: Math.cos(5)
      },
      {
        x: TAU+1,
        y: Math.cos(TAU+1)
      },
      {
        x: TAU+2,
        y: Math.cos(TAU+2)
      },
      {
        x: TAU+3,
        y: Math.cos(TAU+3)
      },
      {
        x: TAU+4,
        y: Math.cos(TAU+4)
      },
      {
        x: TAU+5,
        y: Math.cos(TAU+5)
      },
    ],
    sledders: [{
      x: 0,
      y: 0
    },{
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
        x: 4,
        y: 0
      },
    ],
    sledders: [{
      x: 0,
      y: 0
    },{
      x: TAU,
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
        x: 1,
        y: Math.cos(1)
      },
      {
        x: 2,
        y: Math.cos(2)
      },
      {
        x: 3,
        y: Math.cos(3)
      },
      {
        x: 4,
        y: Math.cos(4)
      },
      {
        x: 5,
        y: Math.cos(5)
      },
      {
        x: TAU+1,
        y: Math.cos(TAU+1)
      },
      {
        x: TAU+2,
        y: Math.cos(TAU+2)
      },
      {
        x: TAU+3,
        y: Math.cos(TAU+3)
      },
      {
        x: TAU+4,
        y: Math.cos(TAU+4)
      },
      {
        x: TAU+5,
        y: Math.cos(TAU+5)
      },
    ],
    sledders: [{
      x: 0,
      y: 0
    },{
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
    defaultExpression: 'sin(x)',
    goals: [
      {
        x: 1,
        y: Math.cos(1)+4
      },
      {
        x: 2,
        y: Math.cos(2)+4
      },
      {
        x: 3,
        y: Math.cos(3)+4
      },
      {
        x: 4,
        y: Math.cos(4)+4
      },
      {
        x: 5,
        y: Math.cos(5)+4
      },
      {
        x: TAU+1,
        y: Math.cos(TAU+1)+4
      },
      {
        x: TAU+2,
        y: Math.cos(TAU+2)+4
      },
      {
        x: TAU+3,
        y: Math.cos(TAU+3)+4
      },
      {
        x: TAU+4,
        y: Math.cos(TAU+4)+4
      },
      {
        x: TAU+5,
        y: Math.cos(TAU+5)+4
      },
    ],
    sledders: [{
      x: 0,
      y: 0
    },{
      x: TAU,
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
      ..._.map(new Array(6), (v, i) => {
        let x = -i-1
        let y = Math.sin(x/2)
        return {x, y}
      }),
      ..._.map(new Array(6), (v, i) => {
        let x = TAU+i+1
        let y = Math.sin(x/2)
        return {x, y}
      }),
    ],
    sledders: [{
      x: 0,
      y: 0
    },{
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
    defaultExpression: 'sin(x/3)*2',
    goals: [
      {
        x: 4,
        y: 0
      },
    ],
    sledders: [{
      x: 0,
      y: 0
    }],
  },
  {
    name: 'logistic',
    nick: 'LOGISTIC',
    colors: Colors.biomes.mojave,
    x: -10,
    y: -10,
    requirements: ['SIN_TRANSLATE_X_Y'],
    defaultExpression: '1/(1+x^2)',
    goals: [
      {
        order: 'C',
        x: -5,
        y: 0
      },
      {
        order: 'B',
        x: -3,
        y: 0
      },
      {
        order: 'A',
        x: -1,
        y: 0
      },
      {
        order: 'A',
        x: 6,
        y: 0
      },
      {
        order: 'B',
        x: 8,
        y: 0
      },
      {
        order: 'C',
        x: 10,
        y: 0
      },
    ],
    sledders: [{
      x: 1,
      y: 0
    },{
      x: 3,
      y: 0
    }],
  },
  {
    name: 'logistic reorder',
    nick: 'LOGISTIC_REORDER',
    colors: Colors.biomes.mojave,
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression: '1/(1+(x+8)^2) + 1/(1+(x+1)^2)',
    goals: [
      {
        order: 'B',
        x: -2,
        y: 0.5
      },
      {
        type: 'dynamic',
        order: 'A',
        x: 0,
        y: 0.5
      },
      {
        order: 'C',
        x: 2,
        y: 0.5
      },
    ],
    sledders: [{
      x: -8,
      y: 0
    }],
  },
  {
    name: 'logistic jump',
    nick: 'LOGISTIC_JUMP',
    colors: Colors.biomes.mojave,
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression: '1/(1+(x+8)^2) - 1/(1+x^2) + 1/(1+(x-8)^2)',
    goals: [
      {
        order: 'A',
        x: -4,
        y: 0.5
      },
      {
        order: 'C',
        x: 2,
        y: 0.5
      },
      {
        order: 'B',
        x: 6,
        y: 0.5
      },
    ],
    sledders: [{
      x: -8,
      y: 0
    }],
  },
  {
    name: 'Time',
    nick: 'TIME_CONSTANT',
    colors: Colors.biomes.yosemite,
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
    colors: Colors.biomes.yosemite,
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
    name: 'Time Translate X',
    nick: 'TIME_PARABOLA_TRANSLATE_X',
    colors: Colors.biomes.yosemite,
    x: 10,
    y: 10,
    requirements: ['TIME_CONSTANT', 'PARABOLA_TRANSLATE_X'],
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
      y: 0
    }],
  },
  {
    name: 'Time Translate XY',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y',
    colors: Colors.biomes.yosemite,
    x: 10,
    y: 10,
    requirements: [null, 'PARABOLA_TRANSLATE_X_Y'],
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
      y: 0
    }],
  },
  {
    name: 'Time Translate',
    nick: 'TIME_PARABOLA_TRANSLATE_X_Y_SCALE_Y',
    colors: Colors.biomes.yosemite,
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
      y: 0
    }],
  },
  {
    name: 'sin time translate',
    nick: 'TIME_SIN_TRANSLATE_X',
    colors: Colors.biomes.yosemite,
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
      y: 0
    }],
  },
  {
    name: 'sin time escalate',
    nick: 'TIME_SIN_ESCALATOR',
    colors: Colors.biomes.yosemite,
    x: -10,
    y: -10,
    requirements: [null, 'TIME_PARABOLA_TRANSLATE_X_Y'],
    defaultExpression: 'sin(x-t)+x/5',
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
      y: 0
    }],
  },
  {
    name: 'sin time oscillate',
    nick: 'TIME_SIN_OSCILLATOR',
    colors: Colors.biomes.yosemite,
    x: -10,
    y: -10,
    requirements: [null],
    defaultExpression: 'sin(x-t)+x/5',
    goals: [
      {
        x: -2,
        y: 0
      },
      {
        x: -3,
        y: 0
      },
      {
        x: -4,
        y: 0
      },
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
    ],
    sledders: [{
      x: 0,
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
      continue
    }
    
    for (let j = 0; j < d.requirements.length; j++) {
      if (d.requirements[j] == null) {
        d.requirements[j] = [levelData[i-1].nick]
      }
    }
  }
}