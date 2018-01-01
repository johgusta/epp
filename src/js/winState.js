module.exports = {
    create: createWinState
};

function createWinState(game) {
    game.paused = true;

    game.add.text(180, 200, 'The Knupps have won again!', { fontSize: '32px', fill: '#f00' });
    game.add.text(220, 250, 'Press any knupp key to play again', { fontSize: '20px', fill: '#f00' });

    setTimeout(function () {
        game.input.keyboard.onDownCallback = function () {
            game.input.keyboard.onDownCallback = undefined;
            game.paused = false;
            game.state.start('test');
        };
    }, 500);
}