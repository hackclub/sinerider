precision mediump float;

varying vec2 uv;

uniform float t;
uniform float progress;

#define PI 3.14159

float rand(vec2 c){
  return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float noise(vec2 p, float freq) {
  float unit = uv.x/freq;
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

float linearstep(float a, float b, float t) {
    return clamp((t-a)/(b-a), 0., 1.);
}

vec4 lava(vec2 uv, vec2 s) {
    float time = t * 0.3;

    // Voronoi coordinates
    vec2 st = uv * 20.;

    // Tile
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 1.;  // minimum distance
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(i),float(j));

            // Random position from current + neighbor place in the grid
            vec2 offset = random2(i_st + neighbor);

            // Animate the offset
            offset = 0.5 + 0.5*sin(time * 2. + 6.2831*offset);

            // Position of the cell
            vec2 pos = neighbor + offset - f_st;

            // Cell distance
            float dist = length(pos); // * 0.9 * smoothstep(.01, .07, uv.y) * (1.-smoothstep(.1, .25, uv.y));

            // Metaball it!
            m_dist = min(m_dist, m_dist*dist);
        }
    }
    
    float innerHeight = smoothstep(0.2, 0.4, uv.y + cos((uv.x + time) * 10.) * 0.01 + cos((uv.x + time) * 0.3) * 0.02);
    float h = uv.y + sin(time) * 0.03 + cos(time) * 0.01 + sin((uv.x + time) * 12.) * 0.03 + sin((uv.x + time + 0.6) * 8.) * 0.02;

    float blobThreshold = (1.-smoothstep(innerHeight+0.01, innerHeight + 0.1, h)) * linearstep(0.0, smoothstep(.45, .55, h), uv.y) * 0.2;
    
    float o = pow(pNoise((uv + 0.1 * vec2(time, time)) * 2000., 2), 0.4);
    
    vec3 lavaCol = mix(vec3(0.6, 0.15, 0.), vec3(0.9, 0.2, 0.), o - 0.4*step(blobThreshold, m_dist));

    vec3 col = mix(lavaCol, lavaCol * 3.5, innerHeight);
    float a = smoothstep(0.57, 0.6, h);
    col = mix(col, vec3(1.0), a);
    
    return vec4(col, 1.-smoothstep(0.98, 1., a));
}

void main(void) {
    vec2 uv = uv;

    vec4 col = lava(uv, uv * vec2(1., 3.));

    gl_FragColor = col;
}