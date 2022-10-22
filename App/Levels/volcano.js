const VOLCANO = {
  name: 'Volcano',
  nick: 'VOLCANO',
  colors: Colors.biomes.volcano,
  axesEnabled: false,
  // radius: 2,
  x: -20,
  y: 0,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: ['TIME_COOL'],
  defaultExpression: '\\frac{20}{1+\\left(\\frac{x}{20}\\right)^{4}}-\\frac{20}{1+\\left(\\frac{x}{7}\\right)^{4}}+\\frac{40}{1+e^{-\\frac{\\left(x-60\\right)}{10}}}',
  directors: [
    {
      type: 'tracking',
      smoothing: 0.30,
    }
    // {
    //   type: 'lerp',
    //   point0: [-40, 0],
    //   point1: [130, 40],
    //   state0: {
    //     position: [-40, -2],
    //     fov: 40,
    //   },
    //   state1: {
    //     position: [120, 41],
    //     fov: 20,
    //   },
    // }
  ],
  goals: [],
  sky: {
    asset: 'images.volcano_background',
    margin: 1
  },
  bubble: {
    sky: {
      asset: 'images.volcano_background',
      margin: 1
    }
  },
  walkers: [
    {
      x: 100,
      asset: 'images.benny_float',
      transition: {
        name: 'SLEDDER_1',
        startWhenTransitioned: true,
        // xRequirements: [102, 99]
        xRequirements: []
      },
      range: [99, 105],
      transitionX: 95.5,
      speech: [{
        speakerX: 100,
        content: 'Woah woah woah let\'s go to the right of this really cool sigmoid curve',
        direction: 'up-up-left',
        deactivationThreshold: 105,
        domain: [99.5, 102],
        distance: 1.5,
        repeatable: false,
      },{
        speakerX: 103,
        content: 'UH OH! WE\'re going to have to turn back to the left--but what!1!! There\'s a VOLCANO?!?!?!',
        direction: 'up-up-left',
        domain: [104, 105],
        distance: 1.5,
      },{
        speakerX: 100,
        content: 'Woah woah owah we need to turn into -- WHAT!11!! SLEDS?!/1/!',
        direction: 'up-up-left',
        activationThreshold: 105,
        domain: [100, 101],
        distance: 1.5,
      }],
      walkers: {
        x: -6,
        asset: 'images.sam_float',
        bobSpeed: 0.918218,
      },
    }
  ],
  sprites: [
    {
      asset: 'images.rock_1',
      flipX: true,
      drawOrder: LAYERS.foreSprites,
      size: 3,
      x: 99,
      offset: [0, 0.6],
      anchored: true
    },
  ],
  sledders: [
    {
      name: 'SLEDDER_1',
      transitionX: 95,
      x: 99,
      y: 50,
      flipX: true,
      // speech: [{
      //   speakerX: 95,
      //   content: 'Yaow!!!! We just turned into some SLEDS!',
      //   direction: 'up-up-right',
      //   domain: [NINF, 95],
      //   distance: 1.8,
      // }]
    }
  ],
}