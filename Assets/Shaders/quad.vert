precision mediump float;

attribute vec2 aCoords;
attribute vec2 aTexCoords;

varying vec2 uv;

void main() {
  gl_Position = vec4(aCoords, 0, 1);
  uv = aTexCoords;
}
