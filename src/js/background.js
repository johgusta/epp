"use strict";

var Hexagon = require('./hexagon.js');

function Background(canvas) {
    this.canvas = canvas;
    this._borderColor = '#cccccc';
}

Background.prototype.setSize = function setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
};

Background.prototype.draw = function draw(hexagonSize, boardOffset) {
    this.canvas.width = this.canvas.width;

    var ctx = this.canvas.getContext('2d');
    var borderColor = this._borderColor;

    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var xOffset = 0;

    var rowHeight = (hexagonHeight - triangleHeight);

    var boardWidth = Math.floor((this.canvas.width - hexagonSize / 2) / hexagonSize);
    var boardHeight = Math.floor((this.canvas.height - triangleHeight) / rowHeight);

    var cappedBoardOffset = {
        x: boardOffset.x % hexagonSize,
        y: boardOffset.y % (rowHeight * 2)
    };

    for (var i = -2; i < boardHeight + 3; i++) {

        if (i % 2 !== 0) {
            xOffset = hexagonSize /2;
        } else {
            xOffset = 0;
        }

        for (var j = -1; j < boardWidth + 1; j++) {
            var x = j * hexagonSize + xOffset;
            var y = i * rowHeight;

            x += cappedBoardOffset.x;
            y += cappedBoardOffset.y;
            Hexagon.drawHexagon(ctx, x, y, hexagonSize, borderColor);
        }
    }
};

module.exports = Background;