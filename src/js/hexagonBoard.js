function HexagonBoard(canvas, size) {
    this.canvas = canvas;
    this.size = size;

    this._board = [];

    this._boardSize = calculateBoardSize(this.canvas.width, this.canvas.height, size);

    var row = [];
    row[2] = {
        color: 'blue'
    };

    this._board[3] = row;

    var that = this;

    function actualResizeHandler() {

        that.canvas.width = document.body.clientWidth - 2;
        that.canvas.height = document.body.clientHeight - 2;

        that._boardSize = calculateBoardSize(that.canvas.width, that.canvas.height, that.size);
        that.draw();
    }

    window.addEventListener("resize", _.throttle(actualResizeHandler, 66), false);

    function mouseMoveHandler(event) {
        console.log('mouse moved', event);
    }

    this.canvas.addEventListener('mousemove', _.throttle(mouseMoveHandler, 20));
}

HexagonBoard.prototype.draw = function draw() {
    var ctx = this.canvas.getContext('2d');
    drawBoard(ctx, this._board, this._boardSize.width, this._boardSize.height, this.size);
};


function drawBoard(ctx, board, boardWidth, boardHeight, hexagonSize) {

    var b = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var a = Math.sin(Math.PI / 6) * b;

    var hexagonHeight = (2 * a + b);

    var row;
    var hexagon;
    var color;
    var borderColor;
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
            breakfastHexagon(ctx, hexagon, j * hexagonSize  + xOffset, i * (hexagonHeight - a), hexagonSize);
        }
    }
}

function calculateBoardSize(width, height, size) {

    var b = (size / 2) / Math.cos(Math.PI / 6);
    var a = Math.sin(Math.PI / 6) * b;

    var hexagonHeight = (2 * a + b);


    var boardWidth = Math.floor((width - size / 2) / size);
    var boardHeight = Math.floor((height - a) / (hexagonHeight - a));

    return {
        width: boardWidth,
        height: boardHeight
    };
}

function breakfastHexagon(context, hexagon, x, y, size) {
    var color = hexagon && hexagon.color !== undefined ? hexagon.color : 'green';
    var borderColor = hexagon && hexagon.borderColor !== undefined ? hexagon.borderColor : 'black';

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