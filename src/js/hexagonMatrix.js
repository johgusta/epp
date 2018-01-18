"use strict";

function HexagonMatrix() {
    this._board = [];
}

HexagonMatrix.prototype.add = function add(hexagon) {
    var row = this._board[hexagon.y];

    if (row === undefined) {
        row = [];
        this._board[hexagon.y] = row;
    }

    row[hexagon.x] = hexagon;
};

HexagonMatrix.prototype.remove = function remove(hexagonIndex) {
    var row = this._board[hexagonIndex.y];

    if (!Array.isArray(row)) {
        return;
    }

    var removedHexagon = row[hexagonIndex.x];

    delete row[hexagonIndex.x];

    return removedHexagon;
};

HexagonMatrix.prototype.find = function find(hexagonIndex) {
    var row = this._board[hexagonIndex.y];

    var hexagon = undefined;
    if (row !== undefined) {
        hexagon = row[hexagonIndex.x];
    }
    return hexagon;
};

HexagonMatrix.prototype.reset = function reset() {
    this._board = [];
};

HexagonMatrix.prototype.forEach = function forEach(callback) {
    this._board.forEach(function (row) {
        if (Array.isArray(row)) {
            row.forEach(callback);
        }
    });
};

module.exports = HexagonMatrix;