function HexagonBoard(canvas, size) {
    this.canvas = canvas;
    this.size = size;

    var that = this;

    function actualResizeHandler() {

        that.canvas.width = document.body.clientWidth - 2;
        that.canvas.height = document.body.clientHeight - 2;
        that.draw();
    }

    window.addEventListener("resize", _.throttle(actualResizeHandler, 66), false);
}

HexagonBoard.prototype.draw = function draw() {
    var ctx = this.canvas.getContext('2d');
    drawBoard(ctx, this.canvas.width, this.canvas.height, this.size);
};


function drawBoard(ctx, width, height, size) {

    var b = (size / 2) / Math.cos(Math.PI / 6);
    var a = Math.sin(Math.PI / 6) * b;

    var hexagonHeight = (2 * a + b);


    var boardWidth = Math.floor((width - size / 2) / size);
    var boardHeight = Math.floor((height - a) / (hexagonHeight - a));


    var xOffset = 0;
    for (var i = 0; i < boardHeight; i++) {

        if (i % 2 !== 0) {
            xOffset = size /2;
        } else {
            xOffset = 0;
        }

        for (var j = 0; j < boardWidth; j++) {
            breakfastHexagon(ctx, j * size  + xOffset, i * (hexagonHeight - a), size);
        }
    }
}

function breakfastHexagon(context, x, y, size) {

    var topHeight = Math.tan(Math.PI / 6) * size / 2;
    var hypotenuse = (size / 2) / Math.cos(Math.PI / 6);

    context.beginPath();
    context.moveTo(x + size / 2, y);
    context.lineTo(x + size, y + topHeight);
    context.lineTo(x + size, y + topHeight + hypotenuse);
    context.lineTo(x + size / 2, y + topHeight * 2 + hypotenuse);
    context.lineTo(x, y + topHeight + hypotenuse);
    context.lineTo(x, y + topHeight);
    context.lineTo(x + size / 2, y);

    context.fillStyle = 'green';
    context.fill();

    context.strokeStyle = 'black';
    context.stroke();
}

module.exports = HexagonBoard;