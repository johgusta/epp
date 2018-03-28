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
            Hexagon.drawHexagon(ctx, j * hexagonSize  + xOffset, i * (hexagonHeight - triangleHeight), hexagonSize, borderColor);
        }
    }
};

module.exports = Background;