//var updatePlayer = require('./updatePlayer.js');

module.exports = function updateGame(game) {
    snapBlocksToGrid(game.blocks);

    var controlKeys = game.controlKeys;
    if (controlKeys.space.isDown && controlKeys.space.repeats === 0) {
        game.blocks.setSelectedBlock(
            (game.blocks.selectedBlock + 1) % (game.blocks.children.length));
    }

    var selected = game.blocks.children[game.blocks.selectedBlock];
    if (!selected) {
        selected = game.blocks.children[0];
    }


    var alphaChange = 0.02;
    var blockSpeed = 200;
    var cursors = game.cursors;
    blinkBlock(selected, alphaChange);

    if (cursors.up.isDown) {// && !selected.body.touching.up) {
        selected.body.velocity.y = -blockSpeed;
    } else if (cursors.down.isDown) {// && !selected.body.touching.down) {
        selected.body.velocity.y = blockSpeed;
    } else if (cursors.right.isDown) {// && !selected.body.touching.right) {
        selected.body.velocity.x = blockSpeed;
    } else if (cursors.left.isDown) {// && !selected.body.touching.left) {
        selected.body.velocity.x = -blockSpeed;
    }
};

function snapBlocksToGrid(blocks) {
    //Snap to grid if speed is below threshold value
    var minimumSpeed = 10;
    blocks.forEach(function (block) {
        if (Math.abs(block.body.velocity.x) < minimumSpeed) {
            block.body.velocity.x = 0;
            snapBlockToGridX(block);
        }
        if (Math.abs(block.body.velocity.y) < minimumSpeed) {
            block.body.velocity.y = 0;
            snapBlockToGridY(block);
        }
    });
}

function snapBlockToGridX(block) {
    var game = block.game;
    var xPosition = block.body.x - block.width / 2;
    var xIndex = Math.round((xPosition - game.boxX) / game.blockSize);
    block.body.x = game.boxX + xIndex * game.blockSize + block.width / 2;
}

function snapBlockToGridY(block) {
    var game = block.game;
    var yPosition = block.body.y - block.height / 2;
    var yIndex = Math.round((yPosition - game.boxY) / game.blockSize);
    block.body.y = game.boxY + yIndex * game.blockSize + block.height / 2;
}

function blinkBlock(block, alphaChange) {
    if (block.alphaChange === undefined) {
        block.alphaChange = alphaChange;
    }
    if (block.alpha >= 1) {
        block.alphaChange = -block.alphaChange;
    }
    if (block.alpha < 0.5) {
        block.alphaChange = -block.alphaChange;
    }
    block.alpha += block.alphaChange;
}