require('./main.css');
var HexagonBoard = require('./hexagonBoard.js');

var _ = require('lodash');

var mainContent = document.getElementById('main-content');

var hexagonBoard = new HexagonBoard(mainContent);

window.Board = hexagonBoard;

hexagonBoard.draw();