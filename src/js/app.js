require('./main.css');
var Hexagons = require('./hexagons.js');

var mainContent = document.getElementById('main-content');

var span = document.createElement('span');
mainContent.appendChild(span);

var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth - 2;
canvas.height = document.body.clientHeight - 2;

canvas.style.padding = '1px';

mainContent.appendChild(canvas);

var ctx = canvas.getContext('2d');

var hexagonBoard = new Hexagons();

//hexagonBoard.draw(canvas);


ctx.fillStyle = 'blue';
//ctx.fillRect(100, 100, 200, 200);
//drawHexagon(ctx, 300, 300);

var size = 20;

drawBoard(canvas.width, canvas.height, size);

addResizeListener(canvas, size);

function addResizeListener(canvas, size) {
    window.addEventListener("resize", resizeThrottler, false);

    var resizeTimeout;
    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if ( !resizeTimeout ) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null;
                actualResizeHandler();

                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    }

    function actualResizeHandler() {
        console.log('resizing');

        canvas.width = document.body.clientWidth - 2;
        canvas.height = document.body.clientHeight - 2;
        drawBoard(canvas.width, canvas.height, size);
    }
}

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

function drawBoard(width, height, size) {


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