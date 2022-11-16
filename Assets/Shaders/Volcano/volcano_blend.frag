precision mediump float;

uniform sampler2D current;
uniform sampler2D acc;

varying vec2 TexCoords;

void main(void) {
  vec3 currentCol = texture2D(current, TexCoords).rgb;
  vec3 accCol = texture2D(acc, TexCoords).rgb;

  vec3 col = accCol * 0.975 + currentCol;

  gl_FragColor = vec4(col, 1.0);
}