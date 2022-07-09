precision mediump float;

uniform sampler2D texture;

varying vec2 TexCoords;

void main(void) {
    vec3 col = texture2D(texture, TexCoords).rgb;
    gl_FragColor = vec4(col, 1.0);
}