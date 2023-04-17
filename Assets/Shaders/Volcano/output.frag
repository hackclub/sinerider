precision mediump float;

uniform float time;
uniform float progress;
uniform sampler2D gaussianY;
uniform vec2 resolution;
uniform float opacity;

void main(void) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution;

    vec3 col = texture2D(gaussianY, vec2(uv.x, 1.0 - uv.y)).rgb;
    
    // Output to screen
    gl_FragColor = vec4(col, 1.);
}