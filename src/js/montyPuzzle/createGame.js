var initializePlayer = require('../initializePlayer.js');
//var createScoring = require('../createScoring.js');

var blockSize = 80;

module.exports = function createGame(game) {
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.restitution = 0;

    game.boxX = 350;
    game.boxY = 100;
    game.blockSize = blockSize;

    var bounds = new Phaser.Rectangle(350, 100, 4 * blockSize, 5 * blockSize);


    game.boxCollisionGroup = game.physics.p2.createCollisionGroup();
    game.blocksCollisionGroup = game.physics.p2.createCollisionGroup();
    game.winningBlockCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();

    createBackground(game);

    createBoxBounds(game, bounds);

    createBlocks(game);
    createPlayers(game);
};

function createBackground(game) {
    //  A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.cursors = game.input.keyboard.createCursorKeys();

    game.controlKeys = {
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
}
function createBlocks(game) {

    game.blocks = game.add.physicsGroup(Phaser.Physics.P2JS);
    game.blocks.enableBody = true;
    game.blocks.selectedBlock = 6;
    game.blocks.setSelectedBlock = function (newSelectedBlockId) {
        game.blocks.selectedBlock = newSelectedBlockId;

        game.blocks.forEach(function (block) {
            block.alpha = 1;
            block.alphaChange = undefined;
        });
    };

    createBlock(game, 1, 0, 2, 2, 'block_1', true);
    createBlock(game, 0, 0, 1, 2, 'block_2');
    createBlock(game, 3, 0, 1, 2, 'block_3');
    createBlock(game, 0, 2, 1, 2, 'block_4');
    createBlock(game, 3, 2, 1, 2, 'block_5');
    createBlock(game, 1, 2, 2, 1, 'block_6');
    createBlock(game, 0, 4, 1, 1, 'block_7');
    createBlock(game, 1, 3, 1, 1, 'block_8');
    createBlock(game, 2, 3, 1, 1, 'block_9');
    createBlock(game, 3, 4, 1, 1, 'block_10');
}

function createBlock(game, x, y, width, height, sprite, winningBlock) {

    var blockId = game.blocks.children.length;
    var blockWidth = width * blockSize;
    var blockHeight = height * blockSize;
    var block = game.blocks.create(game.boxX + x * blockSize + blockWidth / 2,
        game.boxY + y * blockSize + blockHeight / 2, sprite);
    //block.anchor.setTo(0, 0);
    block.body.setRectangle(blockWidth, blockHeight);

    block.blockId = blockId;
    block.blockSize = blockSize;
    block.inputEnabled = true;
    block.events.onInputDown.add(function () {
        game.blocks.setSelectedBlock(block.blockId);
    });

    if (winningBlock) {
        block.body.setCollisionGroup(game.winningBlockCollisionGroup);
        block.body.collides([game.blocksCollisionGroup, game.boxCollisionGroup,
            game.winningBlockCollisionGroup]);
    } else {
        block.body.setCollisionGroup(game.blocksCollisionGroup);
        block.body.collides([game.blocksCollisionGroup, game.boxCollisionGroup,
            game.winningBlockCollisionGroup]);
    }
}

function createBoxBounds(game, bounds) {
    //  Create a new custom sized bounds, within the world bounds
    game.customBounds = { left: null, right: null, top: null, bottom: null };

    createPreviewBounds(game, bounds);

    //  Just to display the bounds
    var graphics = game.add.graphics(bounds.x, bounds.y);
    graphics.lineStyle(4, 0xffd900, 2);
    graphics.drawRect(0, 0, bounds.width, bounds.height);
}

function createPreviewBounds(game, rectangle) {
    var x = rectangle.x;
    var y = rectangle.y;
    var w = rectangle.width;
    var h = rectangle.height;

    var customBounds = game.customBounds;

    var sim = game.physics.p2;

    customBounds.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: 1.5707963267948966 });
    customBounds.left.addShape(new p2.Plane());
    customBounds.left.shapes[0].collisionGroup = game.boxCollisionGroup.mask;
    customBounds.left.shapes[0].collisionMask = game.blocksCollisionGroup.mask | game.winningBlockCollisionGroup.mask;

    customBounds.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], angle: -1.5707963267948966 });
    customBounds.right.addShape(new p2.Plane());
    customBounds.right.shapes[0].collisionGroup = game.boxCollisionGroup.mask;
    customBounds.right.shapes[0].collisionMask = game.blocksCollisionGroup.mask | game.winningBlockCollisionGroup.mask;

    customBounds.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: -3.141592653589793 });
    customBounds.top.addShape(new p2.Plane());
    customBounds.top.shapes[0].collisionGroup = game.boxCollisionGroup.mask;
    customBounds.top.shapes[0].collisionMask = game.blocksCollisionGroup.mask | game.winningBlockCollisionGroup.mask;

    customBounds.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
    customBounds.bottom.addShape(new p2.Plane());
    customBounds.bottom.shapes[0].collisionGroup = game.boxCollisionGroup.mask;
    customBounds.bottom.shapes[0].collisionMask = game.blocksCollisionGroup.mask;

    sim.world.addBody(customBounds.left);
    sim.world.addBody(customBounds.right);
    sim.world.addBody(customBounds.top);
    sim.world.addBody(customBounds.bottom);

}

function createPlayers(game) {
    // The player and its settings
    var jessica = initializePlayer(game, 128, game.world.height - 150, 'jessica',
        game.input.keyboard.createCursorKeys());
    var johan = initializePlayer(game, 32, game.world.height - 150, 'johan', {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    });

    game.players = [jessica, johan];
}