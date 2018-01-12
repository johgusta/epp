var $ = require('jquery');
var Color = require('color');
var Hamster = require('hamsterjs');
require('spectrum-colorpicker/spectrum.js');
require('spectrum-colorpicker/spectrum.css');

var HEXAGON_BOARD_STORAGE_KEY = 'HexagonBoard';
var SAVED_PATTERNS_KEY = 'HexagonPatterns';
var SAVED_PATTERN_PREFIX = 'HexagonPattern-';

var DEFAULT_SIZE = 24;
var DEFAULT_COLOR = '#ff0000';

function HexagonBoard(canvas, overlayDiv) {
    this.canvas = canvas;
    this.size = DEFAULT_SIZE;

    this._board = [];
    this._currentColor = DEFAULT_COLOR;
    this._currentPatternName = '';

    this._boardOffset = {
        x: 0,
        y: 0,
        zoom: 0
    };

    this._drawOverlayContainer(overlayDiv);

    this.load();

    this.draw();
    this.canvas.style.position = 'absolute';


    var that = this;

    function actualResizeHandler() {

        that.canvas.width = document.body.clientWidth - 2;
        that.canvas.height = document.body.clientHeight - 2;

        that.draw();
    }

    window.addEventListener("resize", _.throttle(actualResizeHandler, 66), false);

    function mouseMoveHandler(event) {
        var hexagonIndex = findHexagonIndex(that.size, event.clientX, event.clientY);

        if (hexagonIndex.x >= that._boardSize.width || hexagonIndex.y >= that._boardSize.height) {
            that._focusIndex = undefined;
        } else {
            that._focusIndex = hexagonIndex;
        }

        that._drawBoard();
    }

    this.canvas.addEventListener('mousemove', _.throttle(mouseMoveHandler, 20));

    function onClickHandler(event) {
        //TODO: Remove fix for changing color when color picker closes by clickig outside of it
        setTimeout(function () {
            var hexagon = findHexagon(that._board, that.size, event.clientX, event.clientY);

            if (hexagon.x >= that._boardSize.width || hexagon.y >= that._boardSize.height) {
                return;
            }
            hexagon.color = hexagon.color === that._currentColor ? undefined : that._currentColor;
            that._focusIndex = undefined;
            that.draw();
            requestAnimationFrame(function () {
                that.store();
            });
        }, 0);
    }

    this.canvas.addEventListener('click', onClickHandler);

    function scrollHandler(event, delta) {
        event.preventDefault();
        event.stopPropagation();
        console.log('scrolling ' + delta);
        //that.size += delta / 10;

        if (that.size <= 10) {
            that.size = 10;
        } else if (that.size > 100) {
            that.size = 100;
        }
        that._boardSize = calculateBoardSize(that.canvas.width, that.canvas.height, Math.floor(that.size));

        that._boardOffset.x -= delta;
        that._boardOffset.y -= delta;
        that._boardOffset.zoom += delta;
        //that.canvas.style.left = that._boardOffset.x;
        //that.canvas.style.top = that._boardOffset.y;

        that._drawBoard();
    }
    Hamster(window.document).wheel(_.throttle(scrollHandler, 40));
}

HexagonBoard.prototype.draw = function draw() {

    this._boardSize = calculateBoardSize(this.canvas.width, this.canvas.height, this.size);
    this._drawBoard();
    this._drawOverlay();
    this._drawLoadInfo();
};


HexagonBoard.prototype._drawBoard = function _drawBoard() {
    this.canvas.width = this.canvas.width;
    var ctx = this.canvas.getContext('2d');

    var currentColor = new Color(this._currentColor);
    var rgbObject = currentColor.object();
    var focusColor = 'rgba(' + rgbObject.r + ',' + rgbObject.g + ',' + rgbObject.b + ',0.2)';
    var size = Math.floor(this.size);
    drawBoard(ctx, this._board, this._boardSize.width, this._boardSize.height, this.size, this._focusIndex, focusColor);
};

