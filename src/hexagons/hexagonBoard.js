
import Hammer from 'hammerjs';
import panzoom from 'pan-zoom';
import FileSaver from 'file-saver';
import _ from 'lodash';

import PatternHandler from '@/js/patternHandler';
import Background from './background';
import HexagonMatrix from './hexagonMatrix';
import Hexagon from './hexagon';
import drawColorsList from './colorList';

import drawWebGlHexagons from './webglHexagons';

const DEFAULT_SIZE = 32;
const DEFAULT_COLOR = '#ff0000';
const DEFAULT_BORDER_COLOR = '#cccccc';

function HexagonBoard(mainContainer, pattern) {
  this.debug = false;
  this.webglEnabled = false;

  this._hexagonMatrix = new HexagonMatrix();
  this._selectedHexagons = new HexagonMatrix();
  this._copiedHexagons = new HexagonMatrix();
  this._currentColor = DEFAULT_COLOR;
  this._borderColor = DEFAULT_BORDER_COLOR;

  this.viewport = {
    x: 0,
    y: 0,
    scale: 1,
  };

  this.getSize = function getSize() {
    return DEFAULT_SIZE * this.viewport.scale;
  };

  this._load(pattern);

  this._init(mainContainer);

  const that = this;

  function actualResizeHandler() {
    that.updateBoardSize();
    that.drawBoard();
  }

  window.addEventListener('resize', _.throttle(actualResizeHandler, 66), false);

  mouseHandler(this);
}

function handleZoom(that, xPosition, yPosition, zoom) {
  const newScale = that.viewport.scale * zoom;
  const oldScale = that.viewport.scale;
  const scaleChange = oldScale - newScale;

  if (newScale < 0.2 || newScale > 10) {
    return;
  }

  const mouseX = (xPosition + that.viewport.x) / oldScale;
  const mouseY = (yPosition + that.viewport.y) / oldScale;

  that.viewport.x -= (mouseX * scaleChange);
  that.viewport.y -= (mouseY * scaleChange);
  that.viewport.scale = newScale;

  if (that._copiedViewport) {
    that._copiedViewport.x -= ((xPosition + that._copiedViewport.x) / oldScale) * scaleChange;
    that._copiedViewport.y -= ((yPosition + that._copiedViewport.y) / oldScale) * scaleChange;
  }
}

function mouseHandler(that) {
  const hammertime = new Hammer(that.boardContainer);

  panzoom(that.boardContainer, (ev) => {
    that.viewport.x -= ev.dx;
    that.viewport.y -= ev.dy;

    if (ev.dz) {
      const zoomIntensity = 0.1;
      const wheel = ev.dz / 60;
      const zoom = 1 / Math.exp(wheel * zoomIntensity);

      handleZoom(that, ev.x, ev.y, zoom);
    }

    that.drawBoard();
  });

  hammertime.on('tap', (ev) => {
    onClickHandler(ev.center.x, ev.center.y);
  });

  hammertime.on('press', (ev) => {
    pressHandler(ev.center.x, ev.center.y);
  });

  function onClickHandler(x, y) {
    const hexagonIndex = that.findHexagonIndex(x, y);
    if (that.isSelecting()) {
      that.selectHexagon(hexagonIndex);
    } else if (that.isStamping()) {
      that.stampSelection();
    } else {
      that.markHexagon(hexagonIndex);
      requestAnimationFrame(() => {
        that.drawBoard();
      });
    }
  }

  function pressHandler(x, y) {
    if (that.isStamping()) {
      return;
    }

    const hexagonIndex = that.findHexagonIndex(x, y);
    that.selectHexagon(hexagonIndex);
  }
}

