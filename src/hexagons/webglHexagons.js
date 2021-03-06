import { mat4 } from 'gl-matrix';
import tinycolor from 'tinycolor2';

import Hexagon from '@/hexagons/hexagon';

import { initShaderProgram } from './webglHelper';
import hexagonVertShader from './hexagonVertShader.glsl';
import hexagonFragShader from './hexagonFragShader.glsl';

function drawWebGlHexagons(gl, hexagons, hexagonSize, borderColor) {
  if (gl === null) {
    throw new Error('Missing WebGl context!');
  }

  const extension = gl.getExtension('OES_standard_derivatives');
  if (!extension) {
    throw new Error('OES_standard_derivatives extension not found');
  }

  const shaderProgram = initShaderProgram(gl, hexagonVertShader, hexagonFragShader);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      edgeVertex: gl.getAttribLocation(shaderProgram, 'aEdgeVertex'),
    },
    uniformLocations: {
      borderColor: gl.getUniformLocation(shaderProgram, 'uBorderColor'),
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const buffers = initBuffers(gl, hexagons, hexagonSize);

  drawScene(gl, programInfo, buffers, borderColor);
}

function initBuffers(gl, hexagons, hexagonSize) {
  const hexagon = Hexagon.calculateHexagon(hexagonSize);
  const halfSize = hexagon.width / 2;
  const halfHeight = hexagon.height / 2;

  // Now create an array of positions for the square.
  const numberOfVertices = hexagons.length * 6 * 3;
  const positions = new Float32Array(numberOfVertices * 2);
  const colors = new Uint8Array(numberOfVertices * 3);
  const edgeVertices = new Uint8Array(numberOfVertices);

  let positionsIndex = 0;
  let colorsIndex = 0;
  let edgeVerticesIndex = 0;

  hexagons.forEach((hexagonData) => {
    const x = hexagonData.x;
    const y = hexagonData.y;

    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y;
    positions[positionsIndex++] = x;
    positions[positionsIndex++] = y + hexagon.triangleHeight;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + halfHeight;

    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + halfHeight;
    positions[positionsIndex++] = x;
    positions[positionsIndex++] = y + hexagon.triangleHeight;
    positions[positionsIndex++] = x;
    positions[positionsIndex++] = y + hexagon.triangleHeight + hexagon.sideLength;

    positions[positionsIndex++] = x;
    positions[positionsIndex++] = y + hexagon.triangleHeight + hexagon.sideLength;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + halfHeight;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + hexagon.height;

    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + hexagon.height;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + halfHeight;
    positions[positionsIndex++] = x + hexagon.width;
    positions[positionsIndex++] = y + hexagon.triangleHeight + hexagon.sideLength;

    positions[positionsIndex++] = x + hexagon.width;
    positions[positionsIndex++] = y + hexagon.triangleHeight + hexagon.sideLength;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + halfHeight;
    positions[positionsIndex++] = x + hexagon.width;
    positions[positionsIndex++] = y + hexagon.triangleHeight;

    positions[positionsIndex++] = x + hexagon.width;
    positions[positionsIndex++] = y + hexagon.triangleHeight;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y + halfHeight;
    positions[positionsIndex++] = x + halfSize;
    positions[positionsIndex++] = y;

    const color = hexagonData.color;
    for (let i = 0; i < 6 * 3; i++) {
      colors[colorsIndex++] = color.r;
      colors[colorsIndex++] = color.g;
      colors[colorsIndex++] = color.b;
    }

    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 0;

    edgeVertices[edgeVerticesIndex++] = 0;
    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 255;

    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 0;
    edgeVertices[edgeVerticesIndex++] = 255;

    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 0;
    edgeVertices[edgeVerticesIndex++] = 255;

    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 0;
    edgeVertices[edgeVerticesIndex++] = 255;

    edgeVertices[edgeVerticesIndex++] = 255;
    edgeVertices[edgeVerticesIndex++] = 0;
    edgeVertices[edgeVerticesIndex++] = 255;
  });

  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  const edgeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, edgeVertices, gl.STATIC_DRAW);

  return {
    verticesCount: numberOfVertices,
    position: positionBuffer,
    color: colorBuffer,
    edgeVertices: edgeBuffer,
  };
}

function drawScene(gl, programInfo, buffers, borderColor) {
  gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  // const fieldOfView = 45 * Math.PI / 180; // in radians
  // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = -100.0;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();


  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  // mat4.perspective(
  //   projectionMatrix,
  //   fieldOfView,
  //   aspect,
  //   zNear,
  //   zFar,
  // );

  mat4.ortho(
    projectionMatrix,
    0,
    gl.canvas.clientWidth,
    gl.canvas.clientHeight,
    0,
    zNear,
    zFar,
  );
  // mat4.ortho(
  //   projectionMatrix,
  //   -1.0,
  //   1.0,
  //   -1.0,
  //   1.0,
  //   near,
  //   far,
  // );

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  // mat4.translate(
  //   modelViewMatrix, // destination matrix
  //   modelViewMatrix, // matrix to translate
  //   [-0.0, 0.0, -0.0],
  // ); // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 3;
    const type = gl.UNSIGNED_BYTE;
    const normalize = true;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  {
    const numComponents = 1;
    const type = gl.UNSIGNED_BYTE;
    const normalize = true;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.edgeVertices);
    gl.vertexAttribPointer(
      programInfo.attribLocations.edgeVertex,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.edgeVertex);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  const borderParsed = tinycolor(borderColor);
  gl.uniform3f(
    programInfo.uniformLocations.borderColor,
    borderParsed._r / 255,
    borderParsed._g / 255,
    borderParsed._b / 255,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  {
    const offset = 0;
    const vertexCount = buffers.verticesCount;
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
  }
}

export default drawWebGlHexagons;
