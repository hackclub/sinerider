precision mediump float;

uniform sampler2D stars;
uniform vec2 resolution;

uniform float time;

#define PI 3.1415926538

// #define DEBUG_STAR_FIELD

#define LIGHT_SKY_G0_COL  vec3(0.388235, 0.576471, 0.780392)
#define LIGHT_SKY_G1_COL  vec3(0.243137, 0.431373, 0.686275)
#define SKY_COL           vec3(1., 0.972549, 0.8)

#define LIGHT_YELLOW      vec3(0.937255, 0.886275, 0.568627)
#define LIGHT_ORANGE      vec3(0.92549, 0.764706, 0.435294)
#define RED               vec3(0.913725, 0.423529, 0.447059)
#define VELVET            vec3(0.788235, 0.243137, 0.443137)
#define LIGHT_PURPLE      vec3(0.192157, 0.14902, 0.470588)
#define DARK_PURPLE       vec3(0.094118, 0.058824, 0.266667)
#define BLACK             vec3(0.031373, 0.011765, 0.14902)

#define SUN_ORANGE_WHITE  vec3(1., 0.972549, 0.7)
#define SUN_WHITE         vec3(1., 0.984314, 0.972549)

#define SUN_GLOW_ORANGE   vec3(0.988235, 0.568627, 0.)


#define HORIZON_Y         0.35
#define SUN_START_Y       0.9

// When to start fading in stars w.r.t. iTime
#define START_STARS_FADE_IN  8.0
#define END_STARS_FADE_IN    10.0

// Credit for noise helpers to https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(vec2 c) {
	return fract(sin(dot(c.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = resolution.y/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res) {
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<4; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}

float lerpBetween(float lower, float upper, float a) {
  return clamp((a - lower) / (upper - lower), 0., 1.);
}

void main(void) {
  // adapt to ShaderToy
  float iTime = time;

  vec2 uv = gl_FragCoord.xy/resolution.y;
  uv.x += 0.5-.5*resolution.x/resolution.y;

  vec3 col = vec3(0.);
  
  vec2 sunPos = vec2(0.5, SUN_START_Y - 0.5 * iTime/5.);
  float horizonProx = 2.0 * (1.0 - lerpBetween(HORIZON_Y - (SUN_START_Y - HORIZON_Y), SUN_START_Y, sunPos.y));
  
  vec3 lightSkyCol = mix(LIGHT_SKY_G0_COL, LIGHT_SKY_G1_COL, uv.y);
  vec3 horizonCol = mix(LIGHT_ORANGE, VELVET, uv.y);
  vec3 purpleCol = mix(LIGHT_PURPLE, DARK_PURPLE, uv.y);
  vec3 blackCol = mix(DARK_PURPLE, BLACK, uv.y);

  float sunDist = distance(sunPos, uv);

  float noise = pNoise((uv - vec2(1.0 * (SUN_START_Y - sunPos.y), 0.0)) * vec2(200.0, 1000.0), 50);

  float skyProgress = horizonProx;


  vec3 skyCol = mix(horizonCol, lightSkyCol, noise + smoothstep(0.0, 0.1 + 1.7 * pow(horizonProx, 2.0), uv.y));
  skyCol = mix(skyCol, purpleCol, noise + smoothstep(1.0 - 1.3 * pow(horizonProx, 3.0), 2.0 - 2.0 * pow(max(0., horizonProx - 1.0), 6.0), uv.y));
  skyCol += SUN_GLOW_ORANGE * 1./(1. + sunDist * 5.0); // Sun glow
  skyCol = mix(skyCol, blackCol, smoothstep(1.0 - pow(horizonProx / 1.2, 8.5), 2.0 - 2. * pow(horizonProx / 3.3, 8.5), uv.y));
  skyCol *= 1.0 - smoothstep(1.3, 1.7, horizonProx);

  col += skyCol;


  float sun = pow(.15/sunDist, mix(1.0, 10.0, pow(horizonProx, 3.0)));
  vec3 sunCol = mix(SUN_WHITE, SUN_ORANGE_WHITE, pow(lerpBetween(0.65, 1.1, horizonProx), 2.0));
  col = mix(col, sunCol, clamp(sun, 0.0, 1.0));


  vec2 sampleUv = gl_FragCoord.xy/resolution.xy;

  vec3 starCol = texture2D(stars, sampleUv).rgb;
  starCol *= pow(smoothstep(0.0, 0.8, length(starCol)), 2.0);
  col = mix(col, starCol, lerpBetween(START_STARS_FADE_IN, END_STARS_FADE_IN, iTime + sampleUv.y) * (1. - length(skyCol)));

  #if defined(DEBUG_STAR_FIELD)
  col = starCol;
  #endif

  gl_FragColor = vec4(col, 1.0);
}
