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
      y: 8,
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