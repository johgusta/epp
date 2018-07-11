#extension GL_OES_standard_derivatives : enable

uniform lowp vec3 uBorderColor;

precision highp float;

varying lowp vec3 vColor;
varying float edgeVertex;

float aastep(float threshold, float value) {
  float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
  return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

void main() {
  // vec3 borderColor = vec3(0.0, 0.0, 1.0);
  vec3 color = mix(vColor, uBorderColor, aastep(0.995, edgeVertex));
  gl_FragColor = vec4(color, 1.0);
}
