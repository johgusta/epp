"use strict";

var Color = require('color');
var Hamster = require('hamsterjs');

var Background = require('./background.js');
var HexagonMatrix = require('./hexagonMatrix.js');
var Overlay = require('./overlay.js');
var PatternHandler = require('./patternHandler.js');

var DEFAULT_SIZE = 24;
var DEFAULT_COLOR = '#ff0000';
var DEFAULT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';

function HexagonBoard(mainContainer) {

    this._init(mainContainer);

    this.size = DEFAULT_SIZE;

    var hexagonMatrix = new HexagonMatrix();
    this._hexagonMatrix = hexagonMatrix;
    this._currentColor = DEFAULT_COLOR;
    this._borderColor = DEFAULT_BORDER_COLOR;
    this._currentPatternName = '';

    this._boardOffset = {
        x: 0,
        y: 0,
        zoom: 0
    };

    this.load();

    var that = this;

    function actualResizeHandler() {
        that.updateBoardSize();
        that.draw();
    }

    window.addEventListener("resize", _.throttle(actualResizeHandler, 66), false);

    function mouseMoveHandler(event) {
        var hexagonIndex = that.findHexagonIndex(event.clientX, event.clientY);

        if (!that.isHexagonVisible(hexagonIndex)) {
            that._clearFocus();
            return;
        }

        var currentColor = new Color(that._currentColor);
        var rgbObject = currentColor.object();
        var focusColor = 'rgba(' + rgbObject.r + ',' + rgbObject.g + ',' + rgbObject.b + ',0.6)';
        var borderColor = '#000000';

        var context = that.foregroundCanvas.getContext('2d');

        var hexagonPosition = that._getHexagonPosition(hexagonIndex);
        that._clearFocus();
        that._drawHexagon(context, hexagonPosition, focusColor, borderColor);
    }

    this.boardContainer.addEventListener('mousemove', _.throttle(mouseMoveHandler, 20));

    function onClickHandler(event) {
        //TODO: Remove fix for changing color when color picker closes by clickig outside of it
        setTimeout(function () {
            var hexagonIndex = that.findHexagonIndex(event.clientX, event.clientY);

            if (!that.isHexagonVisible(hexagonIndex)) {
                return;
            }

            var hexagon = hexagonMatrix.find(hexagonIndex);
            if (hexagon === undefined) {
                console.log('create hexagon', hexagonIndex);

                hexagon = {
                    x: hexagonIndex.x,
                    y: hexagonIndex.y,
                    color: that._currentColor
                };
                hexagonMatrix.add(hexagon);
            } else if (hexagon.color === that._currentColor) {
                console.log('delete hexagon', hexagonIndex);
                hexagonMatrix.remove(hexagonIndex);
            } else {
                console.log('change hexagon color', hexagonIndex);
                hexagon.color = that._currentColor;
            }
            that._clearFocus();
            that.draw();
            requestAnimationFrame(function () {
                that.store();
            });
        }, 0);
    }

    this.boardContainer.addEventListener('click', onClickHandler);

    var throttledRedraw = _.throttle(function (oldSize, newSize) {
        if (oldSize === newSize) {
            return;
        }

        that._drawBoard();
        that._clearFocus();
    }, 40);

    function scrollHandler(event, delta) {
        event.preventDefault();
        event.stopPropagation();

        var newZoom = that._boardOffset.zoom - delta;

        var startWidth = that.canvas.width;
        var startHeight = that.canvas.height;
        var startSize = that.size;

        var ratio = startWidth / startHeight;
        var width = startWidth + newZoom;
        var height = Math.round(startWidth / ratio);

        var sizeDifference = startWidth / width;

        var size = Math.round(DEFAULT_SIZE * sizeDifference);

        if (size < 10) {
            size = 10;
        } else if (size > 100) {
            size = 100;
        } else {
            that._boardOffset.zoom = newZoom;
        }

        that.size = size;

        that._boardSize = calculateBoardSize(that.canvas.width, that.canvas.height, that.size);

        throttledRedraw(startSize, size);
    }
    Hamster(window.document).wheel(scrollHandler);
}

HexagonBoard.prototype._init = function _init(mainContainer) {
    var boardContainer = document.createElement('div');
    boardContainer.id = 'board-container';
    this.boardContainer = boardContainer;
    mainContainer.appendChild(boardContainer);


    var canvasSize = {
        width: boardContainer.clientWidth,
        height: boardContainer.clientHeight
    };

    var backgroundCanvas = document.createElement('canvas');
    backgroundCanvas.id = 'background-canvas';
    backgroundCanvas.width = canvasSize.width;
    backgroundCanvas.height = canvasSize.height;
    boardContainer.appendChild(backgroundCanvas);

    var canvas = document.createElement('canvas');
    canvas.id = 'main-canvas';
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    boardContainer.appendChild(canvas);

    var foregroundCanvas = document.createElement('canvas');
    foregroundCanvas.id = 'foreground-canvas';
    foregroundCanvas.width = canvasSize.width;
    foregroundCanvas.height = canvasSize.height;
    this.foregroundCanvas = foregroundCanvas;
    boardContainer.appendChild(foregroundCanvas);

    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlayDiv';
    mainContainer.appendChild(overlayDiv);

    this.canvas = canvas;
    this.background = new Background(backgroundCanvas);

    this.patternHandler = new PatternHandler();
    this.overlay = new Overlay(overlayDiv, this);
};

