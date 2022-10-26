precision mediump float;

uniform float time;
uniform sampler2D frame;
uniform vec2 resolution;

// TODO: Switch to ES 3.00
// const kernel = float[9](
//     1., 1., 1.,
//     1., -8., 1.,
//     1., 1., 1.
// );

void main(void) {
    float kernel[9];
    kernel[0] = 1.;
    kernel[1] = 1.;
    kernel[2] = 1.;
    kernel[3] = 1.;
    kernel[4] = -8.;
    kernel[5] = 1.;
    kernel[6] = 1.;
    kernel[7] = 1.;
    kernel[8] = 1.;

    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution.xy;

    vec3 col = texture2D(frame, uv).rgb;
 
    // vec3 c = vec3(0.0);
     
    // float sum = 0.;
    
    // for (float x = -1.; x <= 1.; x++) {
    //     for (float y = -1.; y <= 1.; y++) {
    //         vec2 uv = (gl_FragCoord.xy + vec2(x, y))/resolution.xy;
    //         c += texture2D(frame, uv).rgb * kernel[int(x+1. + (y+1.)*3.)];
    //     }
    // }
    
    // col = c;
    // col *= 100.;

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}