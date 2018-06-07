import $ from 'jquery';
import 'spectrum-colorpicker/spectrum';
import 'spectrum-colorpicker/spectrum.css';

import { MDCTemporaryDrawer } from '@material/drawer';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';

import router from '@/router';

import FirebaseHelper from '@/js/firebaseHelper';
import ColorList from './colorList';

function Overlay(overlayContainer, hexagonBoard) {
  hexagonBoard.overlay = this;
  this._init(overlayContainer, hexagonBoard, router);
}

Overlay.prototype._init = function _init(overlayContainer, hexagonBoard) {
  const colorsCanvas = overlayContainer.querySelector('#colorsCanvas');
  this.colorList = new ColorList(colorsCanvas);

  const drawerContainer = overlayContainer.querySelector('#drawer-menu');
  const drawer = new MDCTemporaryDrawer(drawerContainer);
  const drawerMenuButton = overlayContainer.querySelector('#menu-drawer-button');
  drawerMenuButton.addEventListener('click', () => {
    drawer.open = true;
  });

  const saveAsPatternElm = document.querySelector('#save-as-pattern-dialog');
  const saveAsPatternDialog = new MDCDialog(saveAsPatternElm);

  const patternNameField = new MDCTextField(saveAsPatternElm.querySelector('.mdc-text-field'));

  saveAsPatternDialog.listen('MDCDialog:accept', () => {
    if (patternNameField.value) {
      hexagonBoard.savePatternAs(patternNameField.value).then((newPattern) => {
        router.push({ name: 'pattern', params: { id: newPattern.id } });
      });
    }
  });

  const drawerItemSave = drawerContainer.querySelector('#drawer-item-save');
  drawerItemSave.addEventListener('click', () => {
    hexagonBoard.savePattern();
  });

  const drawerItemSaveAs = drawerContainer.querySelector('#drawer-item-save-as');
  drawerItemSaveAs.addEventListener('click', (evt) => {
    saveAsPatternDialog.lastFocusedTarget = evt.target;
    saveAsPatternDialog.show();
  });

  const drawerItemExport = drawerContainer.querySelector('#drawer-item-export');
  drawerItemExport.addEventListener('click', () => {
    hexagonBoard.exportPattern();
  });

  const drawerItemRemove = drawerContainer.querySelector('#drawer-item-delete');
  drawerItemRemove.addEventListener('click', () => {
    hexagonBoard.deletePattern().then(() => {
      router.push({ name: 'library' });
    });
  });

  const drawerItemLibrary = drawerContainer.querySelector('#drawer-item-library');
  drawerItemLibrary.addEventListener('click', () => {
    router.push({ name: 'library' });
  });

  const drawerItemSignOut = drawerContainer.querySelector('#drawer-item-sign-out');
  drawerItemSignOut.addEventListener('click', () => {
    FirebaseHelper.signOut().then(() => {
      router.push({ name: 'home' });
    });
  });
};

Overlay.prototype.redrawColorList =
function redrawColorList(colorList, currentColor, changeColorCallback) {
  const that = this;
  $('.colorPicker').spectrum({
    color: currentColor,
    showInitial: true,
    replacerClassName: 'colorInput',
    show() {
      that.colorPickerOpen = true;
    },
    change(color) {
      changeColorCallback(color.toHexString());
      that.colorPickerOpen = false;
    },
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
  this._debugContainer.innerText = `${text}\n${this._debugContainer.innerText}`;
};

export default Overlay;
