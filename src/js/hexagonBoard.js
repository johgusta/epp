"use strict";

var Color = require('color');
var Hamster = require('hamsterjs');
var Hammer = require('hammerjs');
var FileSaver = require('file-saver');

var Background = require('./background.js');
var HexagonMatrix = require('./hexagonMatrix.js');
var Hexagon = require('./hexagon.js');
var Overlay = require('./overlay.js');
var PatternHandler = require('./patternHandler.js');

var DEFAULT_SIZE = 24;
var DEFAULT_COLOR = '#ff0000';
var DEFAULT_BORDER_COLOR = '#cccccc';

function HexagonBoard(mainContainer) {

    this.debug = false;

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

    function scrollHandler(event, delta) {
        event.preventDefault();
        event.stopPropagation();

        var newZoom = that._boardOffset.zoom - delta;

        var startWidth = that.canvas.width;
        var startHeight = that.canvas.height;

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

        that.overlay.appendDebugText('scroll delta: ' + delta);
        if (that.size !== size) {
            var previousNumberOfHexagons = event.originalEvent.clientX / that.size;
            var currentNumberOfHexagons = event.originalEvent.clientX / size;
            var xZoomOffset = that._boardOffset.x +
                (currentNumberOfHexagons - previousNumberOfHexagons) * Math.max(size, that.size);
            var yZoomOffset = that._boardOffset.y +
                (event.originalEvent.clientY / size - event.originalEvent.clientY / that.size) * Math.max(size, that.size);

            that._boardOffset.x = xZoomOffset;
            that._boardOffset.y = yZoomOffset;

            that.size = size;
            that._clearFocus();
            that.drawBoard();
        }
    }
    Hamster(window.document).wheel(scrollHandler);

    mouseHandler(this);
}

function mouseHandler(that) {

    var isPinching = false;
    var pinchStartSize = undefined;
    var pinchStartOffset = undefined;

    var hammertime = new Hammer(that.boardContainer);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchstart', function (ev) {
        that.overlay.appendDebugText('first pinch');
        isPinching = true;
        pinchStartSize = that.size;
        pinchStartOffset = {
            x: that._boardOffset.x,
            y: that._boardOffset.y
        };

    });
    hammertime.on('pinch', function (ev) {
        var newSize = Math.round(pinchStartSize * ev.scale);
        if (newSize < 10) {
            newSize = 10;
        } else if (newSize > 100) {
            newSize = 100;
        }

        if (that.size !== newSize) {
            that.size = newSize;
            var xZoomOffset = pinchStartOffset.x +
                (ev.center.x / newSize - ev.center.x / pinchStartSize) * Math.max(newSize, pinchStartSize);
            var yZoomOffset = pinchStartOffset.y +
                (ev.center.y / newSize - ev.center.y / pinchStartSize) * Math.max(newSize, pinchStartSize);
            that._boardOffset.x = xZoomOffset;
            that._boardOffset.y = yZoomOffset;

            that._clearFocus();
            that.drawBoard();
        }
    });

    that.boardContainer.addEventListener('mousedown', mouseDownHandler);
    that.boardContainer.addEventListener('mousemove', mouseMoveHandler);
    that.boardContainer.addEventListener('mouseup', mouseUpHandler);
    that.boardContainer.addEventListener('mouseleave', mouseLeaveHandler);

    that.boardContainer.addEventListener('touchstart', function (event) {
        var touch = event.changedTouches[0];
        if (touch) {
            mouseDownHandler(touch);
        }
    });
    that.boardContainer.addEventListener('touchmove', function (event) {
        var touch = event.changedTouches[0];
        if (touch) {
            mouseMoveHandler(touch);
        }
    });

    that.boardContainer.addEventListener('touchend', function (event) {
        if (isPinching && event.touches.length === 0) {
            isPinching = false;
            that.overlay.appendDebugText('pinching finished');
        }
    });

    that.boardContainer.addEventListener('touchcancel', function (event) {
        if (isPinching && event.touches.length === 0) {
            isPinching = false;
            that.overlay.appendDebugText('pinching canceled');
        }
    });

    var panThreshold = 10;

    var isMouseDown = false;
    var mouseStartPosition;

    var hasPerformedPanning = false;

    function mouseDownHandler(event) {
        if (isPinching) {
            return;
        }
        isMouseDown = true;
        mouseStartPosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function mouseMoveHandler(event) {
        if (isPinching) {
            return;
        } else if (!mouseStartPosition || !isMouseDown) {
            focusHandler(event);
        } else {
            handlePanningMovement(event);
        }
    }

    function handlePanningMovement(event) {
        var currentPosition = {
            x: event.clientX,
            y: event.clientY
        };

        if (Math.abs(mouseStartPosition.x - currentPosition.x) > panThreshold ||
                Math.abs(mouseStartPosition.y - currentPosition.y) > panThreshold) {
            hasPerformedPanning = true;

            var xDiff = currentPosition.x - mouseStartPosition.x;
            var yDiff = currentPosition.y - mouseStartPosition.y;

            that._boardOffset.x += xDiff;
            that._boardOffset.y += yDiff;

            mouseStartPosition = {
                x: currentPosition.x,
                y: currentPosition.y
            };
            that.overlay.appendDebugText('perform panning');

            that._clearFocus();
            that.drawBoard();
        }
    }

    function mouseUpHandler(event) {
        if (isMouseDown && !hasPerformedPanning) {
            onClickHandler(that, event);
        }

        endPanning();
        that.overlay.colorPickerOpen = false;
    }

    function mouseLeaveHandler() {
        endPanning();
        requestAnimationFrame(function () {
            that._clearFocus();
        });
    }

    function endPanning() {
        isMouseDown = false;
        mouseStartPosition = undefined;
        hasPerformedPanning = false;
    }

    function focusHandler(event) {
        var hexagonIndex = that.findHexagonIndex(event.clientX, event.clientY);

        if (that.overlay.colorPickerOpen || hasPerformedPanning) {
            requestAnimationFrame(function() {
                that._clearFocus();
            });
            return;
        }

        var borderColor = '#000000';

        var context = that.foregroundCanvas.getContext('2d');

        var hexagonPosition = that._getHexagonPosition(hexagonIndex);
        requestAnimationFrame(function () {
            that._clearFocus();
            that._drawHexagon(context, hexagonPosition, that._currentColor, borderColor);
        });
    }

    function onClickHandler(that, event) {
        var hexagonIndex = that.findHexagonIndex(event.clientX, event.clientY);

        if (that.overlay.colorPickerOpen) {
            return;
        }

        var hexagonMatrix = that._hexagonMatrix;
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
        requestAnimationFrame(function () {
            that._clearFocus();
            that.draw();
            requestAnimationFrame(function () {
                that.store();
            });
        });
    }
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
    this.drawBoard();
    this._drawOverlay();
    this._drawLoadInfo();
};

