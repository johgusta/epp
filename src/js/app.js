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
ctx.fillStyle = 'blue';

var hexagonBoard = new Hexagons();

//hexagonBoard.draw(canvas);


drawHexagon(ctx, 300, 300);

ctx.fillRect(300, 300, 40, 40);


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