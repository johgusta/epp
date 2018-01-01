
function Hexagons() {

    this.hexagonAngle = 0.523598776; // 30 degrees in radians
    this.sideLength = 36;
    this.boardWidth = 10;
    this.boardHeight = 10;

    this.hexHeight = Math.sin(this.hexagonAngle) * this.sideLength;
    this.hexRadius = Math.cos(this.hexagonAngle) * this.sideLength;
    this.hexRectangleHeight = this.sideLength + 2 * this.hexHeight;
    this.hexRectangleWidth = 2 * this.hexRadius;

}

Hexagons.prototype.draw = function draw(canvas) {

    this.boardWidth = Math.floor(canvas.width / (this.hexRectangleWidth + 1));
    this.boardHeight = Math.floor(canvas.height / (this.hexRectangleHeight));


    console.log('canvas', canvas.width, canvas.height);
    console.log('hex size', this.hexRectangleWidth, this.hexRectangleHeight);
    console.log('board width: ', this.boardWidth);
    console.log('board height: ', this.boardHeight);


    if (canvas.getContext){
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#CCCCCC";
        ctx.lineWidth = 1;

        this.drawBoard(ctx, this.boardWidth, this.boardHeight);

        canvas.addEventListener("mousemove", function(eventInfo) {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;


            hexY = Math.floor(y / (this.hexHeight + this.sideLength));
            hexX = Math.floor((x - (hexY % 2) * this.hexRadius) / this.hexRectangleWidth);

            screenX = hexX * this.hexRectangleWidth + ((hexY % 2) * this.hexRadius);
            screenY = hexY * (this.hexHeight + this.sideLength);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.drawBoard(ctx, this.boardWidth, this.boardHeight);

            // Check if the mouse's coords are on the board
            if(hexX >= 0 && hexX < this.boardWidth) {
                if(hexY >= 0 && hexY < this.boardHeight) {
                    ctx.fillStyle = "#000000";
                    this.drawHexagon(ctx, screenX, screenY, true);
                }
            }
        }.bind(this));
    }
};

Hexagons.prototype.drawBoard = function drawBoard(canvasContext, width, height) {
    var i,
        j;

    for(i = 0; i < width; ++i) {
        for(j = 0; j < height; ++j) {
            this.drawHexagon(
                canvasContext,
                i * this.hexRectangleWidth + ((j % 2) * this.hexRadius),
                j * (this.sideLength + this.hexHeight),
                false
            );
        }
    }
};

Hexagons.prototype.drawHexagon = function drawHexagon(canvasContext, x, y, fill) {
    var fill = fill || false;

    canvasContext.beginPath();
    canvasContext.moveTo(x + this.hexRadius, y);
    canvasContext.lineTo(x + this.hexRectangleWidth, y + this.hexHeight);
    canvasContext.lineTo(x + this.hexRectangleWidth, y + this.hexHeight + this.sideLength);
    canvasContext.lineTo(x + this.hexRadius, y + this.hexRectangleHeight);
    canvasContext.lineTo(x, y + this.sideLength + this.hexHeight);
    canvasContext.lineTo(x, y + this.hexHeight);
    canvasContext.closePath();

    if(fill) {
        canvasContext.fill();
    } else {
        canvasContext.stroke();
    }
};

module.exports = Hexagons;
