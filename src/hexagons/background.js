

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

  const ctx = this.canvas.getContext('2d');
  const borderColor = this._borderColor;

  const sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
  const triangleHeight = Math.sin(Math.PI / 6) * sideLength;

  const hexagonHeight = (2 * triangleHeight + sideLength);

  let xOffset = 0;

  const rowHeight = (hexagonHeight - triangleHeight);

  const boardWidth = Math.floor((this.canvas.width - hexagonSize / 2) / hexagonSize);
  const boardHeight = Math.floor((this.canvas.height - triangleHeight) / rowHeight);

  const cappedBoardOffset = {
    x: viewport.x % hexagonSize,
    y: viewport.y % (rowHeight * 2),
  };

  for (let i = -2; i < boardHeight + 3; i++) {
    if (i % 2 !== 0) {
      xOffset = hexagonSize / 2;
    } else {
      xOffset = 0;
    }

    for (let j = -1; j < boardWidth + 1; j++) {
      let x = j * hexagonSize + xOffset;
      let y = i * rowHeight;

      x -= cappedBoardOffset.x;
      y -= cappedBoardOffset.y;
      Hexagon.drawHexagon(ctx, x, y, hexagonSize, borderColor);
    }
  }
};

export default Background;
