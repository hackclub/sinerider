precision mediump float;

uniform float time;
uniform sampler2D gaussianX;
uniform vec2 resolution;

void main(void) {
    vec3 sampleCol = vec3(0.0);
    
    float sum = 0.0;
    
    vec2 uv = gl_FragCoord.xy/resolution.xy;
   
    float GAUSSIAN_KERNEL_WIDTH = (cos(time)+1.)/2.*10.;
    float warp_x = sin(time) * 0.2 * sin(uv.y) + 1.;
   
    for (float y = -10.; y <= 10.; y++) {
        if (y >= GAUSSIAN_KERNEL_WIDTH) break;
        float g = gaussian(0.0, GAUSSIAN_KERNEL_WIDTH);
        vec2 uv = (gl_FragCoord.xy + vec2(0.0, y)) / resolution.xy;
        vec2 warped_uv = uv/warp_x;
        sampleCol += (texture2D(gaussianX, warped_uv) * g).rgb;
        sum += g;
    }

    gl_FragColor = vec4(sampleCol / sum, 1.0);
}