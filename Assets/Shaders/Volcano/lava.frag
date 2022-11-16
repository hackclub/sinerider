precision mediump float;

varying vec2 TexCoords;

uniform float time;
uniform float progress;

#define PI 3.14159

float rand(vec2 c){
  return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq) {
  float unit = TexCoords.x/freq;
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
  float n = 0.5;
  float normK = 0.;
  float f = 6.;
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

vec4 lava(vec2 uv, vec2 s) {
    float t = time;

    float o = pow(pNoise((uv + 0.01 * vec2(t, t)) * 2000., 6), 0.4);
    vec3 lavaCol = mix(vec3(0.6, 0.15, 0.), vec3(0.9, 0.2, 0.), o);

    float height = 0.55;
    
    float innerHeight = s.y + sin((s.x + t)) * 0.005 + cos((s.x + t) * 5.) * 0.03;
    float surfaceHeight = innerHeight + 0.1;

    float b = 0.005;

    vec3 col = mix(lavaCol, lavaCol * 3.5, smoothstep(0.18, 0.4, uv.y + cos((uv.x + t) * 10.) * 0.01 + cos((uv.x + t) * 0.3) * 0.02));
    float h = uv.y + sin(t) * 0.03 + cos(t) * 0.01 + sin((uv.x + t) * 12.) * 0.03 + sin((uv.x + t + 0.6) * 8.) * 0.02;
    float a = smoothstep(0.45, 0.6, h);
    float a2 = smoothstep(0.6, 0.7, h);
    col = mix(col, vec3(1.0), a);
    // col = mix(col, mix(vec3(0.6, 0.15, 0.) * 1.8, vec3(1.0), a2), step(1., a));
    
    return vec4(col.r, col.g, col.b, 1.-step(1., a));
}

void main(void) {
    vec2 uv = TexCoords;

    vec4 col = lava(uv, uv * vec2(1., 3.));

    gl_FragColor = col;
}