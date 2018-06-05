

function HexagonMatrix() {
  this._board = [];
}

HexagonMatrix.prototype.add = function add(hexagon) {
  let row;
  for (let i = 0; i < this._board.length; i++) {
    const itRow = this._board[i];
    if (itRow.index === hexagon.y) {
      row = itRow;
      break;
    }
  }

  if (row === undefined) {
    row = {
      index: hexagon.y,
      items: [],
    };

    let rowIndex = this._board.length;
    for (let j = 0; j < this._board.length; j++) {
      const iterRow = this._board[j];
      if (row.index < iterRow.index) {
        rowIndex = j;
        break;
      }
    }

    this._board.splice(rowIndex, 0, row);
  }

  let hexIndex = row.items.length;
  for (let k = 0; k < row.items.length; k++) {
    const itHex = row.items[k];
    if (hexagon.x < itHex.x) {
      hexIndex = k;
      break;
    }
  }

  row.items.splice(hexIndex, 0, hexagon);

  let index = -2000000;
  for (let j = 0; j < row.items.length; j++) {
    const hex = row.items[j];

    if (hex) {
      if (hex.x < index) {
        console.warn('No good!');
      }
      index = hex.x;
    } else {
      console.warn('Really not good!');
    }
  }
};

HexagonMatrix.prototype.remove = function remove(hexagonIndex) {
  let rowIndex;
  for (let i = 0; i < this._board.length; i++) {
    const itRow = this._board[i];
    if (itRow.index === hexagonIndex.y) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === undefined) {
    console.warn(`Hexagon index does not match any row for y: ${hexagonIndex.y}`);
    return undefined;
  }

  const row = this._board[rowIndex];

  let deleteIndex;
  for (let j = 0; j < row.items.length; j++) {
    const itHex = row.items[j];
    if (itHex.x === hexagonIndex.x) {
      deleteIndex = j;
      break;
    }
  }

  if (deleteIndex === undefined) {
    console.warn(`Hexagon index does not match any hexagon for x: ${hexagonIndex.x}`);
    return undefined;
  }

  const removedHexagon = row.items[deleteIndex];

  row.items.splice(deleteIndex, 1);

  if (row.items.length === 0) {
    this._board.splice(rowIndex, 1);
  }

  return removedHexagon;
};

HexagonMatrix.prototype.find = function find(hexagonIndex) {
  let row;
  for (let i = 0; i < this._board.length; i++) {
    const itRow = this._board[i];
    if (itRow.index === hexagonIndex.y) {
      row = itRow;
      break;
    }
  }

  if (row === undefined) {
    return undefined;
  }

  let hexagon;
  for (let j = 0; j < row.items.length; j++) {
    const itHex = row.items[j];
    if (itHex.x === hexagonIndex.x) {
      hexagon = itHex;
      break;
    }
  }

  return hexagon;
};

HexagonMatrix.prototype.forEach = function forEach(callback) {
  this._board.forEach((row) => {
    row.items.forEach(callback);
  });
};

export default HexagonMatrix;
