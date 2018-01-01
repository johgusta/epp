require('./main.css');
var Hexagons = require('./hexagons.js');

var mainContent = document.getElementById('main-content');

var span = document.createElement('span');
mainContent.appendChild(span);

var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

mainContent.appendChild(canvas);

var ctx = canvas.getContext('2d');

var hexagonBoard = new Hexagons();

//hexagonBoard.draw(canvas);


ctx.fillStyle = 'blue';
ctx.fillRect(100, 100, 200, 200);
//drawHexagon(ctx, 300, 300);
breakfastHexagon(ctx, 100, 100);



function drawHexagon(context, x, y) {
    var size = 200;

    context.save();
    context.rotate(Math.PI / 6);
    context.translate(size, -size);
    context.beginPath();
    context.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (var side = 0; side < 7; side++) {
        context.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
    }

    context.fillStyle = "red";
    context.fill();
    context.restore();
}

function breakfastHexagon(context, x, y) {
    var size = 200;

    var topHeight = Math.tan(Math.PI / 6) * size / 2;
    var hypotenuse = (size / 2) / Math.cos(Math.PI / 6);

    context.beginPath();
    context.moveTo(x + size / 2, y);
    context.lineTo(x + size, y + topHeight);
    context.lineTo(x + size, y + topHeight + hypotenuse);
    context.lineTo(x + size / 2, y + topHeight * 2 + hypotenuse);
    context. lineTo(x, y + topHeight + hypotenuse);
    context.lineTo(x, y + topHeight);

    context.fillStyle = 'green';
    context.fill();
}