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
    offset: [0, 0.4],
    fov: 30,
  },
  requirements: ['TIME_COOL'],
  defaultExpression: '\\frac{40}{1+\\left(\\frac{x-200}{80}\\right)^6}-\\frac{60}{1+\\left(\\frac{x-200}{30}\\right)^6}+\\frac{90}{1+e^{-\\frac{\\left(-x+60\\right)}{10}}}+\\left(\\frac{x-200}{60}\\right)^2',
  directors: [
    {
      type: 'tracking',
      smoothing: 0.08,
      minFov: 8,
      minFovMargin: 7,
      transitions: [{
        domain: [135, 250],
        properties: {
          minFov: 40,
        }
      }]
    }
  ],
  goals: [],
  sky: {
    asset: 'images.western_slopes_background_no_sky',
    margin: 1
  },
  bubble: {
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1
    }
  },
  walkers: [
    // {
    //   x: 100,
    //   asset: 'images.benny_float',
    //   transition: {
    //     name: 'SLEDDER_1',
    //     startWhenTransitioned: true,
    //     xRequirements: [102, 99]
    //   },
    //   range: [99, 105],
    //   transitionX: 95.5,
    //   speech: [{
    //     speakerX: 100,
    //     content: 'Woah woah woah let\'s go to the right of this really cool sigmoid curve',
    //     direction: 'up-up-left',
    //     deactivationThreshold: 105,
    //     domain: [99.5, 102],
    //     distance: 1.5,
    //     repeatable: false,
    //   },{
    //     speakerX: 103,
    //     content: 'UH OH! WE\'re going to have to turn back to the left--but what!1!! There\'s a VOLCANO?!?!?!',
    //     direction: 'up-up-left',
    //     domain: [104, 105],
    //     distance: 1.5,
    //   },{
    //     speakerX: 100,
    //     content: 'Woah woah owah we need to turn into -- WHAT!11!! SLEDS?!/1/!',
    //     direction: 'up-up-left',
    //     activationThreshold: 105,
    //     domain: [100, 101],
    //     distance: 1.5,
    //   }],
    //   walkers: {
    //     x: -6,
    //     asset: 'images.sam_float',
    //     bobSpeed: 0.918218,
    //   },
    // }
  ],
  lava: {
    x: 155,
    y: 60,
    size: 90,
  },
  sprites: [
    {
      asset: 'images.rock_1',
      flipX: true,
      drawOrder: LAYERS.foreSprites,
      size: 3,
      x: 0,
      offset: [0, 0.6],
      anchored: true
    },
  ],
  sledders: [
    {
      name: 'SLEDDER_1',
      transitionX: 0,
      // x: 99,
      x: 0,
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