worldData = []

worldData.push({
  version: '0.0.0',
  name: 'Eden',
  assets: {
    images: {
      lunchbox_sam_sled: 'benny_sam_sled.svg',
      lunchbox_sled: 'benny_sled.svg',
      benny_sled: '.svg',
      benny_float: '.svg',
      benny_float_left: '.svg',
      sam_sled: '.svg',
      sam_float: '.svg',
      sam_float_left: '.svg',
      sam_stand_snowball: 'sam_float_left.svg',
      tree_1: '.png',
      cabin_1: '.png',
      cabin_1_front: '.png',
      world_map: '.svg',
    },
    sounds: {
      music: {
        intro: '.mp3',
      },
      map_button: '.mp3',
      next_button: '.mp3',
      enter_level: '.mp3',
      goal_fail: '.mp3',
      goal_success: '.mp3',
      level_success: '.mp3',
      restart_button: '.mp3',
      start_running: '.mp3',
      stop_running: '.mp3',
      path_goal_start: '.mp3',
      path_goal_continue: '.mp3',
    },
    shaders: {
      default: '.frag',
      neel: '.frag',
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
    flashRunButton: true,
    defaultExpression: '\\frac{-2}{1+e^{-x+5}}+\\frac{-2}{1+\\left(x-28\\right)^2}',
    hint: 'congratulations, you found the secret hint!',
    goals: [
      {
        type: 'dynamic',
        x: 6.7,
        y: 0
      },
    ],
    sledders: [{
      x: 0,
      asset: 'images.lunchbox_sled',
      drawOrder: -2,
      speech: {
        x: 0.3,
        content: 'snow!!',
        direction: Vector2(0.5, 1),
        distance: 1.2
      }
    }],
    sprites: [
    // {
    //   asset: 'images.cabin_1',
    //   size: 6,
    //   x: 1,
    //   y: -0.2,
    //   drawOrder: -3,
    // },
    // {
    //   asset: 'images.cabin_1_front',
    //   size: 6,
    //   x: 1,
    //   y: -0.2,
    //   drawOrder: -1,
    // },
    // {
    //   asset: 'images.tree_1',
    //   size: 8,
    //   x: 6,
    //   y: -0.05,
    //   drawOrder: -3,
    // },
    {
      asset: 'images.sam_stand_snowball',
      size: 2,
      x: 7.6,
      y: 0,
      drawOrder: 0,
      sloped: true,
      speech: {
        x: -0.3,
        y: 1,
        content: 'now hit the green button ⇲',
        direction: 'up-left',
        distance: 1.6,
        speech: {
          x: -1.5,
          content: 'yes, snow.',
          direction: 'up-up-left',
          distance: 0.8,
        }
      }
    }],
    texts: [{
      x: 20,
      y: 8,
      size: 3.5,
      content: 'SineRider'
    },{
      x: 14,
      y: -13,
      size: 1,
      content: 'WIP Pre-Alpha. Don’t distribute yet!'
    },{
      x: 14,
      y: -11,
      size: 1.5,
      content: 'A game about love and graphing.'
    }],
  },/*{
    name: 'Random',
    nick: 'RANDOM',
    colors: Colors.biomes.alps,
    x: 35,
    y: -25,
    requirements: [],
    defaultExpression: '0',
    hint: 'Soft eyes, grasshopper.',
    goals: [
      {
        type: 'dynamic',
        x: 6.7,
        y: 0
      },
    ],
    sledders: [{
      x: 0,
    }],
  },*/
  ...SLOPE,
  ...PARABOLA,
  ...WAVE,
  ...LOGISTIC,
  ...TIME,
]})

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