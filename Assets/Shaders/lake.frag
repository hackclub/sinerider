precision mediump float;

varying vec2 uv;

uniform float time;

void main(void) {
    vec3 col = vec3(0.2, 0.2, 1.);

    float height = 0.55;
    
    float waterHeight = uv.y + sin((uv.x + time) * 4.) * 0.015;

    float b = 0.005;

    float a = 1.0 - smoothstep(height, height + b, waterHeight);

    // vec3 backgroundCol = texture2D(background, uv + vec2(.1));
    // col = mix(col, backgroundCol, (1. - uv.y) / 2.);

    gl_FragColor = vec4(col, a);
}