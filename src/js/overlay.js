"use strict";

var $ = require('jquery');
require('spectrum-colorpicker/spectrum.js');
require('spectrum-colorpicker/spectrum.css');

function Overlay(overlayContainer, hexagonBoard) {
    //this._hexagonBoard = hexagonBoard;
    this._init(overlayContainer, hexagonBoard);
}

Overlay.prototype._init = function _init(overlayContainer, hexagonBoard) {
    var topLeftContainer = document.createElement('div');
    topLeftContainer.className = 'topLeftContainer';

    var clearAllButton = document.createElement('div');
    clearAllButton.className = 'clear-all button';
    topLeftContainer.appendChild(clearAllButton);

    var clearAllText = document.createElement('span');
    clearAllText.innerText = 'Clear All';
    clearAllButton.appendChild(clearAllText);

    clearAllButton.addEventListener('click', function () {
        hexagonBoard.reset();
    });

    overlayContainer.appendChild(topLeftContainer);

    var bottomLeftContainer = document.createElement('div');
    bottomLeftContainer.className = 'bottomLeftContainer';
    overlayContainer.appendChild(bottomLeftContainer);

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

    this._colorsDiv = colorsDiv;

    var saveDialogContainer = document.createElement('div');
    saveDialogContainer.className = 'saveDialogContainer';
    overlayContainer.appendChild(saveDialogContainer);


    var innerSaveContainer = document.createElement('form');
    innerSaveContainer.className = 'innerSaveContainer';
    saveDialogContainer.appendChild(innerSaveContainer);

    var saveNameInput = document.createElement('input');
    saveNameInput.className = 'saveName';
    saveNameInput.name = 'saveName';
    saveNameInput.type = 'text';
    saveNameInput.placeholder = 'Enter name';
    saveNameInput.value = '';
    saveNameInput.required = true;
    this._saveNameInput = saveNameInput;

    innerSaveContainer.appendChild(saveNameInput);

    var saveButton = document.createElement('input');
    saveButton.type = 'submit';
    saveButton.className = 'save button';
    saveButton.value = 'Save';
    innerSaveContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        hexagonBoard.savePattern(saveNameInput.value);
    });
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
        hexagonBoard.loadPattern(loadDropDown.value);
    });
    this._loadButton = loadButton;

    innerLoadContainer.appendChild(loadButton);

    var deleteButton = document.createElement('div');
    deleteButton.className = 'delete button';
    var deleteButtonText = document.createElement('span');
    deleteButtonText.innerText = 'Delete';
    deleteButton.appendChild(deleteButtonText);

    deleteButton.addEventListener('click', function () {
        hexagonBoard.deletePattern(loadDropDown.value);
    });
    this._deleteButton = deleteButton;

    innerLoadContainer.appendChild(deleteButton);
};

Overlay.prototype.updateLoadInfo = function updateLoadInfo(savedPatterns, currentName) {
    this._saveNameInput.value = currentName;

    var loadDropDown = this._loadDropDown;
    while(loadDropDown.firstChild){
        loadDropDown.removeChild(loadDropDown.firstChild);
    }

    savedPatterns.forEach(function (pattern) {
        var option = document.createElement('option');
        option.innerText = pattern.name;
        option.value = pattern.name;
        if (currentName === pattern.name) {
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
};

Overlay.prototype.redrawColorList = function redrawColorList(colorList, currentColor, changeColorCallback) {
    var colorsDiv = this._colorsDiv;

    while(colorsDiv.firstChild) {
        colorsDiv.removeChild(colorsDiv.firstChild);
    }

    var that = this;
    $('.colorPicker').spectrum({
        color: currentColor,
        showInitial: true,
        replacerClassName: 'colorInput',
        show: function () {
            that.colorPickerOpen = true;
        },
        change: function(color) {
            changeColorCallback(color.toHexString());
            that.colorPickerOpen = false;
        }
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

module.exports = Overlay;