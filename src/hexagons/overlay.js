"use strict";

import {ColorList} from './colorList.js';
import {ApiService} from '../js/apiService.js';

import Mustache from 'mustache';

import $ from 'jquery';
import spectrum from 'spectrum-colorpicker/spectrum.js';
import spectrumStyle from 'spectrum-colorpicker/spectrum.css';

import overlayTemplate from './overlay.html';
import style from './overlay.css';

import {MDCTemporaryDrawer} from '@material/drawer';

function Overlay(overlayContainer, hexagonBoard) {
    this._init(overlayContainer, hexagonBoard);
}

Overlay.prototype._init = function _init(overlayContainer, hexagonBoard) {

    var renderedTemplate = Mustache.render(overlayTemplate, {
        username: hexagonBoard.currentUser.fullName,
        pattern: {
            name: hexagonBoard.patternTitle
        }
    });

    overlayContainer.innerHTML = renderedTemplate;

    var colorsCanvas = overlayContainer.querySelector('#colorsCanvas');
    this.colorList = new ColorList(colorsCanvas);

    var drawer = new MDCTemporaryDrawer(overlayContainer.querySelector('#drawer-menu'));
    var drawerMenuButton = overlayContainer.querySelector('#menu-drawer-button');
    drawerMenuButton.addEventListener('click', function () {
        drawer.open = true;
    });
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

export {Overlay};