precision mediump float;

attribute float vertexId;
attribute vec2 oldParticlePos;
attribute vec2 newParticlePos;
attribute vec3 particleColor;
attribute float livedFor;

uniform float time;

varying vec2 uv;
varying float _livedFor;
varying vec3 _particleColor;

vec2 mux(vec2 a, vec2 b, vec2 c, vec2 d, float selector) {
  return a * float(selector == 0.)
      + b * float(selector == 1.)
      + c * float(selector == 2.)
      + d * float(selector == 3.);
}

void main() {
  // gl_Position = vec4(aCoords * .0095 + aPos.xy * 2. - vec2(1., 1.), 0.0, 1.0);

  // -1, -1,
  // -1,  1,
  //  1, -1,
  //  1,  1,

  float w = 0.0025;

  vec2 diff = newParticlePos - oldParticlePos;
  vec2 tang = normalize(vec2(diff.y, -diff.x));

  vec2 newA = newParticlePos - tang * w;
  vec2 newB = newParticlePos + tang * w;
  vec2 oldA = oldParticlePos - tang * w;
  vec2 oldB = oldParticlePos + tang * w;

  vec2 pos = mux(oldA, newA, oldB, newB, vertexId);
  pos = pos * 2.0 - vec2(1.);
  gl_Position = vec4(pos, 0.0, 1.0);


  uv = mux(
      vec2(0, 0),
      vec2(0, 1),
      vec2(1, 0),
      vec2(1, 1),
      vertexId
  );

  _livedFor = livedFor;
  _particleColor = particleColor;
}