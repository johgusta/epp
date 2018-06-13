

import Hexagon from './hexagon';

function Background(canvas) {
  this.canvas = canvas;
  this._borderColor = '#cccccc';
}

Background.prototype.setSize = function setSize(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
};

Background.prototype.draw = function draw(hexagonSize, viewport) {
  this.canvas.width = this.canvas.width;

  drawBackgroundTiles(hexagonSize, viewport, this.canvas, this._borderColor);
};

function drawBackgroundTiles(hexagonSize, viewport, canvas, color) {
  const hexagon = Hexagon.calculateHexagon(hexagonSize);

  const hexagonPatternHeight = hexagon.height + hexagon.sideLength;

  const xOffset = -viewport.x % hexagon.width;
  const yOffset = -viewport.y % hexagonPatternHeight;

  const boardWidth = Math.ceil(canvas.width / hexagon.width);
  const boardHeight = Math.ceil(canvas.height / hexagonPatternHeight);

  const context = canvas.getContext('2d');
  context.strokeStyle = color;
  context.save();
  context.beginPath();
  for (let i = -1; i <= boardWidth; i++) {
    const x = xOffset + i * hexagon.width;
    for (let j = -1; j <= boardHeight; j++) {
      const y = yOffset + j * hexagonPatternHeight;
      Hexagon.traceTilePattern(context, x, y, hexagon);
    }
  }
  context.stroke();
  context.restore();
}

export default Background;
