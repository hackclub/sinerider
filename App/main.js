// Welcome to main.js, where we set up the SineRider engine basics

// Whether or not we should progress ticks automatically or require canvas clicks to progress
const debugStepping = false

const editor = Editor(ui)

// NOTE: 30 ticks per second is "normal", manipulating this value changes the simulation speed, but it maintains
// deterministic results regardless
const ticksPerSecond = 30 * 100 // (run 100x faster than normal)

// NOTE - this is very consciously decoupled from 'ticksPerSecond' so that we can get consistent results
// when modifying the # of ticks per second to be faster than normal (for instance, when we're scoring)
// This value is used by many internal tick handlers, mainly (as far as I can tell) to know how fast entities 
// should move per tick, and probably should be renamed to something like 'tickMoveDistanceMultiplier' or 
// something similar
const tickDelta = 1.0 / 30.0

// Set this to automatically load a level for debugging purposes (DO NOT CHECK IN)
const debugLevel = null; // 'Level Editor', 'Volcano', 'Constant Lake', 'Two Below'

// Enable to report current FPS via console.log every 100 ticks
const fpsLogging = true

// Create the engine
const engine = new Engine(ticksPerSecond, tickDelta, debugStepping, debugLevel, EngineRenderMode.FRAME_EVERY_TICK, fpsLogging)

// Let's goooooooo!
engine.start()

// NOTE - these seem to be globally relied upon
const canvas = ui.canvas
const world = engine.getWorld()
