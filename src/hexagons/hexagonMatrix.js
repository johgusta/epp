"use strict";

function HexagonMatrix() {
    this._board = [];
}

HexagonMatrix.prototype.add = function add(hexagon) {
    var row;
    for (var i = 0; i < this._board.length; i++) {
        var itRow = this._board[i];
        if (itRow.index === hexagon.y) {
            row = itRow;
            break;
        }
    }

    if (row === undefined) {
        row = {
            index: hexagon.y,
            items: []
        };

        var rowIndex = this._board.length;
        for (i = 0; i < this._board.length; i++) {
            itRow = this._board[i];
            if (row.index < itRow.index) {
                rowIndex = i;
                break;
            }
        }

        this._board.splice(rowIndex, 0, row);
    }

    var hexIndex = row.items.length;
    for (i = 0; i < row.items.length; i++) {
        var itHex = row.items[i];
        if (hexagon.x < itHex.x) {
            hexIndex = i;
            break;
        }
    }

    row.items.splice(hexIndex, 0, hexagon);

    var index = -2000000;
    for (var j = 0; j < row.items.length; j++) {
        var hex = row.items[j];

        if (hex === undefined) {
            console.warn('Really not good!');
            continue;
        }
        if (hex.x < index) {
            console.warn('No good!');
        }
        index = hex.x;
    }
};

HexagonMatrix.prototype.remove = function remove(hexagonIndex) {
    var rowIndex;
    for (var i = 0; i < this._board.length; i++) {
        var itRow = this._board[i];
        if (itRow.index === hexagonIndex.y) {
            rowIndex = i;
            break;
        }
    }

    if (rowIndex === undefined) {
        console.warn('Hexagon index does not match any row for y: ' + hexagonIndex.y);
        return;
    }

    var row = this._board[rowIndex];

    var deleteIndex;
    for (i = 0; i < row.items.length; i++) {
        var itHex = row.items[i];
        if (itHex.x === hexagonIndex.x) {
            deleteIndex = i;
            break;
        }
    }

    if (deleteIndex === undefined) {
        console.warn('Hexagon index does not match any hexagon for x: ' + hexagonIndex.x);
        return;
    }

    var removedHexagon = row.items[deleteIndex];

    row.items.splice(deleteIndex, 1);

    if (row.items.length === 0) {
        this._board.splice(rowIndex, 1);
    }

    return removedHexagon;
};

HexagonMatrix.prototype.find = function find(hexagonIndex) {
    var row;
    for (var i = 0; i < this._board.length; i++) {
        var itRow = this._board[i];
        if (itRow.index === hexagonIndex.y) {
            row = itRow;
            break;
        }
    }

    if (row === undefined) {
        return undefined;
    }

    var hexagon;
    for (var j = 0; j < row.items.length; j++) {
        var itHex = row.items[j];
        if (itHex.x === hexagonIndex.x) {
            hexagon = itHex;
            break;
        }
    }

    return hexagon;
};

HexagonMatrix.prototype.forEach = function forEach(callback) {
    this._board.forEach(function (row) {
        row.items.forEach(callback);
    });
};

export {HexagonMatrix};