function drawBoard(ctx, board, boardWidth, boardHeight, hexagonSize, focusIndex, focusColor) {

    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var row;
    var hexagon;
    var xOffset = 0;
    for (var i = 0; i < boardHeight; i++) {

        if (i % 2 !== 0) {
            xOffset = hexagonSize /2;
        } else {
            xOffset = 0;
        }

        row = board[i];

        for (var j = 0; j < boardWidth; j++) {
            hexagon = row !== undefined ? row[j] : undefined;
            if (hexagon === undefined) {
                hexagon = {};
            }
            var overrideColor = focusIndex && focusIndex.x === j && focusIndex.y === i ? focusColor : undefined;
            breakfastHexagon(ctx, hexagon, j * hexagonSize  + xOffset, i * (hexagonHeight - triangleHeight), hexagonSize, overrideColor);
        }
    }
}

HexagonBoard.prototype._drawOverlayContainer = function _drawOverlayContainer(overlayDiv) {
    var topLeftContainer = document.createElement('div');
    topLeftContainer.className = 'topLeftContainer';

    var clearAllButton = document.createElement('div');
    clearAllButton.className = 'clear-all button';
    topLeftContainer.appendChild(clearAllButton);

    var clearAllText = document.createElement('span');
    clearAllText.innerText = 'Clear All';
    clearAllButton.appendChild(clearAllText);

    clearAllButton.addEventListener('click', function () {
        this.reset();
    }.bind(this));

    overlayDiv.appendChild(topLeftContainer);

    var bottomLeftContainer = document.createElement('div');
    bottomLeftContainer.className = 'bottomLeftContainer';
    overlayDiv.appendChild(bottomLeftContainer);

    var currentColorSelector = document.createElement('div');

    currentColorSelector.className = 'currentColorSelector';
    bottomLeftContainer.appendChild(currentColorSelector);

    var currentColorText = document.createElement('span');
    currentColorText.innerText = 'Current color:';
    currentColorSelector.appendChild(currentColorText);

    var colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.className = 'colorPicker';

    currentColorSelector.appendChild(colorInput);

    var colorsDiv = document.createElement('div');
    colorsDiv.className = 'colorsDiv';
    bottomLeftContainer.appendChild(colorsDiv);

    this.colorsDiv = colorsDiv;

    var saveDialogContainer = document.createElement('div');
    saveDialogContainer.className = 'saveDialogContainer';
    overlayDiv.appendChild(saveDialogContainer);


    var innerSaveContainer = document.createElement('form');
    innerSaveContainer.className = 'innerSaveContainer';
    saveDialogContainer.appendChild(innerSaveContainer);

    var saveNameInput = document.createElement('input');
    saveNameInput.className = 'saveName';
    saveNameInput.name = 'saveName';
    saveNameInput.type = 'text';
    saveNameInput.placeholder = 'Enter name';
    saveNameInput.value = this._currentPatternName;
    saveNameInput.required = true;
    this._saveNameInput = saveNameInput;

    innerSaveContainer.appendChild(saveNameInput);

    var saveButton = document.createElement('input');
    saveButton.type = 'submit';
    saveButton.className = 'save button';
    saveButton.value = 'Save';
    innerSaveContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        this._savePattern(saveNameInput.value);
    }.bind(this));
    innerSaveContainer.appendChild(saveButton);

    var innerLoadContainer = document.createElement('div');
    innerLoadContainer.className = 'innerLoadContainer';
    saveDialogContainer.appendChild(innerLoadContainer);

    var loadDropDown = document.createElement('select');
    loadDropDown.name = 'loadPattern';
    loadDropDown.className = 'loadPatternDropDown';
    this._loadDropDown = loadDropDown;

    innerLoadContainer.appendChild(loadDropDown);

    var loadButton = document.createElement('div');
    loadButton.className = 'load button';
    var loadButtonText = document.createElement('span');
    loadButtonText.innerText = 'Load';
    loadButton.appendChild(loadButtonText);

    loadButton.addEventListener('click', function () {
        this._loadPattern(loadDropDown.value);
    }.bind(this));
    this._loadButton = loadButton;

    innerLoadContainer.appendChild(loadButton);

    var deleteButton = document.createElement('div');
    deleteButton.className = 'delete button';
    var deleteButtonText = document.createElement('span');
    deleteButtonText.innerText = 'Delete';
    deleteButton.appendChild(deleteButtonText);

    deleteButton.addEventListener('click', function () {
        this._deletePattern(loadDropDown.value);
    }.bind(this));
    this._deleteButton = deleteButton;

    innerLoadContainer.appendChild(deleteButton);
};

