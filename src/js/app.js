require('./main.css');
var Game = require('./game.js');

var mainContent = document.getElementById('main-content');
var gameContainer = document.createElement('div');
gameContainer.classList.add('game-container');
mainContent.appendChild(gameContainer);

var game = new Game(gameContainer);
