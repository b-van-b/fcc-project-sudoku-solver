"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    // reject missing coords, value or puzzle
    if (!(req.body.coordinate && req.body.value && req.body.puzzle)) {
      return res.json({ error: "Required field(s) missing" });
    }
    // row = all letters on the left
    // col = all digits on the right
    const row = (req.body.coordinate.match(/^[A-Z]+/i) || [
      "",
    ])[0].toUpperCase();
    const col = (req.body.coordinate.match(/\d+$/i) || [""])[0];
    // reject if row or col could not be extracted
    if (!(row && col)) {
      return res.json({ error: "Invalid coordinate" });
    }
    // attempt to read value; reject if non-integer
    const val = Number(req.body.value);
    if (!val) return res.json({ error: "Invalid value" });
    // otherwise, send to solver
    console.log("Coords: " + [row, col]);
    const result = solver.checkPlacement(req.body.puzzle, row, col, val);
    res.json(result);
  });

  app.route("/api/solve").post((req, res) => {
    const result = solver.solve(req.body.puzzle);
    console.log("Result: " + JSON.stringify(result));
    res.json(result);
  });
};
