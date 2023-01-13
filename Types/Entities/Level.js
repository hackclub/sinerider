function Level(spec) {
	const { self, assets, screen, ui } = Entity(spec, "Level");

	const {
		globalScope,
		levelCompleted,
		datum,
		isBubbleLevel,
		storage,
		savedLatex,
		world,
	} = spec;

	let {
		colors = Colors.biomes.alps,
		defaultExpression,
		hint = "",
		openMusic,
		runMusic,
		flashMathField = false,
		flashRunButton = false,
		runAsCutscene = false,
		camera: cameraSpec = {},
	} = datum;

	const quads = globalScope.quads;

	const sledders = [];
	const walkers = [];
	const goals = [];
	const texts = [];
	const sprites = [];
	const speech = [];
	const directors = [];
	const bubbles = [];
	const sounds = [];

	let lowestOrder = "A";
	let highestOrder = "A";

	let lava, volcanoSunset, sky;

	if (flashMathField) ui.expressionEnvelope.classList.add("flash-shadow");
	else ui.expressionEnvelope.classList.remove("flash-shadow");

	if (flashRunButton) ui.runButton.classList.add("flash-shadow");
	else ui.runButton.classList.remove("flash-shadow");

	let currentLatex;

	const trackedEntities = [speech, sledders, walkers, goals];

	// TODO: Fix hint text. Mathquill broke it
	// ui.mathField.setAttribute('placeholder', hint)

	openMusic = _.get(assets, openMusic, null);
	runMusic = _.get(assets, runMusic, null);

	let hasBeenRun = false;

	camera = Camera({
		globalScope,
		parent: self,
		...cameraSpec,
	});

	let axes = null;
	if (!datum.hasOwnProperty("axesEnabled") || datum.axesEnabled)
		axes = Axes({
			drawOrder: LAYERS.axes,
			camera,
			globalScope,
			parent: self,
		});

	if (axes) trackedEntities.unshift(axes);

	let darkBufferOrScreen = screen;
	let darkenBufferOpacity = 0.0;
	let darkenBuffer, darkenBufferScreen;

	if (isConstantLakeAndNotBubble()) {
		// Credit for screen buffer business logic to LevelBubble.js by @cwalker
		darkenBuffer = ScreenBuffer({
			parent: self,
			screen,
			drawOrder: LAYERS.lighting,
			postProcess: (ctx, width, height) => {
				// Darken screen
				ctx.globalCompositeOperation = "source-atop";
				ctx.fillStyle = `rgba(1.0, 0.5, 0, ${darkenBufferOpacity})`;
				ctx.fillRect(0, 0, width, height);
				ctx.globalCompositeOperation = "source-over";
			},
		});

		darkenBufferScreen = Screen({
			canvas: darkenBuffer.canvas,
		});

		darkBufferOrScreen = darkenBufferScreen;
	}

	const startingExpression =
		(!isConstantLakeAndNotBubble() ? savedLatex : null) ?? defaultExpression;

	const graph = Graph({
		camera,
		screen: darkBufferOrScreen,
		globalScope,
		expression: mathquillToMathJS(startingExpression),
		parent: self,
		drawOrder: LAYERS.graph,
		colors,
		sledders,
	});

	let shader = null; // Only loaded for Constant Lake

	let completed = false;

	let skyColors = colors.sky;

	if (_.isString(skyColors)) skyColors = [[0, skyColors]];

	let skyGradient = screen.ctx.createLinearGradient(0, 0, 0, 1);

	for (const color of skyColors) skyGradient.addColorStop(color[0], color[1]);

	loadDatum(spec.datum);

	let defaultVectorExpression =
		"\\frac{(\\sin(x) - (y - 2) \\cdot i) \\cdot i}{2}";
	if (isConstantLakeAndNotBubble() && savedLatex) {
		walkerPositionX = VECTOR_FIELD_END_X;
		defaultVectorExpression = savedLatex;
	}

	function isEditor() {
		return datum.nick == "LEVEL_EDITOR";
	}

	function awake() {
		refreshLowestOrder();

		// Add a variable to globalScope for player position
		globalScope.p = math.complex();
		assignPlayerPosition();

		if (runAsCutscene) {
			// Don't play sound, keep navigator
			world._startRunning(false, false);

			// Hide math field by default
			ui.expressionEnvelope.classList.add("hidden");
		}

		editor.active = isEditor();

		// For constant lake, change math field to vector
		// field editor for later in the scene
		if (isConstantLakeAndNotBubble()) {
			ui.expressionEnvelope.classList.add("hidden");
			ui.mathFieldLabel.innerText = "V=";

			ui.mathField.latex(defaultVectorExpression);
			ui.mathFieldStatic.latex(defaultVectorExpression);
		} else {
			// Otherwise display editor normally as graph editor
			ui.expressionEnvelope.classList.remove("hidden");
			ui.mathFieldLabel.innerText = "Y=";

			ui.mathField.latex(startingExpression);
			ui.mathFieldStatic.latex(startingExpression);
		}
	}

	function start() {}

	function startLate() {
		// self.sendEvent('levelFullyStarted')
	}

	function checkTransition(entity) {
		if (!entity.activeInHierarchy) return;

		const transition = entity.transition;
		if (transition) {
			// If X values met then make transition
			if (transition.xRequirements.length == 0) {
				const target = self.children.find((s) => s.name === transition.name);
				if (!target)
					throw Error(
						`Unable to find transition target from '${entity.name}' to '${transition.name}' (check the manifest!)`
					);
				target.active = true;
				entity.active = false;

				if (entity.walkers) entity.walkers.forEach((w) => (w.active = false));
				if (target.walkers) target.walkers.forEach((w) => (w.active = true));

				const x = entity.transform.x;

				target.transform.x = x;
			}
			// Otherwise check if current target met, if so then pop
			else {
				if (Math.abs(transition.xRequirements[0] - entity.transform.x) < 1) {
					transition.xRequirements.splice(0, 1);
				}
			}
		}
	}

	function getCutsceneDistanceParameter() {
		let playerEntity =
			walkers.find((s) => s.active) || sledders.find((w) => w.active);
		return playerEntity.transform.x.toFixed(1);
	}

	function tick() {
		// screen.ctx.filter = `blur(${Math.floor(world.level.sledders[0].rigidbody.velocity/40 * 4)}px)`

		let time = runAsCutscene
			? getCutsceneDistanceParameter()
			: (Math.round(globalScope.t * 10) / 10).toString();

		// LakeSunsetShader
		// VolcanoShader
		// VolcanoSunsetShader

		if ((globalScope.running || runAsCutscene) && !_.includes(time, "."))
			time += ".0";

		// console.log('tracked entities', trackedEntities)

		for (const walker of walkers) {
			checkTransition(walker);
		}
		for (const sledder of sledders) {
			checkTransition(sledder);
		}

		// ui.timeString.innerHTML = 'T='+time
		ui.runButtonString.innerHTML = "T=" + time;
		ui.stopButtonString.innerHTML = "T=" + time;

		assignPlayerPosition();

		if (isVolcano()) {
			let sunsetTime;
			const x = sledders[0]?.transform.x;
			sunsetTime = x ? Math.exp(-(((x - 205) / 100) ** 2)) : 0;
			globalScope.timescale = 1 - sunsetTime * 0.7;
			camera.shake = sunsetTime > 0.1 ? sunsetTime * 0.3 : 0;
			const vel = sledders[0]?.velocity ?? 20;
			const motionBlur = Math.min((vel / 40) * 4, 10);

			volcanoSunset.blur = motionBlur;
			sky.blur = motionBlur;
			graph.blur = motionBlur;
			lava.blur = motionBlur;
		}
	}

	function draw() {
		if (isConstantLake() && walkers[0] && walkers[0].transform.position) {
			const x = walkers[0].transform.position.x;

			drawConstantLakeEditor(x);
			darkenBufferOpacity = Math.min(0.9, Math.pow(x / 20, 2));

			const walkerDarkenOpacity = Math.pow(darkenBufferOpacity, 5);

			for (const walker of walkers) {
				walker.darkModeOpacity = walkerDarkenOpacity;

				for (const w of walker.walkers) {
					if (w.hasDarkMode) w.darkModeOpacity = walkerDarkenOpacity;
				}
			}
		}

		screen.ctx.save();
		screen.ctx.scale(1, screen.height);
		screen.ctx.fillStyle = skyGradient;

		datum.sky ? 0 : screen.ctx.fillRect(0, 0, screen.width, screen.height);
		screen.ctx.restore();
	}

	function assignPlayerPosition() {
		const playerEntity =
			walkers.length > 0
				? walkers[0]
				: sledders.length > 0
				? sledders[0]
				: axes;

		globalScope.p.re = playerEntity.transform.position.x;
		globalScope.p.im = playerEntity.transform.position.y;
	}

	function trackDescendants(entity, array = trackedEntities) {
		_.each(entity.children, (v) => {
			array.push(v);
			trackDescendants(v, array);
		});
	}

	function addGoal(goalDatum) {
		const generator = {
			path: PathGoal,
			fixed: FixedGoal,
			dynamic: DynamicGoal,
		}[goalDatum.type || "fixed"];

		const goal = generator({
			name: "Goal " + goals.length,
			parent: self,
			camera,
			graph,
			assets,
			sledders,
			globalScope,
			drawOrder: LAYERS.goals,
			goalCompleted,
			goalFailed,
			getLowestOrder: () => lowestOrder,
			world,
			...goalDatum,
		});

		goals.push(goal);
	}

	function addDirector(directorDatum) {
		const generator = {
			tracking: TrackingDirector,
			waypoint: WaypointDirector,
			lerp: LerpDirector,
			// 'drag': DragDirector,
		}[directorDatum.type || "tracking"];

		const director = generator({
			parent: self,
			camera,
			graph,
			globalScope,
			trackedEntities,
			...directorDatum,
		});

		directors.push(director);
	}

	function addTextBubbles(bubbleDatum) {
		bubbles.push(
			TextBubble({
				parent: self,
				camera,
				graph,
				globalScope,
				visible: false,
				place: "top-right",
				...bubbleDatum,
			})
		);
	}

	function addWalker(walkerDatum) {
		const walker = Walker({
			name: "Walker " + walkers.length,
			parent: self,
			camera,
			graph,
			globalScope,
			levelCompleted: () => {
				// for (sound of sounds)
				// sound.howl.volume(0)

				levelCompleted(true);
			},
			screen: darkBufferOrScreen,
			speechScreen: screen,
			drawOrder: LAYERS.walkers,
			hasDarkMode: isConstantLake(),
			...walkerDatum,
		});

		walkers.push(walker);

		// trackDescendants(walker)
	}

	function addSledder(sledderDatum) {
		const sledder = Sledder({
			name: "Sledder " + sledders.length,
			parent: self,
			camera,
			graph,
			globalScope,
			screen: darkBufferOrScreen,
			drawOrder: LAYERS.sledders,
			speechScreen: screen,
			motionBlur: false,
			...sledderDatum,
		});

		sledders.push(sledder);

		// trackDescendants(sledder, speech)
	}

	function addSound(soundDatum) {
		const sound = Sound({
			name: "Sound " + soundDatum.asset,
			parent: self,
			walkers,
			sledders,
			...soundDatum,
		});

		sounds.push(sound);
	}

	function addSprite(spriteDatum) {
		const sprite = Sprite({
			name: "Sprite " + sprites.length,
			parent: self,
			camera,
			graph,
			globalScope,
			drawOrder: LAYERS.backSprites,
			anchored: true,
			screen: darkBufferOrScreen,
			speechScreen: screen,
			...spriteDatum,
		});

		sprites.push(sprite);
	}

	function addText(textDatum) {
		const text = Text({
			name: "Text " + texts.length,
			parent: self,
			camera,
			globalScope,
			drawOrder: LAYERS.text,
			...textDatum,
		});

		texts.push(text);
	}

	function goalCompleted(goal) {
		if (!completed) {
			refreshLowestOrder();

			let levelComplete = true;

			for (goal of goals) {
				if (!goal.completed) {
					levelComplete = false;
					break;
				}
			}

			assets.sounds.goal_success.play();

			if (levelComplete) {
				completed = true;
				levelCompleted();
				assets.sounds.level_success.play();
			}
		}
	}

	// Serialize to
	//  1. Store completed levels
	//  2. Share solutions
	//  3. Share custom levels

	function serialize() {
		return {
			v: 0.1, // TODO: change version handling to World?
			nick: datum.nick,
			savedLatex: currentLatex,
			goals: isEditor()
				? goals.map((g) => {
						s = {
							type: g.type,
							x: g.transform.x,
							y: g.transform.y,
							order: g.order,
						};
						return s;
				  })
				: null,
		};
	}

	function goalFailed(goal) {
		if (goal.order) {
			for (g of goals) {
				if (g.order && !g.completed) g.fail();
			}
		}

		assets.sounds.goal_fail.play();
	}

	function playOpenMusic() {
		if (openMusic) openMusic.play();
	}

	function reset() {
		stopRunning();
	}

	function restart() {
		const expression = isConstantLake()
			? defaultVectorExpression
			: defaultExpression;

		ui.mathField.latex(expression);

		self.sendEvent("setGraphExpression", [
			mathquillToMathJS(expression),
			expression,
		]);

		refreshLowestOrder();
	}

	function refreshLowestOrder() {
		lowestOrder = "Z";
		for (goal of goals) {
			if (!goal.completed && goal.order < lowestOrder) {
				lowestOrder = goal.order;
			}
		}

		_.invokeEach(goals, "refresh");
	}

	function startRunning() {
		ui.runButton.classList.remove("flash-shadow");

		ui.mathFieldStatic.latex(currentLatex);

		if (!hasBeenRun) {
			if (runMusic) runMusic.play();

			hasBeenRun = true;
		}
	}

	function stopRunning() {
		_.invokeEach(goals, "reset");
		_.invokeEach(bubbles, "toggleVisible");
		completed = false;
		refreshLowestOrder();
	}

	function isVolcano() {
		return datum.name === "Volcano";
	}

	function isConstantLake() {
		return datum.name === "Constant Lake";
	}

	function isConstantLakeAndNotBubble() {
		return isConstantLake() && !isBubbleLevel;
	}

	let isVectorEditorActive = false;

	const showUIAnimation = {
		keyframes: [
			{ transform: "translateY(calc(100% + 20px))", opacity: "0" },
			{ transform: "translateY(0px)", opacity: "1" },
			// { opacity: '0' },
			// { opacity: '1' },
		],
		options: {
			duration: 1700,
			easing: "ease-out",
			fill: "forwards",
		},
	};

	const hideUIAnimation = {
		keyframes: [
			{ transform: "translateY(0px)", opacity: "1" },
			{ transform: "translateY(calc(100% + 20px))", opacity: "0" },
		],
		options: {
			duration: 1700,
			easing: "ease-out",
		},
	};

	const VECTOR_FIELD_START_X = 13.5;
	const VECTOR_FIELD_END_X = 17.5;

	function drawConstantLakeEditor(walkerPositionX) {
		if (walkerPositionX > VECTOR_FIELD_END_X) {
			if (!isVectorEditorActive) {
				isVectorEditorActive = true;

				ui.resetButton.setAttribute("hide", false);
				ui.expressionEnvelope.classList.remove("hidden");

				ui.expressionEnvelope.animate(
					showUIAnimation.keyframes,
					showUIAnimation.options
				);
				ui.resetButton.animate(
					showUIAnimation.keyframes,
					showUIAnimation.options
				);
			}
		} else if (walkerPositionX < VECTOR_FIELD_START_X && isVectorEditorActive) {
			isVectorEditorActive = false;

			const resetButtonAnimation = ui.resetButton.animate(
				hideUIAnimation.keyframes,
				hideUIAnimation.options
			);
			const expressionEnvelopeAnimation = ui.expressionEnvelope.animate(
				hideUIAnimation.keyframes,
				hideUIAnimation.options
			);

			resetButtonAnimation.onfinish = () =>
				ui.resetButton.setAttribute("hide", true);
			expressionEnvelopeAnimation.onfinish = () =>
				ui.expressionEnvelope.classList.add("hidden");
		}
	}

	function mergeData(source, out) {
		for (const [key, value] of Object.entries(source)) {
			if (_.isObject(value)) {
				let tmp = {};
				mergeData(value, tmp);
				out[key] = tmp;
			} else {
				out[key] = value;
			}
		}
	}

	function loadDatum(datum) {
		if (!isBubbleLevel) _.each(datum.sounds, addSound);
		_.each(datum.sprites, addSprite);
		_.each(datum.sledders, addSledder);
		_.each(datum.walkers, addWalker);
		_.each(datum.goals, addGoal);
		_.each(datum.texts, addText);
		_.each(datum.directors || [{}], addDirector);
		isBubbleLevel || _.each(datum.textBubbles || [], addTextBubbles);

		if (isBubbleLevel && datum.bubble) {
			datum = _.merge(_.cloneDeep(datum), datum.bubble);
		}

		if (!isBubbleLevel && isVolcano()) {
			VolcanoShader({
				parent: self,
				screen,
				assets,
				quad: quads.volcano,
				drawOrder: LAYERS.volcanoPostProcessing,
				sledders,
			});
			LavaMonster({
				parent: self,
				world,
				screen,
				assets,
				drawOrder: LAYERS.backSprites - 1,
				camera,
				globalScope,
			});
			// PostProcessing({
			//   parent: self,
			//   screen,
			//   drawOrder: LAYERS.volcanoPostProcessing,
			//   process: ctx => {
			//     blur = Math.floor(Math.min(sledders[0].rigidbody.velocity.magnitude/40 * 4, 10))
			//     ctx.filter = `blur(${blur}px)`
			//   }
			// })
			volcanoSunset = VolcanoSunsetShader({
				parent: self,
				screen,
				assets,
				quad: quads.volcanoSunset,
				drawOrder: LAYERS.sky,
				sledders,
			});
			// sledders.forEach(s => s.drawOrder = 10000)
		}

		if (datum.clouds)
			CloudRow({
				parent: self,
				camera,
				globalScope,
				velocity: datum.clouds.velocity,
				heights: datum.clouds.heights,
				drawOrder: LAYERS.clouds,
				screen: darkBufferOrScreen,
				...datum.clouds,
			});
		// Constant Lake sunset scene
		if (isConstantLakeAndNotBubble()) {
			ConstantLakeShader({
				parent: self,
				screen,
				assets,
				quad: quads.sunset,
				drawOrder: LAYERS.sky,
				walkerPosition: walkers[0].transform.position,
			});
		}
		if (datum.water && !isBubbleLevel) {
			Water({
				parent: self,
				camera,
				waterQuad: quads.water,
				screen: darkBufferOrScreen,
				globalScope,
				drawOrder: LAYERS.backSprites,
				...datum.water,
			});
		}
		if (datum.lava && !isBubbleLevel) {
			lava = Water({
				parent: self,
				camera,
				waterQuad: quads.lava,
				screen: darkBufferOrScreen,
				globalScope,
				drawOrder: LAYERS.backSprites,
				...datum.lava,
			});
		}
		if (datum.sky) {
			sky = Sky({
				parent: self,
				camera,
				globalScope,
				asset: datum.sky.asset,
				margin: datum.sky.margin,
				screen: darkBufferOrScreen,
				drawOrder: LAYERS.background,
				motionBlur: false,
				...datum.sky,
			});
		}
		if (datum.snow)
			SnowFall({
				parent: self,
				camera,
				globalScope,
				screen,
				density: datum.snow.density,
				velocityX: datum.snow.velocity.x,
				velocityY: datum.snow.velocity.y,
				maxHeight: datum.snow.maxHeight,
				drawOrder: LAYERS.snow,
				screen: darkBufferOrScreen,
				...datum.snow,
			});

		if (datum.slider && !isBubbleLevel) {
			HintGraph({
				ui,
				parent: self,
				camera,
				screen,
				globalScope,
				drawOrder: LAYERS.hintGraph,
				slider: datum.slider,
			});
		}

		self.sortChildren();
	}

	function save() {
		// Save to player storage and to URI
		// storage.setLevel(datum.nick, serialize())
		// history.pushState(null, null, '?' + LZString.compressToBase64(JSON.stringify(serialize())))
	}

	function setGraphExpression(text, latex) {
		if (editor.editingPath) {
			// console.log('returning')
			return;
		}

		ui.mathFieldStatic.latex(latex);

		currentLatex = latex;

		save();

		if (isConstantLakeAndNotBubble()) {
			quads.sunset.setVectorFieldExpression(text);
			return;
		}

		graph.expression = text;
		ui.expressionEnvelope.setAttribute("valid", graph.valid);

		_.invokeEach(sledders, "reset");
		_.invokeEach(goals, "reset");
	}

	function mathFieldFocused() {
		ui.expressionEnvelope.classList.remove("flash-shadow");
	}

	function destroy() {
		if (runAsCutscene && !isBubbleLevel) {
			world._stopRunning();
		}
		_.invokeEach(bubbles, "destroy");
	}

	function resize() {
		darkBufferOrScreen.resize();
		graph.resize();
	}

	function removeGoal(type) {}

	// TODO: Refactor?
	let goalLookup = {};

	function goalAdded(type) {
		addGoal({
			type,
		});
		goalLookup[goals[goals.length - 1].id] = goals.length - 1;
	}

	// Takes in entity -- refactor?
	function goalDeleted(goal) {
		goals.splice(
			goals.findIndex((g) => g.id == goal.id),
			1
		);
	}

	return self.mix({
		awake,
		start,
		destroy,

		tick,
		draw,

		resize,

		serialize,

		startRunning,
		stopRunning,

		setGraphExpression,

		camera,
		graph,

		restart,
		reset,

		playOpenMusic,

		mathFieldFocused,

		get isRunningAsCutscene() {
			return runAsCutscene;
		},

		goalAdded,
		goalDeleted,

		save,

		goals,

		get currentLatex() {
			return currentLatex;
		},

		get datum() {
			return spec.datum;
		},
		get completed() {
			return completed;
		},

		isEditor,
		sledders,
		walkers,

		// TODO: temp
		trackedEntities,

		get firstWalkerX() {
			return walkers[0]?.transform.x;
		},
	});
}
