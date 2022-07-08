precision mediump float;

uniform vec2 resolution;

varying vec2 TexCoords;
varying float livedFor;

void main(void) {
    vec3 col = vec3(1.0);

    float a = 1.0 - smoothstep(.49, .5, distance(TexCoords, vec2(.5)));
    // a *= 1.0 - smoothstep(0.0, 1.0, livedFor);

    a *= smoothstep(0.0, 0.5, livedFor);

    gl_FragColor = vec4(col, a);
}