HexagonBoard.prototype.updateBoardSize = function updateBoardSize() {

    var newSize = {
        width: this.boardContainer.clientWidth - 4,
        height:this.boardContainer.clientHeight - 4
    };
    this.background.setSize(newSize.width, newSize.height);

    this.canvas.width = newSize.width;
    this.canvas.height = newSize.height;

    this.foregroundCanvas.width = newSize.width;
    this.foregroundCanvas.height = newSize.height;
};

HexagonBoard.prototype.draw = function draw() {

    this._boardSize = calculateBoardSize(this.canvas.width, this.canvas.height, this.size);
    this._drawBoard();
    this._drawOverlay();
    this._drawLoadInfo();
};

HexagonBoard.prototype._drawBackground = function _drawBackground() {
    this.background.draw(this._boardSize, this.size, this.getBoardIndexOffset());
};

HexagonBoard.prototype._drawBoard = function _drawBoard() {
    this._drawBackground();
    this._drawHexagons();
};

HexagonBoard.prototype._drawHexagons = function _drawHexagons() {
    this.canvas.width = this.canvas.width;
    var ctx = this.canvas.getContext('2d');

    this._hexagonMatrix.forEach(function (hexagon) {
        var color = hexagon.color;

        var hexagonPosition = this._getHexagonPosition(hexagon);
        this._drawHexagon(ctx, hexagonPosition, color, this._borderColor);
    }.bind(this));
};

HexagonBoard.prototype._drawHexagon = function _drawHexagon(context, hexagonPosition, color, borderColor) {
    var size = this.size;

    var x = hexagonPosition.x;
    var y = hexagonPosition.y;

    var topHeight = Math.tan(Math.PI / 6) * size / 2;
    var hypotenuse = (size / 2) / Math.cos(Math.PI / 6);

    context.beginPath();
    context.moveTo(x + size / 2, y);
    context.lineTo(x + size, y + topHeight);
    context.lineTo(x + size, y + topHeight + hypotenuse);
    context.lineTo(x + size / 2, y + topHeight * 2 + hypotenuse);
    context.lineTo(x, y + topHeight + hypotenuse);
    context.lineTo(x, y + topHeight);
    context.lineTo(x + size / 2, y);

    context.fillStyle = color;
    context.fill();

    context.strokeStyle = borderColor;
    context.stroke();
};

HexagonBoard.prototype.isHexagonVisible = function isHexagonVisible(hexagonIndex) {
    var boardOffset = this.getBoardIndexOffset();

    var isVisible = true;
    if (hexagonIndex.x < -boardOffset.x) {
        isVisible = false;
    } else if (hexagonIndex.x >= this._boardSize.width - boardOffset.x) {
        isVisible = false;
    } else if (hexagonIndex.y < -boardOffset.y) {
        isVisible = false;
    } else if (hexagonIndex.y >= this._boardSize.height - boardOffset.y) {
        isVisible = false;
    }

    return isVisible;
};

