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
    assets: {
      sounds: {
        music: {
          birds: '.mp3',
        },
      },
      images: {
        initial_bg: 'initial-bg.webp',
      },
    },
  },
  westernSlopes: {
    colors: Colors.biomes.alps,
    backgroundMusic: 'sounds.music.western_slopes_puzzle',
    sky: {
      asset: 'images.western_slopes_background',
      margin: 1,
    },
    assets: {
      images: {
        western_slopes_background: '.webp',
      },
      sounds: {
        music: {
          western_slopes_puzzle: '.mp3',
        },
      },
    },
  },
  valleyParabola: {
    colors: Colors.biomes.champlain,
    backgroundMusic: 'sounds.music.valley_parabola_puzzle',
    sky: {
      asset: 'images.valley_parabola_background',
      margin: 1,
    },
    assets: {
      sounds: {
        music: {
          valley_parabola_puzzle: '.mp3',
        },
      },
      images: {
        valley_parabola_background: '.webp',
      },
    },
  },
  eternalCanyon: {
    colors: Colors.biomes.gunnison,
    backgroundMusic: 'sounds.music.eternal_canyon_puzzle',
    sky: {
      asset: 'images.eternal_canyon_background',
      margin: 1,
    },
    assets: {
      sounds: {
        music: {
          eternal_canyon_puzzle: '.mp3',
        },
      },
      images: {
        eternal_canyon_background: '.webp',
      },
    },
  },
  sinusoidalDesert: {
    colors: Colors.biomes.arches,
    backgroundMusic: 'sounds.music.sinusoidal_desert_puzzle',
    sky: {
      asset: 'images.sinusoidal_desert_background',
      margin: 1,
    },
    assets: {
      sounds: {
        music: {
          sinusoidal_desert_puzzle: '.mp3',
        },
      },
      images: {
        sinusoidal_desert_background: '.webp',
      },
    },
  },
  logisticDunes: {
    colors: Colors.biomes.mojave,
    backgroundMusic: 'sounds.music.logistic_dunes_puzzle',
    sky: {
      asset: 'images.logistic_dunes_background',
      margin: 1,
    },
    assets: {
      sounds: {
        music: {
          logistic_dunes_puzzle: '.mp3',
        },
      },
      images: {
        logistic_dunes_background: '.webp',
      },
    },
  },
  hilbertDelta: {
    colors: Colors.biomes.everglades,
    backgroundMusic: 'sounds.music.hilbert_delta_puzzle',
    sky: {
      asset: 'images.hilbert_delta_background',
      margin: 1,
    },
    assets: {
      sounds: {
        music: {
          hilbert_delta_puzzle: '.mp3',
        },
      },
      images: {
        hilbert_delta_background: '.webp',
      },
    },
  },
}
