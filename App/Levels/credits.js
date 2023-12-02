const CREDITS = {
  name: 'Credits',
  nick: 'CREDITS',
  biome: 'home',
  axesEnabled: false,
  runAsCutscene: true,
  x: -10,
  y: 10,
  requirements: ['VOLCANO'],
  defaultExpression:
    '\\frac{-2}{1+e^{-x+5}}+\\frac{-2}{1+\\left(x-30\\right)^2}',
  clouds: {},
  assets: {
    sounds: {
      music: {
        credits: '.mp3',
      },
    },
  },
  directors: [
    {
      type: 'lerp',
      point0: [-76, 0],
      point1: [-30, 0],
      state0: {
        position: [-73, 6],
        fov: 9,
      },
      state1: {
        position: [-34, 4],
        fov: 8,
      },
    },
    {
      type: 'lerp',
      point0: [-30, 0],
      point1: [-14, 0],
      state0: {
        position: [-34, 4],
        fov: 8,
      },
      state1: {
        position: [-10, 4],
        fov: 8,
      },
    },
    {
      type: 'lerp',
      point0: [-14, 0],
      point1: [-6, 0],
      state0: {
        position: [-10, 4],
        fov: 8,
      },
      state1: {
        position: [10, 12],
        fov: 18,
      },
    },
    {
      type: 'lerp',
      point0: [-4, 0],
      point1: [0, 0],
      state0: {
        position: [10, 12],
        fov: 18,
      },
      state1: {
        position: [10, -10],
        fov: 18,
      },
    },
  ],
  dialogue: [
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: 'Well I have to admit, that was fun.',
        br: 'Eu tenho que admitir, isso foi divertido.',
      }),
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      direction: 'up-up-left',
      content: tn({
        en: 'I found it vaguely traumatizing…',
        pt: 'Eu achei isso vagamente traumatizante...',
      }),
      speech: {
        speaker: 'Jack',
        color: '#FFF',
        direction: 'up',
        content: tn({
          en: 'Really?',
          br: 'Sério?',
        }),
      },
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: "Aren't you supposed to be the adventurer?",
        br: 'Você não era para ser o aventureiro?',
      }),
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      direction: 'up-up-left',
      content: tn({
        en: 'A lava monster almost ate us whole.',
        br: 'Um monstro de lava quase nos comeu.',
      }),
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-left',
      content: tn({
        en: "Sounds like you're just being negative.",
        br: 'Parece que você só está sendo negativo.',
      }),
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      direction: 'up',
      content: tn({
        en: 'I deserved that.',
        br: 'Eu mereci isso.',
      }),
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: "I'm sorry if I was a little… intense today.",
        br: 'Desculpa se eu fui um pouco... intensa hoje.',
      }),
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      direction: 'up-up-left',
      content: tn({
        en: "I'm sorry I made you wait",
        br: 'Desculpa eu fiz você esperar',
      }),
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: 'And almost lose.',
        br: 'E quase perdeu.',
      }),
      gap: 0.5,
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: 'And we won!',
        br: 'E nós ganhamos!',
      }),
      speech: {
        content: tn({
          en: 'But you redeemed yourself.',
          br: 'Mas você se redimiu.',
        }),
        direction: 'up',
        color: '#FFF',
      },
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      direction: 'up-up-left',
      content: tn({
        en: 'We did win.',
        br: 'Nós fizemos a vitória.',
      }),
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: "I'm glad you're here <3",
        br: 'Estou feliz que você está aqui <3',
      }),
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      direction: 'up-up-left',
      content: tn({
        en: "I'm glad you're here too, Ada.",
        br: 'Estou feliz que você está aqui também, Ada.',
      }),
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      direction: 'up-up-right',
      content: tn({
        en: 'Later we can go hit that canyon!',
        br: 'Mais tarde podemos alcançar o cânion!',
      }),
      speech: {
        content: tn({
          en: "Now let's take a nap.",
          br: 'Agora vamos tirar um cochilo.',
        }),
        direction: 'up',
        color: '#FFF',
      },
      length: 4,
    },
  ],
  texts: [
    {
      x: 6,
      y: 26,
      size: 1.5,
      align: 'right',
      fill: '#222',
      content: 'Thank you for playing',
    },
    {
      x: 16.5,
      y: 20,
      size: 1,
      fill: '#222',
      content: 'A game built with love by teenagers at Hack Club.',
    },
  ],
  goals: [],
  sledders: [],
  sounds: [
    {
      asset: 'sounds.music.credits',
      domain: [-12, -0],
      // fadeOut: 800,
      // duration: 20000,
    },
  ],
  walkers: [
    {
      name: 'Ada',
      // x: -10,
      x: -80,
      victoryX: 26,
      asset: 'images.sam_float',
      bobSpeed: 0.918218,
      range: [NINF, 0],
      walkers: {
        name: 'Jack',
        x: -6,
        asset: 'images.jack_float',
      },
    },
  ],
  sprites: [
    {
      asset: 'images.tree_home_2',
      //flipX: '*',
      size: 6.7,
      x: -25,
      y: 0,
      offset: Vector2(0, 0.4),
      anchored: true,
    },
    {
      asset: 'images.tree_home_1',
      //flipX: '*',
      size: 6.7,
      x: -17,
      y: 0,
      offset: Vector2(0, 0.4),
      anchored: true,
    },
    {
      asset: 'images.tree_home_3',
      //flipX: '*',
      size: 6.7,
      x: -15,
      y: 0,
      offset: Vector2(0, 0.4),
      anchored: true,
    },
    {
      asset: 'images.crow',
      flipX: '*',
      size: 1,
      x: -15,
      y: 0,
      anchored: true,
    },
    {
      asset: 'images.credits',
      drawOrder: LAYERS.text,
      size: 35,
      x: 10,
      y: 0,
      offset: Vector2(0, -0.8),
    },
    {
      asset: 'images.tree_home_1',
      drawOrder: LAYERS.backSprites,
      // flipX: '*',
      size: 6.7,
      x: -4,
      y: 0,
      offset: Vector2(0, 0.4),
      anchored: true,
    },
    {
      asset: 'images.cabin_1',
      drawOrder: LAYERS.foreSprites,
      flipX: '*',
      size: 6.1,
      x: -1,
      y: -1,
      offset: Vector2(0, 0.7),
      anchored: true,
    },
    {
      asset: 'images.tree_home_2',
      drawOrder: LAYERS.foreSprites,
      // flipX: '*',
      size: 6.1,
      x: 2,
      y: 0,
      offset: Vector2(0, 0.5),
      anchored: true,
    },
    {
      asset: 'images.tree_home_3',
      flipX: false,
      size: 6.4,
      x: 8,
      y: 0,
      offset: Vector2(0, 0.5),
      anchored: true,
    },
    {
      asset: 'images.logo_text',
      drawOrder: LAYERS.foreSprites,
      size: 20,
      x: 17,
      y: 23,
      anchored: false,
    },
    {
      asset: 'images.windmill',
      drawOrder: LAYERS.background + 1,
      anchored: false,
      fixed: true,
      y: 0.204,
      x: 0.1215,
      size: 400,
      rotatingSpeed: 0.2,
    },
  ],
}
