"use strict";

import ColorList from './colorList.js';
import ApiService from '../js/apiService.js';

import Mustache from 'mustache';

import $ from 'jquery';
import spectrum from 'spectrum-colorpicker/spectrum.js';
import spectrumStyle from 'spectrum-colorpicker/spectrum.css';

import style from './overlay.scss';

import {MDCTemporaryDrawer} from '@material/drawer';
import {MDCDialog} from '@material/dialog';
import {MDCTextField} from '@material/textfield';

function Overlay(overlayContainer, hexagonBoard, router) {
  hexagonBoard.overlay = this;
  this._init(overlayContainer, hexagonBoard, router);
}

Overlay.prototype._init = function _init(overlayContainer, hexagonBoard, router) {

    var colorsCanvas = overlayContainer.querySelector('#colorsCanvas');
    this.colorList = new ColorList(colorsCanvas);

    var drawerContainer = overlayContainer.querySelector('#drawer-menu');
    var drawer = new MDCTemporaryDrawer(drawerContainer);
    var drawerMenuButton = overlayContainer.querySelector('#menu-drawer-button');
    drawerMenuButton.addEventListener('click', function () {
        drawer.open = true;
    });

    var saveAsPatternElm = document.querySelector('#save-as-pattern-dialog');
    var saveAsPatternDialog = new MDCDialog(saveAsPatternElm);

    var patternNameField = new MDCTextField(saveAsPatternElm.querySelector('.mdc-text-field'));

    saveAsPatternDialog.listen('MDCDialog:accept', function() {
        if (patternNameField.value) {
            hexagonBoard.savePatternAs(patternNameField.value).then(function (newPattern) {
              router.push({ name: 'pattern', params: { id: newPattern.id } });
            });
        }
    });

    var drawerItemSave = drawerContainer.querySelector('#drawer-item-save');
    drawerItemSave.addEventListener('click', function () {
        hexagonBoard.savePattern();
    });

    var drawerItemSaveAs = drawerContainer.querySelector('#drawer-item-save-as');
    drawerItemSaveAs.addEventListener('click', function (evt) {
        saveAsPatternDialog.lastFocusedTarget = evt.target;
        saveAsPatternDialog.show();
    });

    var drawerItemExport = drawerContainer.querySelector('#drawer-item-export');
    drawerItemExport.addEventListener('click', function () {
        hexagonBoard.exportPattern();
    });

    var drawerItemRemove = drawerContainer.querySelector('#drawer-item-remove');
    drawerItemRemove.addEventListener('click', function () {
        hexagonBoard.deletePattern().then(() => {
          router.push({name: 'library' });
        });
    });

    var drawerItemLibrary = drawerContainer.querySelector('#drawer-item-library');
    drawerItemLibrary.addEventListener('click', function () {
        router.push({ name: 'library' });
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

export default Overlay;
