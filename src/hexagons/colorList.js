

import Hexagon from './hexagon';

const colorItemHeight = 30;
const hexagonSize = 12;
const itemWidth = 90;
const fontSize = 14;
const borderColor = 'rgba(0, 0, 0, 0.2)';

const padding = 6;

function drawColorsList(context, width, height, colorsList) {
  const colorsCanvas = createCanvasColorList(colorsList);
  context.drawImage(
    colorsCanvas,
    width - colorsCanvas.width, height - colorsCanvas.height,
  );
}

function createCanvasColorList(colorsList) {
  const canvas = document.createElement('canvas');
  draw(canvas, colorsList);
  return canvas;
}

function draw(colorsCanvas, colorList) {
  colorsCanvas.width = itemWidth;
  colorsCanvas.height = colorItemHeight * colorList.length + padding;
  const context = colorsCanvas.getContext('2d');

  if (colorList.length === 0) {
    colorsCanvas.style.display = 'none';
  } else {
    colorsCanvas.style.display = '';
  }

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
}

export default drawColorsList;
