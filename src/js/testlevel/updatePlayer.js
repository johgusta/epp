module.exports = function updatePlayer(player) {
    var game = player.game;
    var platforms = game.platforms;
    var stars = game.stars;

    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    var isTouchingPlatform = player.body.touching.down && hitPlatform;
    var speed = 350;

    if (isTouchingPlatform) {
        player.body.drag.x = speed - 1;
    } else {
        player.body.drag.x = 0;
    }

    player.body.acceleration.x = 0;
    var playerCursors = player.cursors;
    if (playerCursors.left.isDown) {
        //  Move to the left
        player.body.acceleration.x = -speed;

        player.animations.play('left');
    }
    else if (playerCursors.right.isDown) {
        //  Move to the right
        player.body.acceleration.x = speed;

        player.animations.play('right');
    }
    else {
        //  Stand still
        player.animations.stop();

        player.frame = (13 * 2);
    }

    //  Allow the player to jump if they are touching the ground.
    if (playerCursors.up.isDown && isTouchingPlatform) {
        player.body.velocity.y = -450;
    }
};

function collectStar (player, star) {
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    var game = player.game;
    game.changeScore(star.value);
}