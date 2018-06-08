

function drawHexagon(context, xParam, yParam, size, borderColor, color) {
  const hexagon = calculateHexagon(size);
  const halfSize = hexagon.width / 2;

  // Correct fuzzy lines when stroking by offseting half a pixel for odd line widths;
  const x = xParam;
  const y = yParam;

  context.save();

  context.beginPath();
  context.moveTo(x + halfSize, y);
  context.lineTo(x + hexagon.width, y + hexagon.triangleHeight);
  context.lineTo(x + hexagon.width, y + hexagon.triangleHeight + hexagon.sideLength);
  context.lineTo(x + halfSize, y + hexagon.triangleHeight * 2 + hexagon.sideLength);
  context.lineTo(x, y + hexagon.triangleHeight + hexagon.sideLength);
  context.lineTo(x, y + hexagon.triangleHeight);
  context.lineTo(x + halfSize, y);

  if (color !== undefined) {
    context.fillStyle = color;
    context.fill();
  }

  context.strokeStyle = borderColor;
  context.stroke();

  context.restore();
}

function drawTile(size, borderColor) {
  const hexagon = calculateHexagon(size);
  const halfSize = hexagon.width / 2;

  const x = 0;
  const y = 0;

  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = hexagon.width;
  patternCanvas.height = hexagon.height + hexagon.sideLength;

  const patternContext = patternCanvas.getContext('2d');
  patternContext.save();

  patternContext.strokeStyle = borderColor;

  patternContext.beginPath();
  patternContext.moveTo(x + hexagon.width, y + hexagon.triangleHeight);
  patternContext.lineTo(x + halfSize, y);
  patternContext.lineTo(x, y + hexagon.triangleHeight);
  patternContext.lineTo(x, y + hexagon.triangleHeight + hexagon.sideLength);
  patternContext.lineTo(x + halfSize, y + hexagon.height);
  patternContext.lineTo(x + hexagon.width, y + hexagon.triangleHeight + hexagon.sideLength);
  patternContext.stroke();

  patternContext.moveTo(x + halfSize, y + hexagon.height);
  patternContext.lineTo(x + halfSize, y + hexagon.height + hexagon.sideLength);
  patternContext.stroke();

  patternContext.restore();

  return patternCanvas;
}

function calculateHexagon(size) {
  const hexagonSize = Math.floor(size);
  const halfSize = hexagonSize / 2;
  const topHeight = Math.floor(Math.tan(Math.PI / 6) * halfSize);
  const sideLength = Math.floor((halfSize) / Math.cos(Math.PI / 6));
  const hexagonHeight = topHeight * 2 + sideLength;

  return {
    width: hexagonSize,
    height: hexagonHeight,
    triangleHeight: topHeight,
    sideLength,
  };
}

const Hexagon = {
  drawHexagon,
  drawTile,
  calculateHexagon,
};
export default Hexagon;
