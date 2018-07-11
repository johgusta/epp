precision highp float;

attribute vec2 aVertexPosition;
attribute vec3 aVertexColor;
attribute float aEdgeVertex;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec3 vColor;
varying float edgeVertex;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 0.0, 1.0);
  vColor = aVertexColor;
  edgeVertex = aEdgeVertex;
}
