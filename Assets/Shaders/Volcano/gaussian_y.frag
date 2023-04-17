precision mediump float;

uniform float time;
uniform sampler2D gaussianX;
uniform vec2 resolution;
uniform float kernelWidth;

#define PI 3.14159 // pi for gaussian/hsb
#define SIGMA 0.84089642 // sigma constant for gaussian

#define INNER_RADIUS 160.0
#define RADIUS 200.0

#define SHADOW_RADIUS 60.0
#define INNER_SHADOW_RADIUS 10.0

#define FADE_BUFFER 2.0
#define GAUSSIAN_KERNEL_WIDTH 3.0

float gaussian(float x, float y) {
    return 1.0 / (2.0 * PI * pow(SIGMA, 2.0)) * exp(-(pow(x, 2.0) + pow(y, 2.0)) / (2.0 * pow(SIGMA, 2.0)));
}

float per(float min, float max, float t) {
    return (sin(t)+1.)/2.*(max-min)+min;
}

void main(void) {
  vec3 sampleCol = vec3(0.0);
  
  float sum = 0.0;
  
  // vec2 uv = gl_FragCoord.xy/resolution.xy;
  
  for (float y = -10.; y <= 10.; y++) {
    if (abs(y) > kernelWidth) continue;
    float g = gaussian(0.0, kernelWidth);
    vec2 uv = (gl_FragCoord.xy + vec2(0.0, y)) / resolution.xy;
    sampleCol += (texture2D(gaussianX, uv) * g).rgb;
    sum += g;
  }

  gl_FragColor = vec4(sampleCol / sum, 1.0);
}