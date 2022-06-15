precision mediump float;

uniform vec2 resolution;
uniform float frame;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 rainbow = 0.5 + 0.5 * vec4(cos(frame / 60.0 + uv.xyx + vec3(0, 2, 4)), 1.0);

  gl_FragColor = vec4(rainbow.xyz, 1.0);
}