HexagonBoard.prototype._init = function _init(mainContainer) {
  while (mainContainer.hasChildNodes()) {
    mainContainer.removeChild(mainContainer.lastChild);
  }

  const boardContainer = document.createElement('div');
  boardContainer.id = 'board-container';
  this.boardContainer = boardContainer;
  mainContainer.appendChild(boardContainer);


  const canvasSize = {
    width: boardContainer.clientWidth,
    height: boardContainer.clientHeight,
  };

  const backgroundCanvas = document.createElement('canvas');
  backgroundCanvas.id = 'background-canvas';
  backgroundCanvas.width = canvasSize.width;
  backgroundCanvas.height = canvasSize.height;
  boardContainer.appendChild(backgroundCanvas);

  const canvas = document.createElement('canvas');
  canvas.id = 'main-canvas';
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  boardContainer.appendChild(canvas);

  const foregroundCanvas = document.createElement('canvas');
  foregroundCanvas.id = 'foreground-canvas';
  foregroundCanvas.width = canvasSize.width;
  foregroundCanvas.height = canvasSize.height;
  this.foregroundCanvas = foregroundCanvas;
  boardContainer.appendChild(foregroundCanvas);

  const copyStampCanvas = document.createElement('canvas');
  copyStampCanvas.id = 'copy-stamp-canvas';
  copyStampCanvas.width = canvasSize.width;
  copyStampCanvas.height = canvasSize.height;
  this.copyStampCanvas = copyStampCanvas;
  boardContainer.appendChild(copyStampCanvas);

  const webGlCanvas = document.createElement('canvas');
  webGlCanvas.id = 'webgl-canvas';
  webGlCanvas.width = canvasSize.width;
  webGlCanvas.height = canvasSize.height;
  this.webGlCanvas = webGlCanvas;
  if (this.webglEnabled) {
    boardContainer.appendChild(webGlCanvas);
  }

  // var overlayDiv = document.createElement('div');
  // overlayDiv.className = 'overlayDiv';
  // mainContainer.appendChild(overlayDiv);

  this.canvas = canvas;
  this.background = new Background(backgroundCanvas);
};

HexagonBoard.prototype.markHexagon = function markHexagon(hexagonIndex, color) {
  const hexagonMatrix = this._hexagonMatrix;
  const hexagonColor = color || this._currentColor;

  let hexagon = hexagonMatrix.find(hexagonIndex);
  if (hexagon === undefined) {
    console.log('create hexagon', hexagonIndex);

    hexagon = {
      x: hexagonIndex.x,
      y: hexagonIndex.y,
      color: hexagonColor,
    };
    hexagonMatrix.add(hexagon);
  } else if (hexagon.color === hexagonColor) {
    console.log('delete hexagon', hexagonIndex);
    hexagonMatrix.remove(hexagonIndex);
  } else {
    console.log('change hexagon color', hexagonIndex);
    hexagon.color = hexagonColor;
  }
};

HexagonBoard.prototype.selectHexagon = function selectHexagon(hexagonIndex) {
  const selectedHexagons = this._selectedHexagons;
  let hexagon = selectedHexagons.find(hexagonIndex);
  if (hexagon === undefined) {
    hexagon = {
      x: hexagonIndex.x,
      y: hexagonIndex.y,
    };
    selectedHexagons.add(hexagon);
  } else {
    selectedHexagons.remove(hexagon);
  }

  requestAnimationFrame(() => {
    this.drawBoard();
  });
};

HexagonBoard.prototype.isSelecting = function isSelecting() {
  return !this._selectedHexagons.isEmpty();
};

HexagonBoard.prototype.isStamping = function isStamping() {
  return !this._copiedHexagons.isEmpty();
};

HexagonBoard.prototype.stopSelection = function stopSelection() {
  this._selectedHexagons.clear();
  this._copiedHexagons.clear();

  requestAnimationFrame(() => {
    this.drawBoard();
  });
};

HexagonBoard.prototype.copySelection = function copySelection() {
  this._selectedHexagons.forEach((hexagonIndex) => {
    const coloredHexagon = this._hexagonMatrix.find(hexagonIndex);
    if (coloredHexagon) {
      this._copiedHexagons.add(coloredHexagon);
    }
  });

  this._selectedHexagons.clear();

  this._copiedViewport = {
    x: this.viewport.x,
    y: this.viewport.y,
  };

  requestAnimationFrame(() => {
    this.drawBoard();
  });
};

