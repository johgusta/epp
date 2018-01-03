require('./main.css');
var HexagonBoard = require('./hexagonBoard.js');

var _ = require('lodash');

var mainContent = document.getElementById('main-content');

var span = document.createElement('span');
mainContent.appendChild(span);

var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth - 2;
canvas.height = document.body.clientHeight - 2;

canvas.style.padding = '1px';

mainContent.appendChild(canvas);

var size = 100;
var hexagonBoard = new HexagonBoard(canvas, size);

hexagonBoard.draw();