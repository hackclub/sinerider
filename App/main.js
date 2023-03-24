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

const debugLevel = null; // 'Level Editor', 'Volcano', 'Constant Lake', 'Two Below'

const canvas = ui.canvas

// Create the engine
const engine = new Engine(ticksPerSecond, tickDelta, debugStepping, debugLevel)

// Let's goooooooo!
engine.start()

// NOTE - this global is actually relied upon :/
const world = engine.getWorld()