HexagonBoard.prototype._drawBackground = function _drawBackground() {
    this.background.draw(this.size, this._boardOffset);
};

HexagonBoard.prototype.drawBoard = function drawBoard() {
    if (this._drawCallInQueue !== true) {
        this._drawCallInQueue = true;
        requestAnimationFrame(function () {
            this._drawCallInQueue = false;
            this._drawBackground();
            this._drawHexagons();
        }.bind(this));
    }
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

    Hexagon.drawHexagon(context, x, y, size, borderColor, color);
};

HexagonBoard.prototype._getHexagonPosition = function _getHexagonPosition(hexagonIndex) {
    var xIndex = hexagonIndex.x;
    var yIndex = hexagonIndex.y;

    var size = this.size;

    var sideLength = (size / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;
    var hexagonHeight = (2 * triangleHeight + sideLength);

    var xOffset = yIndex % 2 !== 0 ? size /2 : 0;

    var x = xIndex * size + xOffset + this._boardOffset.x;
    var y = yIndex * (hexagonHeight - triangleHeight) + this._boardOffset.y;

    return {
        x: x,
        y: y
    };
};

HexagonBoard.prototype.findHexagonIndex = function findHexagonIndex(clientX, clientY) {
    var hexagonSize = this.size;
    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var x = clientX - this._boardOffset.x;
    var y = clientY - this._boardOffset.y;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var rowHeight = hexagonHeight - triangleHeight;

    var rowIndex = Math.floor(y / rowHeight);

    var isOffsetRow = rowIndex % 2 !== 0;
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

    return {
        x: columnIndex,
        y: rowIndex
    };
};

HexagonBoard.prototype._drawOverlay = function _drawOverlay() {
    var changeColorCallback = function changeColorCallback (newCurrentColor) {
        this._currentColor = newCurrentColor;
        this.drawBoard();
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

HexagonBoard.prototype.exportPattern = function exportPattern(name) {
    console.log('export pattern: ' + name);

    this.canvas.toBlob(function (blob) {
        FileSaver.saveAs(blob, name + ".png");
    });
};

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
            if (hexagon.color !== undefined) {
                hexagonMatrix.add(hexagon);
            }
        });
    }
};

module.exports = HexagonBoard;