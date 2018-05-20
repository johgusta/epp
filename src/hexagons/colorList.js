"use strict";

import {Hexagon} from './hexagon.js';

var colorItemHeight = 30;
var hexagonSize = 12;
var itemWidth = 90;
var fontSize = 14;
var borderColor = 'rgba(0, 0, 0, 0.2)';

var padding = 6;

function ColorList(canvas) {
    this.canvas = canvas;
    this._colorList = [];

    this.canvas.addEventListener('click', this._handleClick.bind(this));
}

ColorList.prototype.draw = function draw(colorList, changeColorCallback) {
    this._colorList = colorList;
    this._changeColorCallback = changeColorCallback;

    var colorsCanvas = this.canvas;
    colorsCanvas.width = itemWidth;
    colorsCanvas.height = colorItemHeight * colorList.length + padding;
    var context = colorsCanvas.getContext('2d');

    context.font = fontSize + 'px sans-serif';

    colorList.forEach(function (color, index) {
        var x = 0;
        var y = colorItemHeight * index;

        context.save();
        context.translate(x, y);

        context.save();
        context.translate(0.5, 0.5);
        context.beginPath();
        context.rect(padding, padding, itemWidth - padding * 2, colorItemHeight - padding);

        context.fillStyle = '#fdfdfd';
        context.fill();

        context.strokeStyle = '#c2c2c2';
        context.stroke();
        context.restore();

        Hexagon.drawHexagon(context, padding + 6, padding + 4, hexagonSize, borderColor, color.name);

        context.fillText(' x ' + color.count, hexagonSize + padding + 8, fontSize + padding + 2);

        context.restore();
    });
};

ColorList.prototype._handleClick = function _handleClick(event) {

    var x = event.offsetX;
    var y = event.offsetY;


    var colorIndex = findColorIndex(x, y);
    if (colorIndex === undefined) {
        return;
    }

    var color = this._colorList[colorIndex];
    this._changeColorCallback(color.name);
};

function findColorIndex(x, y) {
    if (x <= padding || x >= itemWidth - padding) {
        return;
    }

    var modY = y % colorItemHeight;
    if (modY <= padding) {
        return;
    }
    var colorIndex = Math.floor(y / colorItemHeight);
    return colorIndex;
}

export {ColorList};