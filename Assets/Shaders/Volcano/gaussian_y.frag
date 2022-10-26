precision mediump float;

uniform float time;
uniform sampler2D gaussianX;
uniform vec2 resolution;
uniform float kernelWidth;

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