
import Hammer from 'hammerjs';
import FileSaver from 'file-saver';
import _ from 'lodash';

import PatternHandler from '@/js/patternHandler';
import Background from './background';
import HexagonMatrix from './hexagonMatrix';
import Hexagon from './hexagon';

const DEFAULT_SIZE = 32;
const DEFAULT_COLOR = '#ff0000';
const DEFAULT_BORDER_COLOR = '#cccccc';

function HexagonBoard(mainContainer, pattern) {
  this.debug = false;

  const hexagonMatrix = new HexagonMatrix();
  this._hexagonMatrix = hexagonMatrix;
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
    that.draw();
  }

  window.addEventListener('resize', _.throttle(actualResizeHandler, 66), false);

  scrollHandlers(this);
  mouseHandler(this);
}

function scrollHandlers(that) {
  function wheelHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    const zoomIntensity = 0.1;
    const wheel = event.wheelDelta / 120;
    const zoom = Math.exp(wheel * zoomIntensity);

    handleZoom(that, event.clientX, event.clientY, zoom);
  }

  window.document.addEventListener('wheel', wheelHandler);
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

  that._clearFocus();
  that.drawBoard();
}

function mouseHandler(that) {
  let isPinching = false;

  const hammertime = new Hammer(that.boardContainer);

  hammertime.get('pinch').set({ enable: true });
  hammertime.on('pinchstart', () => {
    that.overlay.appendDebugText('first pinch');
    isPinching = true;
  });
  hammertime.on('pinch', (ev) => {
    let zoom = ev.scale;
    if (zoom < 1) {
      zoom = 1 - (1 - zoom) / 10;
    }
    if (zoom > 1) {
      zoom = 1 - (1 - zoom) / 50;
    }

    handleZoom(that, ev.center.x, ev.center.y, zoom);
  });

  that.boardContainer.addEventListener('mousedown', mouseDownHandler);
  that.boardContainer.addEventListener('mousemove', mouseMoveHandler);
  that.boardContainer.addEventListener('mouseup', mouseUpHandler);
  that.boardContainer.addEventListener('mouseleave', mouseLeaveHandler);

  that.boardContainer.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    if (touch) {
      mouseDownHandler(touch);
    }
  });
  that.boardContainer.addEventListener('touchmove', (event) => {
    const touch = event.changedTouches[0];
    if (touch) {
      mouseMoveHandler(touch);
    }
  });

  that.boardContainer.addEventListener('touchend', (event) => {
    if (isPinching && event.touches.length === 0) {
      isPinching = false;
      that.overlay.appendDebugText('pinching finished');
    }
  });

  that.boardContainer.addEventListener('touchcancel', (event) => {
    if (isPinching && event.touches.length === 0) {
      isPinching = false;
      that.overlay.appendDebugText('pinching canceled');
    }
  });

  const panThreshold = 10;

  let isMouseDown = false;
  let mouseStartPosition;

  let hasPerformedPanning = false;

  function mouseDownHandler(event) {
    if (isPinching) {
      return;
    }
    isMouseDown = true;
    mouseStartPosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function focusHandler(event) {
    const hexagonIndex = that.findHexagonIndex(event.clientX, event.clientY);

    if (that.overlay.colorPickerOpen || hasPerformedPanning) {
      requestAnimationFrame(() => {
        that._clearFocus();
      });
      return;
    }

    const borderColor = '#000000';

    const context = that.foregroundCanvas.getContext('2d');

    const hexagonPosition = that._getHexagonPosition(hexagonIndex);
    requestAnimationFrame(() => {
      that._clearFocus();
      that._drawHexagon(context, hexagonPosition, that._currentColor, borderColor);
    });
  }

  function mouseMoveHandler(event) {
    if (!isPinching && (!mouseStartPosition || !isMouseDown)) {
      focusHandler(event);
    } else {
      handlePanningMovement(event);
    }
  }

  function handlePanningMovement(event) {
    const currentPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    if (Math.abs(mouseStartPosition.x - currentPosition.x) > panThreshold ||
                Math.abs(mouseStartPosition.y - currentPosition.y) > panThreshold) {
      hasPerformedPanning = true;

      const xDiff = currentPosition.x - mouseStartPosition.x;
      const yDiff = currentPosition.y - mouseStartPosition.y;

      that.viewport.x -= xDiff;
      that.viewport.y -= yDiff;

      mouseStartPosition = {
        x: currentPosition.x,
        y: currentPosition.y,
      };
      that.overlay.appendDebugText('perform panning');

      that._clearFocus();
      that.drawBoard();
    }
  }

  function endPanning() {
    isMouseDown = false;
    mouseStartPosition = undefined;
    hasPerformedPanning = false;
  }

  function onClickHandler(event) {
    const hexagonIndex = that.findHexagonIndex(event.clientX, event.clientY);

    if (that.overlay.colorPickerOpen) {
      return;
    }

    const hexagonMatrix = that._hexagonMatrix;
    let hexagon = hexagonMatrix.find(hexagonIndex);
    if (hexagon === undefined) {
      console.log('create hexagon', hexagonIndex);

      hexagon = {
        x: hexagonIndex.x,
        y: hexagonIndex.y,
        color: that._currentColor,
      };
      hexagonMatrix.add(hexagon);
    } else if (hexagon.color === that._currentColor) {
      console.log('delete hexagon', hexagonIndex);
      hexagonMatrix.remove(hexagonIndex);
    } else {
      console.log('change hexagon color', hexagonIndex);
      hexagon.color = that._currentColor;
    }
    requestAnimationFrame(() => {
      that._clearFocus();
      that.draw();
    });
  }

  function mouseUpHandler(event) {
    if (isMouseDown && !hasPerformedPanning) {
      onClickHandler(event);
    }

    endPanning();
    that.overlay.colorPickerOpen = false;
  }

  function mouseLeaveHandler() {
    endPanning();
    requestAnimationFrame(() => {
      that._clearFocus();
    });
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

  // var overlayDiv = document.createElement('div');
  // overlayDiv.className = 'overlayDiv';
  // mainContainer.appendChild(overlayDiv);

  this.canvas = canvas;
  this.background = new Background(backgroundCanvas);
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

HexagonBoard.prototype.draw = function draw() {
  this.drawBoard();
  this._drawOverlay();
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
    });
  }
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

HexagonBoard.prototype._drawOverlay = function _drawOverlay() {
  const changeColorCallback = function changeColorCallback(newCurrentColor) {
    this._currentColor = newCurrentColor;
    this.drawBoard();
    this._drawOverlay();
  }.bind(this);

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

  const colorList = [];
  _.forIn(colors, (value, key) => {
    colorList.push({
      name: key,
      count: value,
    });
  });

  colorList.sort((a, b) => b.count - a.count);

  this.overlay.redrawColorList(colorList, this._currentColor, changeColorCallback);
};

HexagonBoard.prototype._clearFocus = function _clearFocus() {
  this.foregroundCanvas.width = this.foregroundCanvas.width;
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

  const colorsCanvas = this.overlay.colorList.canvas;
  context.drawImage(
    colorsCanvas,
    canvas.width - colorsCanvas.width, canvas.height - colorsCanvas.height,
  );

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
