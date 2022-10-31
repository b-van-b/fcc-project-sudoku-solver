const rowLetters = "ABCDEFGHI";

class SudokuSolver {
  validate(puzzleString) {
    // returns an object
    // check for string length
    if (puzzleString.length != 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    // check for invalid characters
    if (puzzleString.match(/[^0-9.]/)) {
      return { error: "Invalid characters in puzzle" };
    }
    // otherwise, return success
    return { success: "Puzzle string is valid" };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // reject value out of range (1-9)
    if (value < 1 || value > 9) return { error: "Invalid value" };
    // get coords and return if error
    const coords = this.getCoords(row, column);
    if (coords.error) return coords;
    const [foundRow, foundColumn] = coords;
    // get grid and return if error
    const grid = this.loadString(puzzleString);
    // don't check target cell (allow a value to be placed on itself)
    grid[foundRow][foundColumn] = 0;
    // check for conflicts
    if (this.rowIsOk(grid, foundRow, value)) {
      return { valid: true };
    }
    return { valid: false, conflict: "row" };
  }

  rowIsOk(grid, row, value) {
    // if same value not in row, it's okay
    return grid[row].indexOf(value) == -1;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // reject value out of range (1-9)
    if (value < 1 || value > 9) return { error: "Invalid value" };
    // get coords and return if error
    const coords = this.getCoords(row, column);
    if (coords.error) return coords;
    const [foundRow, foundColumn] = coords;
    // get grid and return if error
    const grid = this.loadString(puzzleString);
    // don't check target cell (allow a value to be placed on itself)
    grid[foundRow][foundColumn] = 0;
    // check for conflicts
    if (this.colIsOk(grid, foundColumn, value)) {
      return { valid: true };
    }
    return { valid: false, conflict: "column" };
  }

  colIsOk(grid, col, value) {
    // if same value in row, it's not okay
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] == value) {
        return false;
      }
    }
    // otherwise, it's okay
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // reject value out of range (1-9)
    if (value < 1 || value > 9) return { error: "Invalid value" };
    // get coords and return if error
    const coords = this.getCoords(row, column);
    if (coords.error) return coords;
    const [foundRow, foundColumn] = coords;
    // get grid and return if error
    const grid = this.loadString(puzzleString);
    // don't check target cell (allow a value to be placed on itself)
    grid[foundRow][foundColumn] = 0;
    // check for conflicts
    if (this.regionIsOk(grid, foundRow, foundColumn, value)) {
      return { valid: true };
    }
    return { valid: false, conflict: "region" };
  }

  regionIsOk(grid, row, col, value) {
    // find top left corner of region
    const startR = Math.floor(row / 3) * 3;
    const startC = Math.floor(col / 3) * 3;
    // look for same value in region
    for (let r = startR; r < startR + 3; r++) {
      for (let c = startC; c < startC + 3; c++) {
        if (grid[r][c] == value) {
          // if found, it's not okay
          return false;
        }
      }
    }
    // otherwise, it's okay
    return true;
  }

  solve(puzzleString) {
    // load grid and return if error
    const grid = this.loadString(puzzleString);
    if (grid.error) return grid;
    // else, run Ariadne's Thread
    const result = this.ariadnesThread(grid);
    // catch and return error
    if (result.error) return result;
    // else, return result converted to string
    return { success: this.writeString(result) };
  }

  ariadnesThread(grid) {
    let recursions = 0;
    const MAX_RECURSIONS = 50000;
  }

  getEmptyCell(grid) {
    // return the first 0-value cell
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] == 0) return [row, col];
      }
    }
    // if none, return [-1,-1]
    return [-1, -1];
  }

  loadString(puzzleString) {
    // return error on invalid puzzleString
    const validation = this.validate(puzzleString);
    if (validation.error) return validation;
    // else, load it into an array
    // load grid row by row
    const grid = [];
    for (let i = 0; i < 9; i++) {
      const row = puzzleString
        .slice(i * 9, i * 9 + 9)
        .split("")
        .map((char) => {
          return char == "." ? 0 : +char;
        });
      grid.push(row);
    }
    // return grid
    return grid;
  }

  writeString(grid) {
    let result = "";
    // add to result row by row, converting '0' to '.'
    for (let row = 0; row < 9; row++) {
      result += grid[row]
        .map((cell) => {
          return cell == 0 ? "." : String(cell);
        })
        .join("");
    }
    return result;
  }

  getCoords(rowString, column) {
    // get user-input coordinates, validate and return internal coords
    const err = { error: "Invalid coordinate" };
    // reject rowString if not exactly one character
    if (rowString.length != 1) return err;
    // read row
    const row = rowLetters.indexOf(rowString);
    // if out of bounds, return error
    if (row < 0 || row > 8 || column < 1 || column > 9) return err;
    // else, return coordinates
    return [row, column - 1];
  }
}

module.exports = SudokuSolver;
