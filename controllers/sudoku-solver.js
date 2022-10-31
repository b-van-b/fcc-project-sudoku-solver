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
}

module.exports = SudokuSolver;