HexagonBoard.prototype._drawOverlay = function _drawOverlay() {
    drawOverlay(this.colorsDiv, this._board, this._currentColor, function (newCurrentColor) {
        this._currentColor = newCurrentColor;
        this._drawBoard();
    }.bind(this));
};

function drawOverlay(colorsDiv, board, currentColor, changeColorCallback) {
    while(colorsDiv.firstChild){
        colorsDiv.removeChild(colorsDiv.firstChild);
    }

    $('.colorPicker').spectrum({
        color: currentColor,
        showInitial: true,
        replacerClassName: 'colorInput',
        change: function(color) {
            changeColorCallback(color.toHexString());
        }
    });

    var colors = {};
    forEachHexagon(board, function (hexagon) {
        if (hexagon.color === undefined) {
            return;
        }
        var color = colors[hexagon.color];
        if(color === undefined) {
            color = 0;
        }
        color++;
        colors[hexagon.color] = color;
    });

    var colorList = [];
    _.forIn(colors, function (value, key) {
        colorList.push({
            name: key,
            count: value
        });
    });

    colorList.sort(function (a, b) {
        return b.count - a.count;
    });

    colorList.forEach(function (color) {
        var colorDiv = document.createElement('div');
        colorDiv.className = 'button';

        var hexagonCanvas = createSingleHexagonCanvas(12, color.name);

        colorDiv.appendChild(hexagonCanvas);

        var countSpan = document.createElement('span');
        countSpan.innerText = ' x ' + color.count;


        colorDiv.addEventListener('click', function () {
            changeColorCallback(color.name);
        });
        colorDiv.appendChild(countSpan);
        colorsDiv.appendChild(colorDiv);
    });
}

HexagonBoard.prototype._drawLoadInfo = function _drawLoadInfo() {
    var savedPatterns = this.getSavedPatterns();

    var loadDropDown = this._loadDropDown;
    while(loadDropDown.firstChild){
        loadDropDown.removeChild(loadDropDown.firstChild);
    }

    var currentPatternName = this._currentPatternName;

    savedPatterns.forEach(function (pattern) {
        var option = document.createElement('option');
        option.innerText = pattern.name;
        option.value = pattern.name;
        if (currentPatternName === pattern.name) {
            option.selected = true;
        }
        loadDropDown.appendChild(option);
    });

    if (savedPatterns.length === 0) {
        loadDropDown.setAttribute('disabled', true);
        this._loadButton.classList.add('disabled');
        this._deleteButton.classList.add('disabled');
    } else {
        loadDropDown.removeAttribute('disabled');
        this._loadButton.classList.remove('disabled');
        this._deleteButton.classList.remove('disabled');
    }

    this._saveNameInput.value = this._currentPatternName;
};

HexagonBoard.prototype.getSavedPatterns = function getSavedPatterns() {
    if (!window.localStorage) {
        return [];
    }

    var savedPatternsString = window.localStorage.getItem(SAVED_PATTERNS_KEY);
    var savedPatterns = [];

    try {
        savedPatterns = JSON.parse(savedPatternsString);
    } catch (e) {
        console.error('Error parsing saved patterns', e);
        return [];
    }

    if (!Array.isArray(savedPatterns)) {
        savedPatterns = [];
    }

    return savedPatterns;
};

HexagonBoard.prototype.storeSavedPatterns = function storeSavedPatterns(savedPatterns) {
    if (!window.localStorage) {
        return;
    }

    var savedPatternsString = JSON.stringify(savedPatterns);
    window.localStorage.setItem(SAVED_PATTERNS_KEY, savedPatternsString);
};

