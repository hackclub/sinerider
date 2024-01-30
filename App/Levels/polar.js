const POLAR = [
  {
    name: 'Polar',
    nick: 'POLAR_SPIRAL',
    colors: Colors.biomes.alps,
    x: -20,
    y: 10,
    requirements: [],
    sledders: [
      {
        asset: 'images.jack_sled',
        x: 0,
        y: 0,
      },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(2 * (PI / 6)),
      //   y: 6 * Math.sin(2 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(3 * (PI / 6)),
      //   y: 6 * Math.sin(3 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(4 * (PI / 6)),
      //   y: 6 * Math.sin(4 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(5 * (PI / 6)),
      //   y: 6 * Math.sin(5 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(6 * (PI / 6)),
      //   y: 6 * Math.sin(6 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(7 * (PI / 6)),
      //   y: 6 * Math.sin(7 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(8 * (PI / 6)),
      //   y: 6 * Math.sin(8 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(9 * (PI / 6)),
      //   y: 6 * Math.sin(9 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(10 * (PI / 6)),
      //   y: 6 * Math.sin(10 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(11 * (PI / 6)),
      //   y: 6 * Math.sin(11 * (PI / 6)),
      // },
      // {
      //   asset: 'images.jack_sled',
      //   x: 6 * Math.cos(12 * (PI / 6)),
      //   y: 6 * Math.sin(12 * (PI / 6)),
      // },
    ],
    texts: [
      {
        x: 3,
        y: 3,
        content: 'This is wack',
      },
    ],
    graphType: 'polar',
    defaultExpression: '5',
    invertGravity: false,
    maxTheta: TAU,
    camera: {
      x: 0,
      y: 0,
      fov: 7,
    },
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
  },
]
