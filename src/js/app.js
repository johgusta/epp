require('./main.css');
var HexagonBoard = require('./hexagonBoard.js');

var _ = require('lodash');

var mainContent = document.getElementById('main-content');

var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth - 2;
canvas.height = document.body.clientHeight - 2;

canvas.style.padding = '1px';

mainContent.appendChild(canvas);

var overlayDiv = document.createElement('div');
overlayDiv.className = 'overlayDiv';
mainContent.appendChild(overlayDiv);

var size = 30;
var hexagonBoard = new HexagonBoard(canvas, overlayDiv, size);

hexagonBoard.draw();