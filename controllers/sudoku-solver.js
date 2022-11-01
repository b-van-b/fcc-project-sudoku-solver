const rowLetters = "ABCDEFGHI";
const MAX_RECURSIONS = 50000;
let recursions = 0;

class SudokuSolver {
  validate(puzzleString) {
    // returns an object
    // check if puzzle is missing
    if (!puzzleString) {
      return { error: "Required field missing" };
    }
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

  processUserInput(puzzleString, row, column, value) {
    // validate puzzleString first
    const validation = this.validate(puzzleString);
    if (validation.error) return validation;
    // check user input for errors and return useful data if possible
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
    // return data as object
    // convert value from string to integer
    return {
      grid: grid,
      row: foundRow,
      col: foundColumn,
      val: +value,
    };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // process user input
    const input = this.processUserInput(puzzleString, row, column, value);
    // check for errors
    if (input.error) return input;
    // check for conflicts
    if (this.rowIsOk(input.grid, input.row, input.val)) {
      return { valid: true };
    }
    return { valid: false, conflict: "row" };
  }

  rowIsOk(grid, row, value) {
    // if same value not in row, it's okay
    return grid[row].indexOf(value) == -1;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // process user input
    const input = this.processUserInput(puzzleString, row, column, value);
    // check for errors
    if (input.error) return input;
    // check for conflicts
    if (this.colIsOk(input.grid, input.col, input.val)) {
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
    // process user input
    const input = this.processUserInput(puzzleString, row, column, value);
    // check for errors
    if (input.error) return input;
    // check for conflicts
    if (this.regionIsOk(input.grid, input.row, input.col, input.val)) {
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

  allAreOk(grid, row, col, value) {
    return (
      this.rowIsOk(grid, row, value) &&
      this.colIsOk(grid, col, value) &&
      this.regionIsOk(grid, row, col, value)
    );
  }

  solve(puzzleString) {
    // load grid and return if error
    const grid = this.loadString(puzzleString);
    if (grid.error) return grid;
    // else, run Ariadne's Thread
    recursions = 0;
    const result = this.ariadnesThread(grid);
    // catch and return error
    if (!result) return { error: "Unsolvable puzzle" };
    // else, return result converted to string
    return { success: this.writeString(result) };
  }

  ariadnesThread(grid) {
    // don't recurse too much
    recursions++;
    if (recursions >= MAX_RECURSIONS) return false;
    // find the first empty cell in the grid
    const [row, col] = this.getEmptyCell(grid);
    // if grid is filled, it is solved
    if (row == -1) return grid;
    // otherwise, try any values that fit here
    for (let val = 1; val <= 9; val++) {
      // check if the value has no conflicts before recursing
      if (this.allAreOk(grid, row, col, val)) {
        grid[row][col] = val;
        // if not false, pass to the top -- the grid is solved
        if (this.ariadnesThread(grid)) return grid;
      }
    }
    // if no values work, set the cell back to 0 and quit
    grid[row][col] = 0;
    return false;
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
