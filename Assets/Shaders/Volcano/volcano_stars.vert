precision mediump float;

attribute float vertexId;
attribute vec2 oldParticlePos;
attribute vec2 newParticlePos;
attribute vec3 particleColor;
attribute float percentLifeLived;

uniform float time;
uniform vec2 resolution;

varying vec2 uv;
varying float _percentLifeLived;
varying vec3 _particleColor;

vec2 mux(vec2 a, vec2 b, vec2 c, vec2 d, float selector) {
  return a * float(selector == 0.)
      + b * float(selector == 1.)
      + c * float(selector == 2.)
      + d * float(selector == 3.);
}

void main() {
  // -1, -1,
  // -1,  1,
  //  1, -1,
  //  1,  1,

  float w = 0.0025;

  vec2 diff = normalize(newParticlePos - oldParticlePos);
  vec2 tang = vec2(diff.y, -diff.x) * w;
  tang *= max(1.5 / min(resolution.x, resolution.y), length(tang)) / length(tang);

  vec2 newA = newParticlePos - tang;
  vec2 newB = newParticlePos + tang;
  vec2 oldA = oldParticlePos - tang;
  vec2 oldB = oldParticlePos + tang;

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

  _percentLifeLived = percentLifeLived;
  _particleColor = particleColor;
}