HexagonBoard.prototype._savePattern = function _savePattern(name) {
    if (!window.localStorage) {
        return;
    }

    console.log('save pattern as: ' + name);
    var savedPatterns = this.getSavedPatterns();

    var newPatterns = [];
    //Remove duplicates
    savedPatterns.forEach(function (pattern) {
        if (pattern.name !== name) {
            newPatterns.push(pattern);
        }
    });
    newPatterns.push({
        name: name
    });

    this._currentPatternName = name;

    this.storeSavedPatterns(newPatterns);

    var serializedPattern = this._serialize(true);

    window.localStorage.setItem(SAVED_PATTERN_PREFIX + name, serializedPattern);

    this._drawLoadInfo();
};

HexagonBoard.prototype._loadPattern = function _loadPattern(name) {
    if (!window.localStorage) {
        return;
    }

    console.log('load pattern: ' + name);

    var serializedString = window.localStorage.getItem(SAVED_PATTERN_PREFIX + name);
    var serializedObject;
    try {
        serializedObject= JSON.parse(serializedString);
    } catch (e) {
        console.error('Error loading stored pattern!', e);
        window.localStorage.removeItem(SAVED_PATTERN_PREFIX + name);
        return;
    }
    this._loadBoard(serializedObject);

    this._saveNameInput.value = name;
    this.draw();
    this.store();
};

HexagonBoard.prototype._deletePattern = function _deletePattern(name) {
    if (!window.localStorage) {
        return;
    }

    console.log('delete pattern: ' + name);
    var oldPatterns = this.getSavedPatterns();
    var newPatterns = [];
    oldPatterns.forEach(function (pattern) {
        if (pattern.name !== name) {
            newPatterns.push(pattern);
        }
    });

    this.storeSavedPatterns(newPatterns);

    window.localStorage.removeItem(SAVED_PATTERN_PREFIX + name);

    this._drawLoadInfo();
};

function createSingleHexagonCanvas(size, color) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var triangleHeight = Math.tan(Math.PI / 6) * size / 2;
    var sideLength = (size / 2) / Math.cos(Math.PI / 6);

    canvas.width = triangleHeight * 2 + sideLength + 2;
    canvas.height = size + 2;

    context.beginPath();
    context.translate(1, 1);
    context.moveTo(triangleHeight, 0);
    context.lineTo(triangleHeight + sideLength, 0);
    context.lineTo(triangleHeight * 2 + sideLength, size / 2);
    context.lineTo(triangleHeight + sideLength, size);
    context.lineTo(triangleHeight, size);
    context.lineTo(0, size / 2);
    context.lineTo(triangleHeight, 0);

    context.fillStyle = color;
    context.fill();

    context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    context.stroke();

    return canvas;
}

function calculateBoardSize(width, height, size) {

    var sideLength = (size / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);


    var boardWidth = Math.floor((width - size / 2) / size);
    var boardHeight = Math.floor((height - triangleHeight) / (hexagonHeight - triangleHeight));

    return {
        width: boardWidth,
        height: boardHeight
    };
}

function findHexagon(board, hexagonSize, x, y) {
    var hexagonIndex = findHexagonIndex(hexagonSize, x, y);

    var row = board[hexagonIndex.y];
    if (row === undefined) {
        row = [];
        board[hexagonIndex.y] = row;
    }
    var hexagon = row[hexagonIndex.x];
    if (hexagon === undefined) {
        hexagon = {
            x: hexagonIndex.x,
            y: hexagonIndex.y
        };
        row[hexagonIndex.x] = hexagon;
    }

    return hexagon;
}

