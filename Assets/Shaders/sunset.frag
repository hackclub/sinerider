precision mediump float;

uniform sampler2D stars;
uniform vec2 resolution;

uniform float time;

#define PI 3.1415926538

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

#define SUN_WHITE         vec3(1., 0.972549, 0.8)
#define SUN_ORANGE_WHITE  vec3(1., 0.984314, 0.972549)


#define SUN_GLOW_ORANGE   vec3(0.988235, 0.568627, 0.)


#define HORIZON_Y         0.35
#define SUN_START_Y       0.9

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Credit to https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
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

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
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
  return clamp(0., 1., (a - lower) / (upper - lower));
}

void main(void) {
  // adapt to ShaderToy
  float iTime = (time + .7) * 5.;

  vec2 uv = gl_FragCoord.xy/resolution.y;
  uv.x += 0.5-.5*resolution.x/resolution.y;

  vec3 col = vec3(0.);
  
  vec2 sunPos = vec2(0.5, SUN_START_Y - 0.5 * iTime/5.);
  float horizonProx = 1.0 - clamp(0., 1., lerpBetween(HORIZON_Y, SUN_START_Y, sunPos.y));
  
  vec3 lightSkyCol = mix(LIGHT_SKY_G0_COL, LIGHT_SKY_G1_COL, uv.y);
  vec3 horizonCol = mix(LIGHT_ORANGE, VELVET, uv.y);
  vec3 purpleCol = mix(LIGHT_PURPLE, DARK_PURPLE, uv.y);
  vec3 blackCol = mix(DARK_PURPLE, BLACK, uv.y);

  float sunDist = distance(sunPos, uv);

  float noise = pNoise((uv - vec2(2.0 * (SUN_START_Y - sunPos.y), 0.0)) * vec2(200.0, 1000.0), 50);

  float skyProgress = horizonProx;

  float a = noise + smoothstep(0.0, 0.6, uv.y + skyProgress);
  float b = noise + smoothstep(0.6, 1.0, uv.y + skyProgress);
  float c = noise + smoothstep(7.0, 8.0, uv.y + skyProgress);

  vec3 skyCol = mix(lightSkyCol, horizonCol, clamp(0., 1., a));
  skyCol = mix(skyCol, purpleCol, clamp(0., 1., b));
  skyCol += SUN_GLOW_ORANGE * 1./(1. + sunDist * 3.0); // Sun glow
  skyCol = mix(skyCol, blackCol, clamp(0., 1., c));


  col += skyCol;


  float sun = pow(.15/sunDist, mix(1.0, 10.0, pow(horizonProx, 3.0)));
  vec3 sunCol = mix(SUN_WHITE, SUN_ORANGE_WHITE, pow(lerpBetween(0.65, 0.9, horizonProx), 2.0));
  col = mix(col, sunCol, min(1.0, sun));


  vec2 sampleUv = gl_FragCoord.xy/resolution.xy;

  vec3 starCol = texture2D(stars, sampleUv).rgb;
  col = mix(col, starCol, lerpBetween(9.0, 10.5, iTime + sampleUv.y));

  gl_FragColor = vec4(col, 1.0);
}