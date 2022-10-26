precision mediump float;

uniform float time;
uniform sampler2D source;
uniform vec2 resolution;
uniform float kernelWidth;

void main(void) {
  vec3 sampleCol = vec3(0.0);

  float sum = 0.0;

  // vec2 uv = gl_FragCoord.xy/resolution.xy;

  for (float x = -10.; x <= 10.; x++) {
    if (abs(x) > kernelWidth) continue;
    float g = gaussian(kernelWidth, 0.0);
    vec2 uv = (gl_FragCoord.xy + vec2(x, 0.0)) / resolution.xy;
    sampleCol += (texture2D(source, uv) * g).rgb;
    sum += g;
  }

  gl_FragColor = vec4(sampleCol / sum, 1.0);
}