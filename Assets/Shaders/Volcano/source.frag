precision mediump float;

uniform float time;
uniform sampler2D frame;
uniform vec2 resolution;

#define PI 3.1415926538

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

void main(void) {
  // Normalized pixel coordinates (from 0 to 1)

  // [1.0, 1.0]
  // [0.1, 0.1]

  // + [.9/2-0.1]

  // [1.0*s, 1.0*s]
  // [1.0-s]

  float volcano_prox = smoothstep(0., 1., 1.-abs((16.-time)/5.));

  vec2 uv = gl_FragCoord.xy/resolution.xy;
  vec2 s = vec2(pNoise(vec2(time * 200., time * 100.), 20), pNoise(vec2(time * 400., time * 100.) + vec2(.12374), 20));
  s = s * volcano_prox * 0.1;
  // vec2 uv_scaled = uv*s+vec2(.5)-uv*s/2.;
  vec2 uv_scaled = uv + s;
  vec3 col = texture2D(frame, uv).rgb;

  // Vignette
  col *= 1.0 - 1.8 * smoothstep(1.-1.1*volcano_prox, 1., distance(uv, vec2(.5)));

  // Output to screen
  // col = vec3(volcano_prox);
  gl_FragColor = vec4(col,1.0);
}