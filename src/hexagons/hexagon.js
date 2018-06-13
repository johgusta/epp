
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

function traceTilePattern(context, x, y, hexagon) {
  const halfSize = hexagon.width / 2;

  context.moveTo(x + hexagon.width, y + hexagon.triangleHeight);
  context.lineTo(x + halfSize, y);
  context.lineTo(x, y + hexagon.triangleHeight);
  context.lineTo(x, y + hexagon.triangleHeight + hexagon.sideLength);
  context.lineTo(x + halfSize, y + hexagon.height);
  context.lineTo(x + hexagon.width, y + hexagon.triangleHeight + hexagon.sideLength);

  context.moveTo(x + halfSize, y + hexagon.height);
  context.lineTo(x + halfSize, y + hexagon.height + hexagon.sideLength);
}

function calculateHexagon(hexagonSize) {
  const hexagonWidth = hexagonSize;
  const halfSize = hexagonWidth / 2;
  const topHeight = Math.tan(Math.PI / 6) * halfSize;
  const sideLength = (halfSize) / Math.cos(Math.PI / 6);
  const hexagonHeight = topHeight * 2 + sideLength;

  return {
    width: hexagonWidth,
    height: hexagonHeight,
    triangleHeight: topHeight,
    sideLength,
  };
}

const Hexagon = {
  drawHexagon,
  traceTilePattern,
  calculateHexagon,
};
export default Hexagon;
