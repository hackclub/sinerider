worldData = []

worldData.push({
  version: '0.0.0',
  name: 'Eden',
  assets: {
    images: {
      lunchbox_sam_sled: '.svg',
      lunchbox_sled: '.svg',
      sam_sled: '.svg',
      sam_stand_snowball: '.svg',
      tree_1: '.png',
      cabin_1: '.png',
      cabin_1_front: '.png',
      world_map: '.svg',
    },
    sounds: {
      music: {
        intro: 'intro.m4a',
      }
    }
  },
  levelData: [{
    name: 'Welcome',
    nick: 'HELLO_WORLD',
    colors: Colors.biomes.alps,
    x: 0,
    y: 0,
    requirements: [],
    runMusic: 'sounds.music.intro',
    defaultExpression: '-16/(1+((x-36)/4)^2)',
    hint: 'congratulations, you found the secret hint!',
    goals: [
      {
        type: 'dynamic',
        x: 8,
        y: 0
      },
    ],
    sledders: [{
      x: 0.35,
      asset: 'images.lunchbox_sled',
      drawOrder: -2,
    }],
    sprites: [{
      asset: 'images.cabin_1',
      size: 6,
      x: 1,
      y: -0.2,
      drawOrder: -3,
    },{
      asset: 'images.cabin_1_front',
      size: 6,
      x: 1,
      y: -0.2,
      drawOrder: -1,
    },{
      asset: 'images.tree_1',
      size: 8,
      x: 6,
      y: -0.05,
      drawOrder: -3,
    },{
      asset: 'images.sam_stand_snowball',
      size: 2,
      x: 8.8,
      y: 0,
      drawOrder: 0,
      sloped: true,
      speech: {
        x: -0.1,
        y: 1.5,
        content: 'Get the sled!!',
        direction: 'up-up-right',
        speech: {
          content: 'It snowed!',
          x: 0.8,
        }
      }
    }],
    texts: [{
      x: 4,
      y: -2,
      size: 0.7,
      content: 'hit the green button ⇲'
    },{
      x: 24,
      y: 5,
      size: 4,
      content: 'SineRider'
    },{
      x: 18,
      y: -21,
      size: 1,
      content: 'WIP Pre-Alpha. Don’t distribute yet!'
    },{
      x: 18,
      y: -19,
      size: 2,
      content: 'A game about love and graphing.'
    }],
  },
  {
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
    defaultExpression: '',
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
    // texts: [{
    //   x: 0,
    //   y: -4.5,
    //   size: 1,
    //   content: 'Y=0: Flat',
    // },{
    //   x: 0,
    //   y: -6.5,
    //   size: 1,
    //   content: 'Y=x: Slope',
    // }],
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
    // texts: [{
    //   x: 1,
    //   y: -6.5,
    //   size: 0.8,
    //   content: 'Go negative'
    // }],
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
    requirements: null,
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
    // texts: [{
    //   x: -4,
    //   y: -8,
    //   size: 1,
    //   content: 'Try multiplying',
    // }],
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
    // texts: [{
    //   x: 0,
    //   y: -4,
    //   size: 0.8,
    //   content: 'Now try dividing'
    // }],
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
    defaultExpression: '-x',
    hint: 'hint: add a constant',
    goals: [
      {
        type: 'path',
        expression: '-x+6',
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
    // texts: [{
    //   x: -1,
    //   y: -4,
    //   size: 1,
    //   content: 'Add a constant',
    // }],
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
    // texts: [{
    //   x: 0,
    //   y: -8,
    //   size: 1,
    //   content: 'Now subtract',
    // }],
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
    defaultExpression: '-x/2',
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
    sledders: [{
      asset: 'images.lunchbox_sled',
    }],
    // texts: [{
    //   x: 10.5,
    //   y: -14,
    //   size: 2,
    //   content: 'Put it all together',
    // }],
  },
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
    defaultExpression: '-(x^2)',
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
    sledders: [{
      asset: 'images.sam_sled',
      x: -2,
      y: 0,
      speech: [{
        speakerX: 0.3,
        content: 'Be positive.',
        direction: 'up',
        distance: 1,
      }],
    }],
  },
  {
    name: 'Translate Y',
    nick: 'PARABOLA_TRANSLATE_Y',
    colors: Colors.biomes.champlain,
    x: 10,
    y: -10,
    camera: {
      x: 0,
      y: 0,
      fov: 8,
    },
    requirements: ['PARABOLA_NEGATE'],
    defaultExpression: '(x^2)-1',
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
    sledders: [{
      asset: 'images.sam_sled',
      x: -2,
      y: 0
    }],
    // texts: [{
    //   x: 0,
    //   y: -4.25,
    //   size: 0.5,
    //   content: 'Subtract from (everything)',
    // }],
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
    sledders: [{
      asset: 'images.sam_sled',
      x: -1,
      y: 0
    }],
    // texts: [{
    //   x: -6,
    //   y: 4,
    //   size: 0.8,
    //   content: 'Add to (x)',
    // }],
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
    sledders: [{
      asset: 'images.sam_sled',
      x: -1,
      y: 0
    }],
    // texts: [{
    //   x: 0,
    //   y: -2,
    //   size: 1,
    //   content: 'Now try both',
    // }],
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
        type: 'path',
        expression: 'x^2/4',
        x: -4,
        y: 0,
        pathX: 8,
      },
    ],
    sledders: [{
      asset: 'images.sam_sled',
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
    sledders: [{
      asset: 'images.sam_sled',
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
    hint: '(x/4)^2 = x^2/4^2 = x^2/16',
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
      asset: 'images.sam_sled',
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
      asset: 'images.sam_sled',
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
        x: 4,
        y: 0
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
    defaultExpression: 'sin(x/3)*2',
    goals: [
      {
        x: 4,
        y: 0
      },
    ],
    sledders: [{
      asset: 'images.sam_sled',
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
      asset: 'images.sam_sled',
      x: 1,
      y: 0
    },{
      asset: 'images.lunchbox_sled',
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
    name: 'logistic reorder 2',
    nick: 'LOGISTIC_REORDER_2',
    colors: Colors.biomes.mojave,
    x: -10,
    y: 0,
    requirements: [null],
    defaultExpression: '1/(1+(x+8)^2) + 1/(1+(x+1-t)^2)',
    goals: [
      {
        order: 'B',
        x: -2,
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
      y:0.5
    },{
      x: 0,
      y:0.5
    },{
      x: 2,
      y: 0.5
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
      asset: 'images.lunchbox_sled',
      speech: [{
        speakerX: 0.3,
        content: 'Where did she get the other sled?',
        direction: 'right-right-up',
        distance: 1,
      }],
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
      y: 0,
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
      y: 0,
      speech: [{
        speakerX: 0.3,
        content: 'It’s perfect.',
        direction: 'right-right-up',
        distance: 1,
        speech: [{
          content: 'This place gives me the creeps.'
        }]
      }],
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