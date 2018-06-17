import $ from 'jquery';
import 'spectrum-colorpicker/spectrum';
import 'spectrum-colorpicker/spectrum.css';

import ColorList from './colorList';

function Overlay(overlayContainer) {
  this._init(overlayContainer);
}

Overlay.prototype._init = function _init(overlayContainer) {
  const colorsCanvas = overlayContainer.querySelector('#colorsCanvas');
  this.colorList = new ColorList(colorsCanvas);
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
