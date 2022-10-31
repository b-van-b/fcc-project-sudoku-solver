const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
let solver = new Solver();
const testPuzzle = {
  string: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
  row: 'A',
  col: 2,
  badValue: 9,
  goodValue: 6
};

suite("Unit Tests", () => {
  suite("#validate(puzzleString)", () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
      puzzlesAndSolutions.forEach(([puzzle, solution]) => {
        assert.deepEqual(
          solver.validate(puzzle),
          { success: "Puzzle string is valid" },
          "Should return success for a valid puzzle string"
        );
      });
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    });

    test("Logic handles a puzzle string that is not 81 characters in length", () => {
    });
  });

  suite(
    "#checkRowPlacement(puzzleString, row, column, value)",
    () => {
      test("Logic handles a valid row placement", () => {});

      test("Logic handles an invalid row placement", () => {});
    }
  );

  suite(
    "#checkColPlacement(puzzleString, row, column, value)",
    () => {
      test("Logic handles a valid column placement", () => {});

      test("Logic handles an invalid column placement", () => {});
    }
  );

  suite(
    "#checkRegionPlacement(puzzleString, row, column, value)",
    () => {
      test("Logic handles a valid region (3x3 grid) placement", () => {});

      test("Logic handles an invalid region (3x3 grid) placement", () => {});
    }
  );

  suite("#solve(puzzleString)", () => {
    test("Valid puzzle strings pass the solver", () => {});

    test("Invalid puzzle strings fail the solver", () => {});

    test("Solver returns the expected solution for an incomplete puzzle", () => {});
  });
});
