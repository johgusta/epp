

function drawHexagon(context, xParam, yParam, size, borderColor, color) {
  const topHeight = Math.tan(Math.PI / 6) * size / 2;
  const hypotenuse = (size / 2) / Math.cos(Math.PI / 6);

  // Correct fuzzy lines when stroking by offseting half a pixel for odd line widths;
  const x = xParam + 0.5;
  const y = yParam + 0.5;

  context.save();

  context.beginPath();
  context.moveTo(x + size / 2, y);
  context.lineTo(x + size, y + topHeight);
  context.lineTo(x + size, y + topHeight + hypotenuse);
  context.lineTo(x + size / 2, y + topHeight * 2 + hypotenuse);
  context.lineTo(x, y + topHeight + hypotenuse);
  context.lineTo(x, y + topHeight);
  context.lineTo(x + size / 2, y);

  if (color !== undefined) {
    context.fillStyle = color;
    context.fill();
  }

  context.strokeStyle = borderColor;
  context.stroke();

  context.restore();
}

const Hexagon = {
  drawHexagon,
};
export default Hexagon;