HexagonBoard.prototype._getHexagonPosition = function _getHexagonPosition(hexagonIndex) {
    var boardIndexOffset = this.getBoardIndexOffset();
    var xIndex = hexagonIndex.x + boardIndexOffset.x;
    var yIndex = hexagonIndex.y + boardIndexOffset.y;

    var size = this.size;

    var sideLength = (size / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;
    var hexagonHeight = (2 * triangleHeight + sideLength);

    var shouldBeEven = boardIndexOffset.y % 2 === 0 ? 0 : 1;
    var xOffset = yIndex % 2 !== shouldBeEven ? size /2 : 0;

    var x = xIndex * size  + xOffset;
    var y = yIndex * (hexagonHeight - triangleHeight);

    return {
        x: x,
        y: y
    };
};

HexagonBoard.prototype.findHexagonIndex = function findHexagonIndex(x, y) {
    var hexagonSize = this.size;
    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var rowHeight = hexagonHeight - triangleHeight;

    var rowIndex = Math.floor(y / rowHeight);

    var boardIndexOffset = this.getBoardIndexOffset();
    var shouldBeEven = boardIndexOffset.y % 2 === 0 ? 0 : 1;
    var isOffsetRow = rowIndex % 2 !== shouldBeEven;
    var xOffset = isOffsetRow ? hexagonSize / 2 : 0;

    var columnIndex = Math.floor((x - xOffset) / hexagonSize);

    var innerX = x - (columnIndex * hexagonSize + xOffset);
    var innerY = y - (rowIndex * rowHeight);

    var tangentForThirtyDeg = Math.tan(Math.PI / 6);

    if (innerY < triangleHeight) {
        if (innerX < hexagonSize / 2) {
            if ((triangleHeight - innerY) / innerX > tangentForThirtyDeg) {
                rowIndex--;
                if (!isOffsetRow) {
                    columnIndex--;
                }
            }
        } else {
            if ((triangleHeight - innerY) / (hexagonSize - innerX) > tangentForThirtyDeg) {
                rowIndex--;
                if (isOffsetRow) {
                    columnIndex++;
                }
            }
        }
    }

    var xIndex = columnIndex - boardIndexOffset.x;
    var yIndex = rowIndex - boardIndexOffset.y;

    return {
        x: xIndex,
        y: yIndex
    };
};

HexagonBoard.prototype.getBoardIndexOffset = function getBoardIndexOffset() {
    var xIndexOffset = Math.floor(this._boardSize.width / 2);
    var yIndexOffset = Math.floor(this._boardSize.height / 2);

    xIndexOffset += Math.round((this._boardOffset.x / this.canvas.width) * this._boardSize.width);
    yIndexOffset += Math.round((this._boardOffset.y / this.canvas.height) * this._boardSize.height);

    return {
        x: xIndexOffset,
        y: yIndexOffset
    };
};

HexagonBoard.prototype._drawOverlay = function _drawOverlay() {
    var changeColorCallback = function changeColorCallback (newCurrentColor) {
        this._currentColor = newCurrentColor;
        this._drawBoard();
        this._drawOverlay();
    }.bind(this);

    var colors = {};

    this._hexagonMatrix.forEach(function (hexagon) {
        if (hexagon.color === undefined) {
            return;
        }
        var color = colors[hexagon.color];
        if(color === undefined) {
            color = 0;
        }
        color++;
        colors[hexagon.color] = color;
    });

    var colorList = [];
    _.forIn(colors, function (value, key) {
        colorList.push({
            name: key,
            count: value
        });
    });

    colorList.sort(function (a, b) {
        return b.count - a.count;
    });

    this.overlay.redrawColorList(colorList, this._currentColor, changeColorCallback);
};

HexagonBoard.prototype._drawLoadInfo = function _drawLoadInfo() {
    var savedPatterns = this.patternHandler.getSavedPatterns();
    this.overlay.updateLoadInfo(savedPatterns, this._currentPatternName);
};

HexagonBoard.prototype._clearFocus = function _clearFocus() {
    this.foregroundCanvas.width = this.foregroundCanvas.width;
};

HexagonBoard.prototype.savePattern = function savePattern(name) {
    console.log('save pattern as: ' + name);

    var serializedPattern = this._serialize(true);

    this.patternHandler.savePattern(name, serializedPattern);

    this._currentPatternName = name;

    this._drawLoadInfo();
};

HexagonBoard.prototype.loadPattern = function loadPattern(name) {
    console.log('load pattern: ' + name);

    var serializedObject = this.patternHandler.loadPattern(name);
    this._loadBoard(serializedObject);

    this._currentPatternName = name;

    this.draw();
    this.store();
};

HexagonBoard.prototype.deletePattern = function deletePattern(name) {
    console.log('delete pattern: ' + name);

    this.patternHandler.deletePattern(name);

    this._drawLoadInfo();
};

function calculateBoardSize(width, height, size) {

    var sideLength = (size / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);


    var boardWidth = Math.floor((width - size / 2) / size);
    var boardHeight = Math.floor((height - triangleHeight) / (hexagonHeight - triangleHeight));

    return {
        width: boardWidth,
        height: boardHeight
    };
}

HexagonBoard.prototype.store = function store() {
    var serializedBoard = this._serialize(false);
    this.patternHandler.storeCurrent(serializedBoard);
};

HexagonBoard.prototype.load = function load() {
    var serializedPattern = this.patternHandler.loadCurrent();
    this._loadBoard(serializedPattern);
};

HexagonBoard.prototype.reset = function reset() {
    this.patternHandler.clearCurrent();

    this._hexagonMatrix.reset();
    this._currentPatternName = '';
    this.size = DEFAULT_SIZE;
    this.draw();
};

HexagonBoard.prototype._serialize = function _serialize(isFullSerialization) {
    var hexagons = [];
    this._hexagonMatrix.forEach(function (hexagon) {
        hexagons.push(hexagon);
    });

    var serializedObject = {
        board: {
            currentColor: this._currentColor,
            hexagons: hexagons
        }
    };

    if (isFullSerialization) {
        serializedObject.board.name = this._currentPatternName;
        serializedObject.board.size = this.size;
    }
    return serializedObject;
};

HexagonBoard.prototype._loadBoard = function _loadBoard(serializedObject) {
    if (!serializedObject) {
        return;
    }
    var serializedBoard = serializedObject.board;

    if (!serializedBoard) {
        return;
    }

    if (serializedBoard.name) {
        this._currentPatternName = serializedBoard.name;
    }

    if (serializedBoard.size) {
        this.size = serializedBoard.size;
    }

    if (serializedBoard.currentColor) {
        this._currentColor = serializedBoard.currentColor;
    }

    var hexagonMatrix = this._hexagonMatrix;
    hexagonMatrix.reset();
    if (Array.isArray(serializedBoard.hexagons)) {
        serializedBoard.hexagons.forEach(function (hexagon) {
            hexagonMatrix.add(hexagon);
        });
    }
};

module.exports = HexagonBoard;