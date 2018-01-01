module.exports = function createScoring(game) {
    var scoreText = 'Vuxenpoäng:';
    game.scoreText = game.add.text(16, 16, scoreText + game.score, { fontSize: '32px', fill: '#000' });

    game.changeScore = function changeScore(change) {
        game.score += change;
        game.scoreText.text = scoreText + game.score;
    };
    game.add.text(500, 16, 'Race of the Knupps', { fontSize: '32px', fill: '#000' });
};