HexagonBoard.prototype.stampSelection = function stampSelection() {
  this._copiedHexagons.forEach((hexagon) => {
    const offsetIndex = this._pushHexagonPlacement(hexagon, this._copiedViewport);
    this.markHexagon(offsetIndex, hexagon.color);
  });

  requestAnimationFrame(() => {
    this._drawHexagons();
    this.copyStampCanvas.width = this.copyStampCanvas.width;
    setTimeout(() => {
      this._drawCopyStamp();
    }, 300);
  });
};

HexagonBoard.prototype.updateBoardSize = function updateBoardSize() {
  const newSize = {
    width: this.boardContainer.clientWidth - 4,
    height: this.boardContainer.clientHeight - 4,
  };
  this.background.setSize(newSize.width, newSize.height);

  this.canvas.width = newSize.width;
  this.canvas.height = newSize.height;

  this.foregroundCanvas.width = newSize.width;
  this.foregroundCanvas.height = newSize.height;
};

HexagonBoard.prototype._drawBackground = function _drawBackground() {
  this.background.draw(this.getSize(), this.viewport);
};

HexagonBoard.prototype.drawBoard = function drawBoard() {
  if (this._drawCallInQueue !== true) {
    this._drawCallInQueue = true;
    requestAnimationFrame(() => {
      this._drawCallInQueue = false;
      this._drawBackground();
      this._drawHexagons();
      this._drawSelections();
      this._drawCopyStamp();
      this._drawWebGlHexagons();
    });
  }
};

HexagonBoard.prototype._drawWebGlHexagons = function _drawWebGlHexagons() {
  if (!this.webglEnabled) {
    return;
  }
  const gl = this.webGlCanvas.getContext('webgl');
  drawWebGlHexagons(gl);
};

HexagonBoard.prototype._drawHexagons = function _drawHexagons() {
  this.canvas.width = this.canvas.width;
  const ctx = this.canvas.getContext('2d');

  this._hexagonMatrix.forEach((hexagon) => {
    const color = hexagon.color;

    const hexagonPosition = this._getHexagonPosition(hexagon);
    this._drawHexagon(ctx, hexagonPosition, color, this._borderColor);
  });
};

HexagonBoard.prototype._drawSelections = function _drawSelections() {
  if (this._selectedHexagons.isEmpty()) {
    if (this._selectionsBeingDrawn) {
      clearInterval(this._selectionsBeingDrawn);
      this._selectionsBeingDrawn = undefined;
      this.foregroundCanvas.width = this.foregroundCanvas.width;
    }
  } else if (!this._selectionsBeingDrawn) {
    const intervalMs = 100;
    this._selectionOpacity = 0.4;
    this._selectionOpacityChange = 0.1;
    this._selectionsBeingDrawn = setInterval(() => {
      if (this._selectionOpacity <= 0.2 || this._selectionOpacity >= 0.9) {
        this._selectionOpacityChange = -this._selectionOpacityChange;
      }
      this._selectionOpacity += this._selectionOpacityChange;

      this._drawSelectionsLoop(this._selectionOpacity);
    }, intervalMs);
  } else {
    this._drawSelectionsLoop(this._selectionOpacity);
  }
};

HexagonBoard.prototype._drawSelectionsLoop = function _drawSelectionsLoop(opacity) {
  this.foregroundCanvas.width = this.foregroundCanvas.width;
  const ctx = this.foregroundCanvas.getContext('2d');

  const color = `rgba(0, 0, 0, ${opacity})`;
  this._selectedHexagons.forEach((hexagon) => {
    const hexagonPosition = this._getHexagonPosition(hexagon);
    this._drawHexagon(ctx, hexagonPosition, color, this._borderColor);
  });
};

