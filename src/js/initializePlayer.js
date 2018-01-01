module.exports = function initializePlayer(game, x, y, sprite, cursors) {
    var player = game.add.sprite(x, y, sprite);
    player.game = game;
    player.cursors = cursors;

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    player.enableBody = true;

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
    player.body.mass = 100;
    player.body.maxVelocity.x = 180;

    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (index) {
        return 9 * 13 + index;
    }), 15, true);
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (index) {
        return 11 * 13 + index;
    }), 15, true);

    player.frame = (13 * 2);

    return player;
};