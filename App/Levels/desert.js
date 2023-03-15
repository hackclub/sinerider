const DESERT = {
  name: 'Desert',
  nick: 'DESERT',
  biome: 'sinusoidalDesert',
  axesEnabled: false,
  runAsCutscene: true,
  x: -10,
  y: -10,
  camera: {
    x: 2,
    y: -2,
    fov: 7,
  },
  requirements: ['COS'],
  defaultExpression:
    '\\sin \\left(\\frac{x}{10}\\right)+\\sin \\left(\\frac{x}{20}+\\frac{pi}{3}\\right)+\\sin \\left(\\frac{x}{53}+\\frac{pi}{2}\\right)',
  directors: [
    {
      type: 'lerp',
      point0: [0, 0],
      point1: [25, 0],
      state0: {
        position: [-2, 4],
        fov: 5,
      },
      state1: {
        position: [35, 8],
        fov: 12,
      },
    },
    {
      type: 'lerp',
      point0: [35, 0],
      point1: [75, 0],
      state0: {
        position: [35, 8],
        fov: 12,
      },
      state1: {
        position: [75, 5],
        fov: 8,
      },
    },
  ],
  goals: [],
  sky: {
    asset: 'images.sinusoidal_desert_background',
    margin: 1,
  },
  dialogue: [
    {
      speaker: 'Ada',
      color: '#FFF',
      content: 'How was the canyon?',
      direction: 'up-up-left',
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: 'Scary. Hard.',
      direction: 'up-up-right',
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: "Well, that's why it's not on the route.",
      direction: 'up-up-left',
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: 'I did a backflip!',
      direction: 'up-up-right',
      speech: [
        {
          speaker: 'Jack',
          color: '#FFF',
          content: 'I still had fun.',
          direction: 'up',
        },
      ],
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: "No, you didn't.",
      direction: 'up-up-left',
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: 'Yes I did!',
      direction: 'up-up-left',
      gap: 1,
      length: 2,
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: 'Spinning in place is not a backflip.',
      direction: 'up-left',
      length: 4,
      speech: [
        {
          speaker: 'Ada',
          color: '#FFF',
          content: 'Jack… we are ghosts. We float.',
          direction: 'up-up-left',
        },
      ],
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: "You're just being negative.",
      direction: 'up-up-left',
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: "It's just the truth!!",
      direction: 'up-left',
      speech: [
        {
          speaker: 'Ada',
          color: '#FFF',
          content: "The truth isn't negative!",
          direction: 'up',
        },
      ],
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: 'Are you mad at me?',
      direction: 'up-up-left',
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: 'A little, yeah!',
      direction: 'up-up-left',
      gap: 1,
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: 'And probably the race.',
      direction: 'up-up-left',
      speech: [
        {
          speaker: 'Ada',
          color: '#FFF',
          content: 'Your adventure cost us time.',
          direction: 'up',
        },
      ],
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: "You're right, I'm sorry.",
      direction: 'up-up-right',
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      speakerx: -4,
      content: 'Let me make it up to you. Watch this',
      direction: 'up-up-left',
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: '...how is this helping',
      direction: 'up-up-left',
    },
    {
      speaker: 'Jack',
      color: '#FFF',
      content: 'Because it made you smile.',
      direction: 'up-up-left',
    },
    {
      speaker: 'Ada',
      color: '#FFF',
      content: 'You do have a talent for that.',
      direction: 'up-up-left',
    },
  ],
  walkers: [
    {
      name: 'Ada',
      x: -4,
      victoryX: 78,
      asset: 'images.sam_float',
      range: [-6, PINF],
      bobSpeed: 0.918218,
      walkers: {
        name: 'Jack',
        x: -6,
        backflip: [62, 66],
        asset: 'images.benny_float',
      },
    },
  ],
  sprites: [],
  backgroundMusic: {
    asset: 'sounds.music.desert.western_loop',
    volume: 0.4,
  },
}
