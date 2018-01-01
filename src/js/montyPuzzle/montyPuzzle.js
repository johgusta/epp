var createGame = require('./createGame.js');
var preloadGame = require('./preloadGame.js');
var updateGame = require('./updateGame.js');

module.exports = {
    preload: preloadGame,
    create: createGame,
    update: updateGame
};