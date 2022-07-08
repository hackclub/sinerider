precision mediump float;

attribute vec2 aCoords;
attribute vec2 aTexCoords;

// tightly packed [x, y, livedFor]
attribute vec3 particle;

uniform float time;

varying vec2 TexCoords;
varying float livedFor;

void main() {
    gl_Position = vec4(aCoords * .0015 + particle.xy * 2. - vec2(1., 1.), 0.0, 1.0);
    TexCoords = aTexCoords;
    livedFor = particle.z;
}