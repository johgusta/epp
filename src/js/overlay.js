"use strict";

var ColorList = require('./colorList.js');
var ApiService = require('./apiService.js');

var $ = require('jquery');
require('spectrum-colorpicker/spectrum.js');
require('spectrum-colorpicker/spectrum.css');

function Overlay(overlayContainer, hexagonBoard, currentUser) {
    //this._hexagonBoard = hexagonBoard;
    this._init(overlayContainer, hexagonBoard, currentUser);
}

Overlay.prototype._init = function _init(overlayContainer, hexagonBoard, currentUser) {
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

    if (hexagonBoard.debug === true) {
        var debugContainer = document.createElement('div');
        debugContainer.className = 'debug-container';
        this._debugContainer = debugContainer;
        topLeftContainer.appendChild(debugContainer);
    }

    overlayContainer.appendChild(topLeftContainer);

    var topRightContainer = document.createElement('div');
    topRightContainer.className = 'topRightContainer';

    var userButton = document.createElement('div');
    userButton.className = 'user button';
    topRightContainer.appendChild(userButton);

    var userButtonText = document.createElement('span');
    userButtonText.innerText = 'Log out ' + currentUser.firstname + ' ' +
        currentUser.lastname;
    userButton.appendChild(userButtonText);

    userButton.addEventListener('click', function () {
        console.log('User button clicked!');
        ApiService.logout();
    });

    overlayContainer.appendChild(topRightContainer);


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

    var colorsCanvas = document.createElement('canvas');
    colorsCanvas.className = 'colorsCanvas';
    bottomLeftContainer.appendChild(colorsCanvas);

    this.colorList = new ColorList(colorsCanvas);

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

    var saveButton = document.createElement('div');
    saveButton.className = 'save button';
    saveButton.innerText = 'Save';

    function savePattern(event) {
        event.preventDefault();
        hexagonBoard.savePattern(saveNameInput.value);
    }

    saveButton.addEventListener('click', savePattern);

    innerSaveContainer.appendChild(saveButton);
    innerSaveContainer.addEventListener('submit', savePattern);

    var exportButton = document.createElement('div');
    exportButton.className = 'export button';
    exportButton.innerText = 'Export';
    exportButton.addEventListener('click', function (event) {
        hexagonBoard.exportPattern(saveNameInput.value);
    });
    innerSaveContainer.appendChild(exportButton);

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

    this.colorList.draw(colorList, changeColorCallback);
};

Overlay.prototype.appendDebugText = function appendDebugText(text) {
    if (this._debugContainer === undefined) {
        return;
    }
    if (this._debugVisible !== true) {
        this._debugVisible = true;
        this._debugContainer.style.display = 'block';
    }
    this._debugContainer.innerText = text + '\n' + this._debugContainer.innerText;
};

module.exports = Overlay;