"use strict";

function Background(canvas) {
    this.canvas = canvas;
    this._borderColor = 'rgba(0, 0, 0, 0.2)';
}

Background.prototype.setSize = function setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
};

Background.prototype.draw = function draw(boardSize, hexagonSize, boardIndexOffset) {
    this.canvas.width = this.canvas.width;

    var boardWidth = boardSize.width;
    var boardHeight = boardSize.height;

    var ctx = this.canvas.getContext('2d');
    var borderColor = this._borderColor;

    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var shouldBeEven = boardIndexOffset.y % 2 === 0 ? 0 : 1;
    var xOffset = 0;
    for (var i = 0; i < boardHeight; i++) {

        if (i % 2 !== shouldBeEven) {
            xOffset = hexagonSize /2;
        } else {
            xOffset = 0;
        }

        for (var j = 0; j < boardWidth; j++) {
            drawHexagonOutline(ctx, j * hexagonSize  + xOffset, i * (hexagonHeight - triangleHeight), hexagonSize, borderColor);
        }
    }
};


function drawHexagonOutline(context, x, y, size, borderColor) {
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

    context.strokeStyle = borderColor;
    context.stroke();
}


module.exports = Background;