function findHexagonIndex(hexagonSize, x, y) {
    var sideLength = (hexagonSize / 2) / Math.cos(Math.PI / 6);
    var triangleHeight = Math.sin(Math.PI / 6) * sideLength;

    var hexagonHeight = (2 * triangleHeight + sideLength);

    var rowHeight = hexagonHeight - triangleHeight;

    var rowIndex = Math.floor(y / rowHeight);

    var isOffsetRow = rowIndex % 2 !== 0;
    var xOffset = isOffsetRow ? hexagonSize / 2 : 0;
    var columnIndex = Math.floor((x - xOffset) / hexagonSize);

    var innerX = x - (columnIndex * hexagonSize + xOffset);
    var innerY = y - (rowIndex * rowHeight);

    var tangentForThirtyDeg = Math.tan(Math.PI / 6);

    if (innerY < triangleHeight) {
        if (innerX < hexagonSize / 2) {
            if ((triangleHeight - innerY) / innerX > tangentForThirtyDeg) {
                rowIndex--;
                if (!isOffsetRow) {
                    columnIndex--;
                }
            }
        } else {
            if ((triangleHeight - innerY) / (hexagonSize - innerX) > tangentForThirtyDeg) {
                rowIndex--;
                if (isOffsetRow) {
                    columnIndex++;
                }
            }
        }
    }

    return {
        x: columnIndex,
        y: rowIndex
    };
}

function forEachHexagon(board, callback) {
    board.forEach(function (row) {
        if (Array.isArray(row)) {
            row.forEach(callback);
        }
    })
}

function breakfastHexagon(context, hexagon, x, y, size, overrideColor) {
    var color = hexagon.color !== undefined ? hexagon.color : '#ffffff';
    var borderColor = hexagon.borderColor !== undefined ? hexagon.borderColor : 'rgba(0, 0, 0, 0.2)';

    if (overrideColor !== undefined) {
        color = overrideColor;
    }

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

    context.fillStyle = color;
    context.fill();

    context.strokeStyle = borderColor;
    context.stroke();
}

HexagonBoard.prototype.store = function store() {
    if (!window.localStorage) {
        return;
    }
    var serializedBoard = this._serialize(false);
    window.localStorage.setItem(HEXAGON_BOARD_STORAGE_KEY, serializedBoard);
};

HexagonBoard.prototype.load = function load() {
    if (!window.localStorage) {
        return;
    }

    var serializedString = window.localStorage.getItem(HEXAGON_BOARD_STORAGE_KEY);
    var serializedObject;
    try {
        serializedObject= JSON.parse(serializedString);
    } catch (e) {
        console.error('Error loading stored board!', e);
        window.localStorage.removeItem(HEXAGON_BOARD_STORAGE_KEY);
        return;
    }
    this._loadBoard(serializedObject);
};

HexagonBoard.prototype.reset = function reset() {
    if (!window.localStorage) {
        return;
    }

    window.localStorage.removeItem(HEXAGON_BOARD_STORAGE_KEY);
    this._board = [];
    this._currentPatternName = '';
    this.size = DEFAULT_SIZE;
    this.draw();
};

HexagonBoard.prototype._serialize = function _serialize(isFullSerialization) {
    var hexagons = [];
    forEachHexagon(this._board, function (hexagon) {
        hexagons.push(hexagon);
    });

    var serializedObject = {
        board: {
            currentColor: this._currentColor,
            hexagons: hexagons
        }
    };

    if (isFullSerialization) {
        serializedObject.board.name = this._currentPatternName;
        serializedObject.board.size = this.size;
    }
    return JSON.stringify(serializedObject);
};

HexagonBoard.prototype._loadBoard = function _loadBoard(serializedObject) {
    if (!serializedObject) {
        return;
    }
    var serializedBoard = serializedObject.board;

    if (!serializedBoard) {
        return;
    }

    if (serializedBoard.name) {
        this._currentPatternName = serializedBoard.name;
    }

    if (serializedBoard.size) {
        this.size = serializedBoard.size;
    }

    if (serializedBoard.currentColor) {
        this._currentColor = serializedBoard.currentColor;
    }

    var board = [];
    if (Array.isArray(serializedBoard.hexagons)) {
        serializedBoard.hexagons.forEach(function (hexagon) {
            var row = board[hexagon.y];
            if (row === undefined) {
                row = [];
                board[hexagon.y] = row;
            }

            row[hexagon.x] = hexagon;
        });
    }
    this._board = board;
};

module.exports = HexagonBoard;