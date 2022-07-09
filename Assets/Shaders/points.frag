precision mediump float;

varying vec2 uv;
varying float _livedFor;
varying vec3 _particleColor;

void main(void) {
    // vec3 col = vec3(1.0);

    // float a = 1.0 - smoothstep(.49, .5, distance(TexCoords, vec2(.5)));
    // // a *= 1.0 - smoothstep(0.0, 1.0, livedFor);


    // vec3 col = vec3(0.3, 0.5, 0.8);
    vec3 col = _particleColor;

    // float a = 1.0;
    float a = 1.0 - smoothstep(0.0, 0.5, abs(uv.x - 0.5));
    a *= smoothstep(0.0, 0.5, _livedFor);

    gl_FragColor = vec4(col, a);
}