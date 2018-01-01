module.exports = function preloadGame(game) {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('jessica', 'assets/jessica.png', 64, 64);
    game.load.spritesheet('johan', 'assets/johan.png', 64, 64);
};