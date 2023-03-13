const BIOMES = {
  home: {
    colors: Colors.biomes.home,
    clouds: {},
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
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
  },
  valleyOfTheParabola: {
    colors: Colors.biomes.champlain,
    sky: {
      asset: 'images.valley_parabola_background',
      margin: 1,
    },
  },
  eternalCanyon: {
    colors: Colors.biomes.gunnison,
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
  },
  sinusoidalDesert: {
    colors: Colors.biomes.arches,
    sky: {
      asset: 'images.sinusoidal_desert_background',
      margin: 1,
    },
  },
  logisticDunes: {
    colors: Colors.biomes.mojave,
    sky: {
      asset: 'images.logistic_dunes_background',
      margin: 1,
    },
  },
  hilbertDelta: {
    colors: Colors.biomes.everglades,
    sky: {
      asset: 'images.hilbert_delta_background',
      margin: 1,
    },
  },
}
