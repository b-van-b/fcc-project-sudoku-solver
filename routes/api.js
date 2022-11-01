"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    // reject missing values
    if (!(req.body.coordinate && req.body.value)) {
      return res.json({ error: "Required field(s) missing" });
    }
    const row = req.body.coordinate.slice(0, 1);
    const col = req.body.coordinate.slice(1, 2);
    console.log("Coords: " + [row, col]);
    const result = solver.checkPlacement(
      req.body.puzzle,
      row,
      col,
      req.body.value
    );
    res.json(result);
  });

  app.route("/api/solve").post((req, res) => {});
};
