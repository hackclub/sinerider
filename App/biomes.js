const BIOMES = {
  home: {
    colors: Colors.biomes.home,
    clouds: {},
    backgroundMusic: 'sounds.music.birds',
    snow: {
      density: 0.1,
      maxHeight: 8,
      velocity: {
        x: 0.2,
        y: 0.4,
      },
    },
    sky: {
      asset: 'images.initial_bg',
      margin: 1,
    },
  },
  westernSlopes: {
    colors: Colors.biomes.alps,
    backgroundMusic: 'sounds.music.western_slopes_puzzle',
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
  },
  valleyParabola: {
    colors: Colors.biomes.champlain,
    backgroundMusic: 'sounds.music.valley_parabola_puzzle',
    sky: {
      asset: 'images.valley_parabola_background',
      margin: 1,
    },
  },
  eternalCanyon: {
    colors: Colors.biomes.gunnison,
    backgroundMusic: 'sounds.music.eternal_canyon_puzzle',
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  sinusoidalDesert: {
    colors: Colors.biomes.arches,
    backgroundMusic: 'sounds.music.sinusoidal_desert_puzzle',
    sky: {
      asset: 'images.sinusoidal_desert_background',
      margin: 1,
    },
  },
  logisticDunes: {
    colors: Colors.biomes.mojave,
    backgroundMusic: 'sounds.music.logistic_dunes_puzzle',
    sky: {
      asset: 'images.logistic_dunes_background',
      margin: 1,
    },
  },
  hilbertDelta: {
    colors: Colors.biomes.everglades,
    backgroundMusic: 'sounds.music.sinusoidal_desert_puzzle',
    sky: {
      asset: 'images.hilbert_delta_background',
      margin: 1,
    },
  },
}
