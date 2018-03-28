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

Background.prototype.draw = function draw(boardSize, hexagonSize, boardOffset) {
    this.canvas.width = this.canvas.width;

    var boardWidth = boardSize.width;
    var boardHeight = boardSize.height;

    var ctx = this.canvas.getContext('2d');
    var borderColor = this._borderColor;

    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var xOffset = 0;

    for (var i = -1; i < boardHeight + 1; i++) {

        if (i % 2 !== 0) {
            xOffset = hexagonSize /2;
        } else {
            xOffset = 0;
        }

        for (var j = -1; j < boardWidth + 1; j++) {
            var x = j * hexagonSize + xOffset;
            var y = i * (hexagonHeight - triangleHeight);

            x += boardOffset.x;
            y += boardOffset.y;
            Hexagon.drawHexagon(ctx, x, y, hexagonSize, borderColor);
        }
    }
};

module.exports = Background;