HexagonBoard.prototype._drawCopyStamp = function _drawCopyStamp() {
  if (!this._copiedHexagons.isEmpty()) {
    this.copyStampCanvas.width = this.copyStampCanvas.width;
    const ctx = this.copyStampCanvas.getContext('2d');
    const opacity = 0.5;

    const shadowColor = `rgba(0, 0, 0, ${opacity})`;

    this._copiedHexagons.forEach((hexagon) => {
      const offsetIndex = this._pushHexagonPlacement(hexagon, this._copiedViewport);
      const hexagonPosition = this._getHexagonPosition(offsetIndex);

      this._drawHexagon(ctx, hexagonPosition, hexagon.color, this._borderColor);
      this._drawHexagon(ctx, hexagonPosition, shadowColor, this._borderColor);
    });
  } else {
    this.copyStampCanvas.width = this.copyStampCanvas.width;
  }
};

HexagonBoard.prototype._drawHexagon =
function _drawHexagon(context, hexagonPosition, color, borderColor) {
  const size = this.getSize();

  const x = hexagonPosition.x;
  const y = hexagonPosition.y;

  Hexagon.drawHexagon(context, x, y, size, borderColor, color);
};

HexagonBoard.prototype._getHexagonPosition = function _getHexagonPosition(hexagonIndex) {
  const size = this.getSize();
  const hexagon = Hexagon.calculateHexagon(size);
  const halfSize = hexagon.width / 2;

  const xIndex = hexagonIndex.x;
  const yIndex = hexagonIndex.y;

  const xOffset = yIndex % 2 !== 0 ? Math.round(halfSize) : 0;
  const rowHeight = hexagon.height - hexagon.triangleHeight;

  const x = xIndex * hexagon.width + xOffset - this.viewport.x;
  const y = yIndex * rowHeight - this.viewport.y;

  return {
    x,
    y,
  };
};

HexagonBoard.prototype.findHexagonIndex = function findHexagonIndex(clientX, clientY) {
  const size = this.getSize();
  const hexagon = Hexagon.calculateHexagon(size);
  const halfSize = hexagon.width / 2;

  const x = clientX + this.viewport.x;
  const y = clientY + this.viewport.y;

  const rowHeight = hexagon.height - hexagon.triangleHeight;

  let rowIndex = Math.floor(y / rowHeight);

  const isOffsetRow = rowIndex % 2 !== 0;
  const xOffset = isOffsetRow ? Math.round(halfSize) : 0;

  let columnIndex = Math.floor((x - xOffset) / hexagon.width);

  const innerX = x - (columnIndex * hexagon.width + xOffset);
  const innerY = y - (rowIndex * rowHeight);

  const tangentForThirtyDeg = Math.tan(Math.PI / 6);

  if (innerY < hexagon.triangleHeight) {
    if (innerX < hexagon.width / 2) {
      if ((hexagon.triangleHeight - innerY) / innerX > tangentForThirtyDeg) {
        rowIndex--;
        if (!isOffsetRow) {
          columnIndex--;
        }
      }
    } else if ((hexagon.triangleHeight - innerY) / (hexagon.width - innerX) > tangentForThirtyDeg) {
      rowIndex--;
      if (isOffsetRow) {
        columnIndex++;
      }
    }
  }

  return {
    x: columnIndex,
    y: rowIndex,
  };
};

HexagonBoard.prototype._pushHexagonPlacement =
function _pushHexagonPlacement(hexagonIndex, offset) {
  const size = this.getSize();
  const hexagon = Hexagon.calculateHexagon(size);
  const halfSize = hexagon.width / 2;

  const xIndex = hexagonIndex.x;
  const yIndex = hexagonIndex.y;

  const xOffset = yIndex % 2 !== 0 ? Math.round(halfSize) : 0;
  const rowHeight = hexagon.height - hexagon.triangleHeight;

  const xOffsetIndex = Math.round((this.viewport.x - offset.x) / hexagon.width);
  const yOffsetIndex = Math.round((this.viewport.y - offset.y) / rowHeight);

  let xNewIndex = xIndex + xOffsetIndex;
  const yNewIndex = yIndex + yOffsetIndex;

  if (yNewIndex % 2 === 0 && xOffset !== 0) {
    xNewIndex += 1;
  }

  return {
    x: xNewIndex,
    y: yNewIndex,
  };
};

