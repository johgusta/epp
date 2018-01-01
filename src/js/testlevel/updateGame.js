var updatePlayer = require('./updatePlayer.js');

module.exports = function updateGame(game) {
    //  Collide the stars with the platforms
    game.physics.arcade.collide(game.stars, game.platforms);

    game.players.forEach(function (player) {
        updatePlayer(player);
    });

    if (game.stars.children.filter(function (star) {
        return star.alive;
    }).length === 0) {
        console.log('game over!');
        game.state.start('win', false);

    }
};