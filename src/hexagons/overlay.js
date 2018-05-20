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

    var drawerContainer = overlayContainer.querySelector('#drawer-menu');
    var drawer = new MDCTemporaryDrawer(drawerContainer);
    var drawerMenuButton = overlayContainer.querySelector('#menu-drawer-button');
    drawerMenuButton.addEventListener('click', function () {
        drawer.open = true;
    });

    var drawerItemSave = drawerContainer.querySelector('#drawer-item-save');
    drawerItemSave.addEventListener('click', function () {
        hexagonBoard.savePattern(hexagonBoard.patternTitle);
    });

    var drawerItemSaveAs = drawerContainer.querySelector('#drawer-item-save-as');
    drawerItemSaveAs.addEventListener('click', function () {
        hexagonBoard.savePattern(hexagonBoard.patternTitle);
    });

    var drawerItemExport = drawerContainer.querySelector('#drawer-item-export');
    drawerItemExport.addEventListener('click', function () {
        hexagonBoard.exportPattern();
    });

    var drawerItemRemove = drawerContainer.querySelector('#drawer-item-remove');
    drawerItemRemove.addEventListener('click', function () {
        hexagonBoard.deletePattern();
    });

    var drawerItemSignOut = drawerContainer.querySelector('#drawer-item-sign-out');
    drawerItemSignOut.addEventListener('click', function () {
        ApiService.logout();
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