HexagonBoard.prototype.setCurrentColor = function setCurrentColor(newColor) {
  this._currentColor = newColor;
  requestAnimationFrame(() => {
    this.drawBoard();
  });
};

HexagonBoard.prototype.getCurrentColor = function getCurrentColor() {
  return this._currentColor;
};

HexagonBoard.prototype.getColorsList = function getColorsList() {
  const colors = {};

  this._hexagonMatrix.forEach((hexagon) => {
    if (hexagon.color === undefined) {
      return;
    }
    let color = colors[hexagon.color];
    if (color === undefined) {
      color = 0;
    }
    color++;
    colors[hexagon.color] = color;
  });

  let index = 0;
  const colorList = [];
  _.forIn(colors, (value, key) => {
    colorList.push({
      id: index,
      name: key,
      count: value,
    });
    index++;
  });

  colorList.sort((a, b) => b.count - a.count);

  return colorList;
};

HexagonBoard.prototype.savePattern = function savePattern() {
  const serializedPattern = this.serialize();

  return PatternHandler.savePattern(this._patternId, this.patternTitle, serializedPattern);
};

HexagonBoard.prototype.savePatternAs = function savePatternAs(patternTitle) {
  const serializedPattern = this.serialize();

  return PatternHandler.addPattern(patternTitle, serializedPattern);
};

HexagonBoard.prototype.importPattern = function importPattern(title, stringPattern) {
  return PatternHandler.addPattern(title, JSON.parse(stringPattern));
};

HexagonBoard.prototype.deletePattern = function deletePattern() {
  return PatternHandler.deletePattern(this._patternId);
};

HexagonBoard.prototype.exportPattern = function exportPattern() {
  const canvas = document.createElement('canvas');
  canvas.width = this.canvas.width;
  canvas.height = this.canvas.height;

  const context = canvas.getContext('2d');

  context.drawImage(this.canvas, 0, 0);

  const colorsList = this.getColorsList();
  drawColorsList(context, canvas.width, canvas.height, colorsList);

  let fileName = this.patternTitle;
  if (!fileName) {
    fileName = 'Pattern';
  }
  canvas.toBlob((blob) => {
    FileSaver.saveAs(blob, fileName);
  });
};

HexagonBoard.prototype._load = function _load(pattern) {
  if (!pattern) {
    throw new Error('Can not load board without pattern!');
  }

  this._patternId = pattern.id;
  this.patternTitle = pattern.title;

  const patternData = pattern.data;
  if (!patternData) {
    return;
  }

  const savedHexagonBoard = patternData.board;

  if (!savedHexagonBoard) {
    return;
  }

  if (savedHexagonBoard.size) {
    //        this._defaultSize = savedHexagonBoard.size;
  }

  if (savedHexagonBoard.currentColor) {
    this._currentColor = savedHexagonBoard.currentColor;
  }

  const hexagonMatrix = this._hexagonMatrix;
  if (Array.isArray(savedHexagonBoard.hexagons)) {
    savedHexagonBoard.hexagons.forEach((hexagon) => {
      if (hexagon.color !== undefined) {
        hexagonMatrix.add(hexagon);
      }
    });
  }
};

HexagonBoard.prototype.serialize = function serialize() {
  const board = this._serializeBoard();

  const patternData = {
    board,
  };
  return patternData;
};

HexagonBoard.prototype._serializeBoard = function _serializeBoard() {
  const hexagons = [];
  this._hexagonMatrix.forEach((hexagon) => {
    hexagons.push(hexagon);
  });

  const serializedBoard = {
    currentColor: this._currentColor,
    hexagons,
    size: this.getSize(),
  };

  return serializedBoard;
};

export default HexagonBoard;
