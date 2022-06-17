precision mediump float;

uniform vec2 resolution;
uniform float frame;

ivec2 char_a = ivec2(0x3f333300, 0xc1e3333);
ivec2 char_b = ivec2(0x66663f00, 0x3f66663e);
ivec2 char_c = ivec2(0x3663c00, 0x3c660303);
ivec2 char_d = ivec2(0x66361f00, 0x1f366666);
ivec2 char_e = ivec2(0x16467f00, 0x7f46161e);
ivec2 char_f = ivec2(0x16060f00, 0x7f46161e);
ivec2 char_g = ivec2(0x73667c00, 0x3c660303);
ivec2 char_h = ivec2(0x33333300, 0x3333333f);
ivec2 char_i = ivec2(0xc0c1e00, 0x1e0c0c0c);
ivec2 char_j = ivec2(0x33331e00, 0x78303030);
ivec2 char_k = ivec2(0x36666700, 0x6766361e);
ivec2 char_l = ivec2(0x46667f00, 0xf060606);
ivec2 char_m = ivec2(0x6b636300, 0x63777f7f);
ivec2 char_n = ivec2(0x73636300, 0x63676f7b);
ivec2 char_o = ivec2(0x63361c00, 0x1c366363);
ivec2 char_p = ivec2(0x6060f00, 0x3f66663e);
ivec2 char_q = ivec2(0x3b1e3800, 0x1e333333);
ivec2 char_r = ivec2(0x36666700, 0x3f66663e);
ivec2 char_s = ivec2(0x38331e00, 0x1e33070e);
ivec2 char_t = ivec2(0xc0c1e00, 0x3f2d0c0c);
ivec2 char_u = ivec2(0x33333f00, 0x33333333);
ivec2 char_v = ivec2(0x331e0c00, 0x33333333);
ivec2 char_w = ivec2(0x7f776300, 0x6363636b);
ivec2 char_x = ivec2(0x1c366300, 0x6363361c);
ivec2 char_y = ivec2(0xc0c1e00, 0x3333331e);
ivec2 char_z = ivec2(0x4c667f00, 0x7f633118);
ivec2 char_per = ivec2(0xc0c00, 0x0);
ivec2 char_esc = ivec2(0x18001800, 0x183c3c18);
ivec2 char_space = ivec2(0, 0);

bool bit(int byte, int x) {
    int shifted = byte / int(pow(2.0, float(x)));
    return (shifted - 2 * (shifted / 2)) == 1;
}

bool char(ivec2 ch, int x, int y) {
    int sampleY = int(mod(float(y), 4.0));
    return bit(y >= 4 ? ch.y : ch.x, sampleY * 8 + x);
}

ivec2 string(int i) {
    if (i == 0)  return char_n;
    if (i == 1)  return char_e;
    if (i == 2)  return char_e;
    if (i == 3)  return char_e;
    if (i == 4)  return char_e;
    if (i == 5)  return char_e;
    if (i == 6)  return char_e;
    if (i == 7)  return char_e;
    if (i == 8)  return char_l;
    if (i == 9)  return char_l;
    if (i == 10) return char_l;
    if (i == 11) return char_space;
}

vec3 textBuffer(vec2 fragCoord) {
    float size = 15.0;
    
    ivec2 coord = ivec2(int(fragCoord.x), int(fragCoord.y));
    int y = (int(resolution.y) - coord.y) / int(size);
    int x = int(mod(float(coord.x / int(size)) + (frame / 60.0) * mod(float(y), 2.0) * 2.0, 12.0));
    int charPixelX = int(mod(float(coord.x), size) / (size / 8.0));
    int charPixelY = int(mod(float(coord.y), size) / (size / 8.0));
   
    bool isFilled = char(string(x), charPixelX, charPixelY);
    vec3 col = isFilled ? vec3(1.0) : vec3(0.0); // black if filled, white otherwise
    return col;
}

void main() {
    vec2 sampleCoord = gl_FragCoord.xy;
    
    sampleCoord.x /= mix(0.9, 2.0, (sin(sampleCoord.x / 300.0 + (frame / 60.0) / 2.0) + 1.0) / 2.0);
    sampleCoord.y /= mix(0.9, 2.0, (sin(sampleCoord.y / 300.0 + (frame / 60.0) / 2.0) + 1.0) / 2.0);

    vec3 col = textBuffer(sampleCoord);

    vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 rainbow = 0.5+0.5*vec4(cos((frame / 60.0)+uv.xyx+vec3(0, 2, 4)),1.0);

    gl_FragColor = vec4(col * rainbow.xyz, 1.0);
}