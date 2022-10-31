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

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}

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
