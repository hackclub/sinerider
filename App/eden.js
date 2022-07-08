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
      cabin_1: '.png',
      cabin_1_front: '.png',
      world_map: '.svg',
      cloud1: '.png',
      cloud2: '.png',
      cloud3: '.png',
      cloud3: '.png',
      tree1: '.png',
      tree2: '.png',
      tree3: '.png',
      tree4: '.png',
      initial_bg:'initial-bg.jpeg'
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
      map_zoom_in: {
        src: 'woosh_out.wav',
        rate: 1.2,
      },
      map_zoom_out: {
        src: 'woosh_out.wav',
        rate: 0.8,
      },
      map_zoom_highlighted: {
        src: 'woosh_out.wav',
        rate: 0.6,
      },
      map_zoom_show_all: {
        src: 'woosh_out.wav',
        rate: 0.4,
      },
      path_goal_start: '.mp3',
      path_goal_continue: '.mp3',
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
    camera: {
      offset: {
        x: 0,
        y: 0.3,
      }
    },
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
    //   asset: 'images.tree*',
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
      },
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 1.8,
      x: -5.1,
      y: 0,
      drawOrder: 0,
      anchored:true
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 2.2,
      x: -8.8,
      y: 0,
      drawOrder: 0,
      anchored:true
    },{
      asset: 'images.tree*',
      flipX: "*",
      size: 2.1,
      x: -3.2,
      y: 0,
      drawOrder: 0,
      anchored:true
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 2.4,
      x: 13,
      y: 0,
      drawOrder: 0,
      anchored:true
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 2.3,
      x: 21,
      y: 0,
      drawOrder: 0,
      anchored:true
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 2.9,
      x: 10,
      y: 0,
      drawOrder: 0,
      anchored:true
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 2.1,
      x: 34.2,
      y: 0,
      drawOrder: 0,
      anchored:true
    },
    {
      asset: 'images.tree*',
      flipX: "*",
      size: 2.4,
      x: 36.3,
      y: 0,
      drawOrder: 0,
      anchored:true
    }
  ],
    texts: [{
      x: 20,
      y: 11,
      size: 3.5,
      content: 'SineRider'
    },{
      x: 14,
      y: -8.5,
      size: 1,
      content: 'WIP Pre-Alpha. Don’t distribute yet!'
    },{
      x: 14,
      y: -6.5,
      size: 1.5,
      content: 'A game about love and graphing.'
    }],
    sky: {
      asset:"images.initial_bg",
      margin:3
    },
    clouds: {
      velocity: 0.4,
      heights:[4,4.8]
    },
    snow: {
      density:0.4,
      velocity: {
        x:0.2,
        y:0.4
      }
    },
    textBubbles: [{content:"this one!", domSelector:"#run-button", place:"top-left", destroyOnClick:true, style: {fontSize:"1.1rem"}}]
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