precision mediump float;

uniform float time;
uniform sampler2D gaussianY;
uniform vec2 resolution;
uniform float opacity;

float hash11(float a) {
    return fract(53.156*sin(a*45.45));
}

void main(void) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution;

    vec3 col = texture2D(gaussianY, vec2(uv.x, 1.0 - uv.y)).rgb;
    
    // Output to screen
    gl_FragColor = vec4(col, opacity);
    // gl_FragColor = vec4(0.4, 0.8, 0.3, 1.0);
}