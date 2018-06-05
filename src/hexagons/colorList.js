

import Hexagon from './hexagon';

const colorItemHeight = 30;
const hexagonSize = 12;
const itemWidth = 90;
const fontSize = 14;
const borderColor = 'rgba(0, 0, 0, 0.2)';

const padding = 6;

function ColorList(canvas) {
  this.canvas = canvas;
  this._colorList = [];

  this.canvas.addEventListener('click', this._handleClick.bind(this));
}

ColorList.prototype.draw = function draw(colorList, changeColorCallback) {
  this._colorList = colorList;
  this._changeColorCallback = changeColorCallback;

  const colorsCanvas = this.canvas;
  colorsCanvas.width = itemWidth;
  colorsCanvas.height = colorItemHeight * colorList.length + padding;
  const context = colorsCanvas.getContext('2d');

  context.font = `${fontSize}px sans-serif`;

  colorList.forEach((color, index) => {
    const x = 0;
    const y = colorItemHeight * index;

    context.save();
    context.translate(x, y);

    context.save();
    context.translate(0.5, 0.5);
    context.beginPath();
    context.rect(padding, padding, itemWidth - padding * 2, colorItemHeight - padding);

    context.fillStyle = '#fdfdfd';
    context.fill();

    context.strokeStyle = '#c2c2c2';
    context.stroke();
    context.restore();

    Hexagon.drawHexagon(context, padding + 6, padding + 4, hexagonSize, borderColor, color.name);

    context.fillText(` x ${color.count}`, hexagonSize + padding + 8, fontSize + padding + 2);

    context.restore();
  });
};

ColorList.prototype._handleClick = function _handleClick(event) {
  const x = event.offsetX;
  const y = event.offsetY;


  const colorIndex = findColorIndex(x, y);
  if (colorIndex === undefined) {
    return;
  }

  const color = this._colorList[colorIndex];
  this._changeColorCallback(color.name);
};

function findColorIndex(x, y) {
  if (x <= padding || x >= itemWidth - padding) {
    return undefined;
  }

  const modY = y % colorItemHeight;
  if (modY <= padding) {
    return undefined;
  }
  const colorIndex = Math.floor(y / colorItemHeight);
  return colorIndex;
}

export default ColorList;
