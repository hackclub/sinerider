worldData = [];

worldData.push({
	version: "0.0.0",
	name: "Eden",
	assets: {
		images: {
			lunchbox_sam_sled: "ada_jack_sled.webp",
			lunchbox_sled: "jack_sled.webp",
			benny_sled: "jack_sled.webp",
			benny_float: "jack_float_right.webp",
			benny_float_dark: ".svg",
			benny_float_left: ".svg",
			lavamonster: "lavamonster_transparent.png",
			lavamonster_jaw: ".png",
			lavamonster_top_jaw: ".png",
			lavamonster_bottom_jaw: ".png",
			sinusoidaldesertbiome_1: "sinusoidaldesertbiome_1.png",
			sinusoidaldesertbiome_2: "sinusoidaldesertbiome_2.png",
			sam_sled: "ada_sled.webp",
			sam_float: "ada_float_right.webp",
			sam_float_dark: ".svg",
			sam_float_left: ".svg",
			sam_stand_snowball: "sam_float_left.svg",
			cabin_1: ".webp",
			world_map: ".svg",
			goalpost_left: ".png",
			goalpost_right: ".png",
			cloud_1: ".webp",
			cloud_2: ".webp",
			cloud_3: ".webp",
			cloud_4: ".webp",
			cloud_5: ".webp",
			tree_1: ".webp",
			tree_2: ".webp",
			tree_3: ".webp",
			fox: ".webp",
			slime: ".webp",
			crow: ".webp",
			tree_home_1: ".webp",
			tree_home_2: ".webp",
			initial_bg: "initial-bg.webp",
			logistic_dunes_background: ".png",
			western_slopes_background: ".webp",
			western_slopes_background_no_sky: ".webp",
			eternal_canyon_background: ".png",
			valley_background: "logistic_dunes_background.png",
			volcano_background: ".webp",
			volcano_background_tall: ".webp",
			volcano_background_medium: ".webp",
			volcano_rock_1: ".PNG",
			volcano_rock_2: ".PNG",
			volcano_rock_2: ".PNG",
			volcano_rock_4: ".PNG",
			volcano_trees: ".PNG",
			logo_text: ".webp",
			rock_1: ".webp",
			rock_2: ".webp",
			rock_3: ".webp",
			bush_1: ".webp",
			bush_2: ".webp",
			grass_1: ".webp",
			plant_1: ".webp",
			plant_2: ".webp",
			plant_3: ".webp",
			plant_4: ".webp",
			plant_5: ".webp",
			plant_clump_1: ".webp",
			plant_clump_2: ".webp",
			plant_clump_3: ".webp",
			plant_clump_4: ".webp",
			plant_clump_5: ".webp",
		},
		sounds: {
			music: {
				intro: ".mp3",
				constant_lake: {
					base: "base_compressed.mp3",
					pad_1_loopable: "pad_1_loopable_compressed.mp3",
					pad_1: "pad_1_compressed.mp3",
					pad_2_loopable: "pad_2_loopable_compressed.mp3",
					pad_2: "pad_2_compressed.mp3",
					pad_3_loopable: "pad_3_loopable_compressed.mp3",
					pad_3: "pad_3_compressed.mp3",
					pad_swell_1: "pad_swell_1_compressed.mp3",
					pad_swell_2: "pad_swell_2_compressed.mp3",
					pad_swell_3: "pad_swell_3_compressed.mp3",
					swell_1: "swell_1_compressed.mp3",
					swell_2: "swell_2_compressed.mp3",
					swell_3: "swell_3_compressed.mp3",
					wind: "wind_compressed.mp3",
				},
				volcano: {
					start: ".mp3",
					middle_buildup: ".mp3",
					jump: ".mp3",
					middle_guitar: "middle_guitar.mp3",
				},
			},
			map_button: "map_button_compressed.mp3",
			next_button: "next_button_compressed.mp3",
			enter_level: "enter_level_compressed.mp3",
			goal_fail: "goal_fail_compressed.mp3",
			goal_success: "goal_success_compressed.mp3",
			level_success: "level_success_compressed.mp3",
			restart_button: "restart_button_compressed.mp3",
			start_running: "start_running_compressed.mp3",
			stop_running: "stop_running_compressed.mp3",
			map_zoom_in: {
				src: "woosh_out.mp3",
				rate: 1.2,
			},
			map_zoom_out: {
				src: "woosh_out.mp3",
				rate: 0.8,
			},
			map_zoom_highlighted: {
				src: "woosh_out.mp3",
				rate: 0.6,
			},
			map_zoom_show_all: {
				src: "woosh_out.mp3",
				rate: 0.4,
			},
			path_goal_start: "path_goal_start_compressed.mp3",
			path_goal_continue: "path_goal_continue_compressed.mp3",
		},
		shaders: {
			blend_frag: "blend.frag",
			points_frag: "points.frag",
			points_vert: "points.vert",
			lake_frag: "lake.frag",
			quad_frag: "quad.frag",
			quad_vert: "quad.vert",
			sunset_frag: "sunset.frag",
			volcano: {
				gaussian_x: ".frag",
				gaussian_y: ".frag",
				output: ".frag",
				source: ".frag",
				lava: ".frag",
				volcano_blend: ".frag",
				volcano_stars_frag: "volcano_stars.frag",
				volcano_stars_vert: "volcano_stars.vert",
				volcano_sunset: ".frag",
			},
		},
	},
	levelData: [
		{
			name: "Welcome",
			nick: "HELLO_WORLD",
			colors: Colors.biomes.home,
			x: 0,
			y: 0,
			requirements: [],
			runMusic: "sounds.music.intro",
			flashRunButton: true,
			defaultExpression:
				"\\frac{-2}{1+e^{-x+5}}+\\frac{-2}{1+\\left(x-28\\right)^2}",
			hint: "congratulations, you found the secret hint!",
			camera: {
				offset: {
					x: 0,
					y: 0.53,
				},
			},
			goals: [
				{
					type: "dynamic",
					x: 6.7,
					y: 0,
				},
			],
			sledders: [
				{
					x: 0,
					asset: "images.benny_sled",
					speech: {
						x: 0.3,
						content: "snow!!",
						direction: Vector2(0.5, 1),
						distance: 1.2,
						color: "#fff",
					},
				},
			],
			walkers: [
				{
					x: 7.6,
					victoryX: 10,
					followFlip: false,
					asset: "images.sam_float",
					range: [7.6, 7.6],
					size: 2,
					flipX: true,
					sloped: true,
					speech: [
						{
							x: -0.3,
							y: 1,
							content: "I gotta work, hit the green button ⇲",
							direction: "up-left",
							distance: 1.6,
							color: "#fff",
							speech: [
								{
									x: -1.5,
									content: "yes, snow.",
									direction: "up-up-left",
									distance: 0.8,
									color: "#fff",
									speech: [],
								},
							],
						},
					],
				},
			],
			sprites: [
				{
					asset: "images.cabin_1",
					drawOrder: LAYERS.foreSprites,
					flipX: "*",
					size: 6.1,
					x: -3,
					y: -1,
					offset: Vector2(0, 0.7),
					anchored: true,
				},
				{
					asset: "images.tree_home_1",
					drawOrder: LAYERS.foreSprites,
					flipX: "*",
					size: 6.1,
					x: 2,
					y: 0,
					offset: Vector2(0, 0.8),
					anchored: true,
				},
				{
					asset: "images.tree_home_1",
					flipX: "*",
					size: 5.4,
					x: -9,
					y: 0,
					offset: Vector2(0, 0.8),
					anchored: true,
				},
				{
					asset: "images.tree_home_1",
					drawOrder: LAYERS.foreSprites,
					flipX: "*",
					size: 6.7,
					x: -7.5,
					y: 0,
					offset: Vector2(0, 0.8),
					anchored: true,
				},
				{
					asset: "images.tree_home_2",
					flipX: false,
					size: 6.4,
					x: 8,
					y: 0,
					offset: Vector2(0, 0.8),
					anchored: true,
				},
				// {
				//   asset: 'images.tree_home_1',
				//   drawOrder: LAYERS.foreSprites,
				//   flipX: '*',
				//   size: 5.2,
				//   x: 21,
				//   y: 0,
				//   offset: Vector2(0, 0.8),
				//   anchored: true
				// },
				// {
				//   asset: 'images.tree_home_1',
				//   flipX: '*',
				//   size: 5.9,
				//   x: 10,
				//   y: 0,
				//   offset: Vector2(0, 0.8),
				//   anchored: true
				// },
				// {
				//   asset: 'images.tree_home_1',
				//   drawOrder: LAYERS.foreSprites,
				//   flipX: '*',
				//   size: 7.1,
				//   x: 34.2,
				//   y: 0,
				//   offset: Vector2(0, 0.7),
				//   anchored: true
				// },
				// {
				//   asset: 'images.tree_home_1',
				//   flipX: '*',
				//   size: 5.6,
				//   x: 36.3,
				//   y: 0,
				//   offset: Vector2(0, 0.8),
				//   anchored:true
				// },
				{
					asset: "images.crow",
					flipX: "*",
					size: 1,
					x: 31,
					y: 0,
					anchored: true,
				},
				{
					asset: "images.logo_text",
					drawOrder: LAYERS.foreSprites,
					size: 20,
					x: 20,
					y: 13,
					anchored: false,
				},
			],
			texts: [
				{
					x: 14,
					y: -5.5,
					size: 0.7,
					fill: "#ffffff",
					content: "WIP Pre-Alpha. Don’t distribute yet!",
				},
				{
					x: 14,
					y: -4,
					size: 1.5,
					fill: "#c4acd4",
					content: "A game about love and graphing.",
				},
			],
			sky: {
				asset: "images.initial_bg",
				margin: 1,
			},
			clouds: {},
			snow: {
				density: 0.4,
				maxHeight: 8,
				velocity: {
					x: 0.2,
					y: 0.4,
				},
			},
			textBubbles: [
				{
					content: "this one!",
					domSelector: "#run-button",
					place: "top-left",
					destroyOnClick: true,
					style: { fontSize: "1.1rem" },
				},
			],
		} /*{
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
  },*/,
		...SLOPE,
		...EDITOR,
		...PARABOLA,
		...WAVE,
		...LOGISTIC,
		...TIME,
	],
});

// Allows you to leave requirements as null to signify dependence on the previous level
for (world of worldData) {
	const levelData = world.levelData;

	for (let i = 1; i < levelData.length; i++) {
		const d = levelData[i];

		if (d.requirements == null) {
			d.requirements = [levelData[i - 1].nick];
			continue;
		}

		for (let j = 0; j < d.requirements.length; j++) {
			if (d.requirements[j] == null) {
				d.requirements[j] = [levelData[i - 1].nick];
			}
		}
	}
}
