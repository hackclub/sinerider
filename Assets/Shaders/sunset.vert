precision mediump float;

attribute vec2 aCoords;

void main() {
  gl_Position = vec4(aCoords, 0, 1);
}
