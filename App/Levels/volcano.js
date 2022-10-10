const VOLCANO = {
  name: 'Volcano',
  nick: 'VOLCANO',
  colors: Colors.biomes.volcano,
  axesEnabled: false,
  // radius: 2,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: ['SLOPE_SHALLOWER', 'SLOPE_LOWER'],
  defaultExpression: '\\frac{20}{1+\\left(\\frac{x}{20}\\right)^{4}}-\\frac{20}{1+\\left(\\frac{x}{7}\\right)^{4}}+\\frac{40}{1+e^{-\\frac{\\left(x-60\\right)}{10}}}',
  directors: [{
    type: 'lerp',
    // Are these in world space?
    point0: [-40, 0],
    point1: [130, 40],
    state0: {
      position: [-40, -2],
      fov: 40,
    },
    state1: {
      position: [120, 41],
      fov: 20,
    },
  }],
  goals: [],
  sky: {
    asset: 'images.western_slopes_background',
    margin: 1
  },
  bubble: {
    sky: {
      asset: 'images.volcano_background',
      margin: 1
    }
  },
  // sledders: [{
  //   x: 90,
  //   asset: 'images.benny_float',
  //   speech: [],
  //   walkers: [],
  // }],
  walkers: [{
    x: 100,
    asset: 'images.benny_float',
    transition: {
      name: 'SLEDDER_1',
      xTargets: [115, 95],
    },
    range: [95, 115],
    transitionX: 95.5,
    speech: [{
      speakerX: 100,
      content: 'Woah woah woah let\'s go to the right of this really cool sigmoid curve',
      direction: 'up-up-left',
      domain: [99.5, 103],
      distance: 1.5,
    },{
      speakerX: 110,
      content: 'UH OH! WE\'re going to have to turn back to the left--but what!1!! There\'s a VOLCANO?!?!?!',
      direction: 'up-up-left',
      domain: [105, 108],
      distance: 1.5,
    }],
    walkers: {
      x: -6,
      asset: 'images.sam_float',
      bobSpeed: 0.918218,
    },
  }],
  sledders: [
    {
      name: 'SLEDDER_1',
      transitionX: 95,
      x: 95,
      y: 50,
      speech: [{
        speakerX: 95,
        content: 'Yaow!!!! We just turned into some SLEDS!',
        direction: 'up-up-right',
        domain: [NINF, 95],
        distance: 1.8,
      }]
    }
  ],
  sprites: [],
}