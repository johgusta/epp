var $ = require('jquery');
require('spectrum-colorpicker/spectrum.js');
require('spectrum-colorpicker/spectrum.css');

function HexagonBoard(canvas, overlayDiv, size) {
    this.canvas = canvas;
    this.overlayDiv = overlayDiv;
    this.size = size;

    this._board = [];
    this._currentColor = 'red';

    this._boardSize = calculateBoardSize(this.canvas.width, this.canvas.height, size);

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
        var hexagon = findHexagon(that._board, that.size, event.clientX, event.clientY);

        hexagon.color = hexagon.color === that._currentColor ? undefined : that._currentColor;
        hexagon.hasFocus = false;
        that.draw();
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

HexagonBoard.prototype._drawOverlay = function _drawOverlay() {
    drawOverlay(this.overlayDiv, this._board, this._currentColor, function (newCurrentColor) {
        this._currentColor = newCurrentColor;
        this.draw();
    }.bind(this));
};

function drawOverlay(overlayDiv, board, currentColor, changeColorCallback) {
    while(overlayDiv.firstChild){
        overlayDiv.removeChild(overlayDiv.firstChild);
    }

    var currentColorSelector = document.createElement('div');

    currentColorSelector.className = 'currentColorSelector';
    overlayDiv.appendChild(currentColorSelector);



    var currentColorText = document.createElement('span');
    currentColorText.innerText = 'Current color:';
    currentColorSelector.appendChild(currentColorText);

    var colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.className = 'colorPicker';
    colorInput.style.display = 'none';

    //TODO: Get rid of the stupid timeout
    setTimeout(function () {

        colorInput.style.display = 'visible';
        $('.colorPicker').spectrum({
            color: currentColor,
            change: function(color) {
                console.log('color changed!', color);
                changeColorCallback(color.toHexString());
            }
        });
    }, 0);

    currentColorSelector.appendChild(colorInput);


    var colorsDiv = document.createElement('div');
    colorsDiv.className = 'colorsDiv';
    overlayDiv.appendChild(colorsDiv);

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


    _.forIn(colors, function (value, key) {
        var colorDiv = document.createElement('div');
        colorDiv.style.background = key;

        var countSpan = document.createElement('span');
        countSpan.innerText = value;

        colorDiv.addEventListener('click', function () {
            changeColorCallback(key);
        });
        colorDiv.appendChild(countSpan);
        colorsDiv.appendChild(colorDiv);
    });
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