var $ = require('jquery');
require('spectrum-colorpicker/spectrum.js');
require('spectrum-colorpicker/spectrum.css');

function HexagonBoard(canvas, overlayDiv, size) {
    this.canvas = canvas;
    this.overlayDiv = overlayDiv;
    this.size = size;

    this._board = [];
    this._currentColor = '#ff0000';

    this._boardSize = calculateBoardSize(this.canvas.width, this.canvas.height, size);

    this._drawOverlayContainer(overlayDiv);

    var that = this;

    function actualResizeHandler() {

        that.canvas.width = document.body.clientWidth - 2;
        that.canvas.height = document.body.clientHeight - 2;

        that._boardSize = calculateBoardSize(that.canvas.width, that.canvas.height, that.size);
        that.draw();
    }

    window.addEventListener("resize", _.throttle(actualResizeHandler, 66), false);

    function mouseMoveHandler(event) {
        forEachHexagon(that._board, function (hexagon) {
            hexagon.hasFocus = false;
        });

        var hexagon = findHexagon(that._board, that.size, event.clientX, event.clientY);

        hexagon.hasFocus = true;
        that._drawBoard();
    }

    this.canvas.addEventListener('mousemove', _.throttle(mouseMoveHandler, 20));

    function onClickHandler(event) {
        //TODO: Remove fix for changing color when color picker closes by clickig outside of it
        setTimeout(function () {
            var hexagon = findHexagon(that._board, that.size, event.clientX, event.clientY);

            hexagon.color = hexagon.color === that._currentColor ? undefined : that._currentColor;
            hexagon.hasFocus = false;
            that.draw();
        }, 0);
    }

    this.canvas.addEventListener('click', onClickHandler);

}

HexagonBoard.prototype.draw = function draw() {
    this._drawBoard();
    this._drawOverlay();
};


HexagonBoard.prototype._drawBoard = function _drawBoard() {
    this.canvas.width = this.canvas.width;
    var ctx = this.canvas.getContext('2d');
    drawBoard(ctx, this._board, this._boardSize.width, this._boardSize.height, this.size);
};

function drawBoard(ctx, board, boardWidth, boardHeight, hexagonSize) {

    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var row;
    var hexagon;
    var xOffset = 0;
    for (var i = 0; i < boardHeight; i++) {

        if (i % 2 !== 0) {
            xOffset = hexagonSize /2;
        } else {
            xOffset = 0;
        }

        row = board[i];

        for (var j = 0; j < boardWidth; j++) {
            hexagon = row !== undefined ? row[j] : undefined;
            if (hexagon === undefined) {
                hexagon = {};
            }
            breakfastHexagon(ctx, hexagon, j * hexagonSize  + xOffset, i * (hexagonHeight - triangleHeight), hexagonSize);
        }
    }
}

HexagonBoard.prototype._drawOverlayContainer = function _drawOverlayContainer(overlayDiv) {
    var currentColorSelector = document.createElement('div');

    currentColorSelector.className = 'currentColorSelector';
    overlayDiv.appendChild(currentColorSelector);

    var currentColorText = document.createElement('span');
    currentColorText.innerText = 'Current color:';
    currentColorSelector.appendChild(currentColorText);

    var colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.className = 'colorPicker';

    currentColorSelector.appendChild(colorInput);

    var colorsDiv = document.createElement('div');
    colorsDiv.className = 'colorsDiv';
    overlayDiv.appendChild(colorsDiv);

    this.colorsDiv = colorsDiv;
};

HexagonBoard.prototype._drawOverlay = function _drawOverlay() {
    drawOverlay(this.colorsDiv, this._board, this._currentColor, function (newCurrentColor) {
        this._currentColor = newCurrentColor;
        this.draw();
    }.bind(this));
};

function drawOverlay(colorsDiv, board, currentColor, changeColorCallback) {
    while(colorsDiv.firstChild){
        colorsDiv.removeChild(colorsDiv.firstChild);
    }

    $('.colorPicker').spectrum({
        color: currentColor,
        change: function(color) {
            changeColorCallback(color.toHexString());
        }
    });

    var colors = {};
    forEachHexagon(board, function (hexagon) {
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

    colorList.forEach(function (color) {
        var colorDiv = document.createElement('div');

        var hexagonCanvas = createSingleHexagonCanvas(16, color.name);

        colorDiv.appendChild(hexagonCanvas);

        var countSpan = document.createElement('span');
        countSpan.innerText = ' x ' + color.count;


        colorDiv.addEventListener('click', function () {
            changeColorCallback(color.name);
        });
        colorDiv.appendChild(countSpan);
        colorsDiv.appendChild(colorDiv);
    });
}

function createSingleHexagonCanvas(size, color) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var triangleHeight = Math.tan(Math.PI / 6) * size / 2;
    var sideLength = (size / 2) / Math.cos(Math.PI / 6);

    canvas.width = triangleHeight * 2 + sideLength + 2;
    canvas.height = size + 2;

    context.beginPath();
    context.translate(1, 1);
    context.moveTo(triangleHeight, 0);
    context.lineTo(triangleHeight + sideLength, 0);
    context.lineTo(triangleHeight * 2 + sideLength, size / 2);
    context.lineTo(triangleHeight + sideLength, size);
    context.lineTo(triangleHeight, size);
    context.lineTo(0, size / 2);
    context.lineTo(triangleHeight, 0);

    context.fillStyle = color;
    context.fill();

    context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    context.stroke();

    return canvas;
}

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

function findHexagon(board, hexagonSize, x, y) {
    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

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

    var row = board[rowIndex];
    if (row === undefined) {
        row = [];
        board[rowIndex] = row;
    }
    var hexagon = row[columnIndex];
    if (hexagon === undefined) {
        hexagon = {};
        row[columnIndex] = hexagon;
    }

    return hexagon;
}

function forEachHexagon(board, callback) {
    board.forEach(function (row) {
        if (Array.isArray(row)) {
            row.forEach(callback);
        }
    })
}

function breakfastHexagon(context, hexagon, x, y, size) {
    var color = hexagon.color !== undefined ? hexagon.color : 'white';
    var borderColor = hexagon.borderColor !== undefined ? hexagon.borderColor : 'rgba(0, 0, 0, 0.2)';

    if (hexagon.hasFocus) {
        color = 'yellow';
    }

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
}

module.exports = HexagonBoard;