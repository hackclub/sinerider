precision mediump float;

uniform sampler2D texture;

varying vec2 uv;

void main(void) {
  vec3 col = texture2D(texture, uv).rgb;
  gl_FragColor = vec4(col, 1.0);
}