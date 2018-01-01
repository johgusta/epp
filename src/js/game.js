window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');require('./game.css');

var winState = require('./winState.js');
var testLevel = require('./testlevel/testLevel.js');
var montyPuzzle = require('./montyPuzzle/montyPuzzle.js');

function Game(gameContainer) {

    var phaserDiv = document.createElement('div');
    phaserDiv.id = 'phaser-container';
    phaserDiv.classList.add('game-canvas');
    gameContainer.appendChild(phaserDiv);


    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-container');

    game.state.add('test', testLevel);
    game.state.add('montyPuzzle', montyPuzzle);

    game.state.add('win', winState);

    game.score = 0;
//    game.state.start('test');
    game.state.start('montyPuzzle');
}

module.exports = Game;