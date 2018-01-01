require('./main.css');
var Hexagons = require('./hexagons.js');

var mainContent = document.getElementById('main-content');

var span = document.createElement('span');
mainContent.appendChild(span);

var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

mainContent.appendChild(canvas);

//var ctx = canvas.getContext('2d');
//ctx.fillStyle = 'blue';
//ctx.fillRect(20, 20, 40, 40);

var hexagonBoard = new Hexagons();

hexagonBoard.draw(canvas);



function drawHexagon(ctx, x, y) {
    var size = 200;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 2/3);
    ctx.lineTo(x + size * 1/2, y - size * 1/4);
    ctx.lineTo(x + size * 1/2, y + size * 1/4);
    ctx.lineTo(x, y + size * 2/3);
    ctx.lineTo(x - size * 1/2, y + size * 1/4);
    ctx.lineTo(x - size * 1/2, y - size * 1/4);

    ctx.fill();
}