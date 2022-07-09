precision mediump float;

uniform sampler2D stars;
uniform vec2 resolution;

uniform float time;

void main(void) {
    // adapt to ShaderToy
    float iTime = time * 5.;


    vec2 uv = gl_FragCoord.xy/resolution.y;
    uv.x += 0.5-.5*resolution.x/resolution.y;

    vec3 col = vec3(0.);
    
    vec2 sunPos = vec2(0.5, 0.4 - 0.45 * iTime/5.);
    
    vec3 skyCol = mix(
        mix(vec3(0.313725, 0.768627, 1.), vec3(0.109803, 0., 0.239215), 1. - 1./(1. + pow(iTime/4., 3.))),
        mix(vec3(0., 0.556862, 0.839215), vec3(0.109803, 0., 0.239215), 1. - 1./(1. + pow(iTime/3.5, 3.))),
        pow(uv.y, .5)
    );
    // skyCol += .5 * vec3(1., 0.349019, 0.) * (1. - uv.y) * max(0.,1.0 - sunPos.y - uv.y) * 1./(1. + pow(iTime/3.5,3.));

    // horizon
    skyCol = mix(skyCol, .7 * vec3(1., 0.349019, 0.) * (1. - uv.y), min(1.0, 1.0 - sunPos.y));

    // darken to purple
    skyCol = mix(skyCol, vec3(0.109803, 0., 0.239215), 1. - 1./(1. + pow(iTime/5., 3.)));

    
    col += skyCol;

    
    
    /*
    float sun = 1.0 - distance(uv,iMouse.xy / iResolution.y);
    sun = clamp(sun,0.0,1.0);
    
    float glow = sun;
    glow = clamp(glow,0.0,1.0);
    
    sun = pow(sun,100.0);
    sun *= 100.0;
    sun = clamp(sun,0.0,1.0);
    
    glow = pow(glow,6.0) * 1.0;
    glow = pow(glow,(uv.y));
    glow = clamp(glow,0.0,1.0);
    
    sun *= pow(dot(uv.y, uv.y), 1.0 / 1.65);
    
    glow *= pow(dot(uv.y, uv.y), 1.0 / 2.0);
    
    sun += glow;
    
    vec3 sunColor = vec3(1.0,0.6,0.05) * sun;
    
    return vec3(sunColor);
    */
    
    
    
    
    
    
    float dist = distance(uv, sunPos);
    // float s = 1.-smoothstep(0.11, 0.13, dist);
    float glow = .1/dist;
    col += vec3(1., 1., 0.250980) * min(1., glow);


/*    col = mix(
        col, 
        vec3(1., 0.349019, 0.), 
        1.-uv.y
    );
  */  
    
    // fade to black
    col = mix(col, vec3(0.050980, 0.058823, 0.117647), smoothstep(0., 10., iTime));

    vec2 sampleUv = gl_FragCoord.xy/resolution.xy;

    vec3 starCol = texture2D(stars, sampleUv).rgb;
    col = mix(col, starCol, (1.0 - length(col)) * smoothstep(0., 10., iTime));


    //col = mix(col, vec3(1., 0.349019, 0.), clamp(0., 1., 1. - abs(uv.y - sunPos.y)));


    gl_FragColor = vec4(col, 1.0);
}