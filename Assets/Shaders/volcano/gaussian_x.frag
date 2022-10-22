precision mediump float;

uniform float time;
uniform sampler2D source;
uniform vec2 resolution;

void main(void) {
    vec3 sampleCol = vec3(0.0);

    float sum = 0.0;

    vec2 uv = gl_FragCoord.xy/resolution.xy;
    float GAUSSIAN_KERNEL_WIDTH = (sin(time)+1.)/2.*10.;
    float warp_y = cos(time) * 0.2 * sin(uv.x) + 1.;

    for (float x = -10.; x <= 10.; x++) {
        if (x >= GAUSSIAN_KERNEL_WIDTH) break;
        float g = gaussian(GAUSSIAN_KERNEL_WIDTH, 0.0);
        vec2 uv = (gl_FragCoord.xy + vec2(x, 0.0)) / resolution.xy;
        sampleCol += (texture2D(source, uv/warp_y) * g).rgb;
        sum += g;
    }

    gl_FragColor = vec4(sampleCol / sum, 1.0);
}