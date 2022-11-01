const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;

const testPuzzle = {
  string:
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
  row: "A",
  col: "2",
  coord: "A2",
  singleBadValue: "1",
  doubleBadValue: "3",
  allBadValue: "9",
  goodValue: "6",
};

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    const [puzzle, solution] = puzzlesAndSolutions[0];
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.solution,
          solution,
          "Should return a valid solution"
        );
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Required field missing",
          "Should return an error"
        );
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    const [puzzle, solution] = puzzlesAndSolutions[0];
    const badPuzzle = "#" + puzzle.slice(1);
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: badPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Invalid characters in puzzle",
          "Should return an error"
        );
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    const [puzzle, solution] = puzzlesAndSolutions[0];
    const badPuzzle = puzzle.slice(1);
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: badPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
          "Should return an error"
        );
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    const [puzzle, solution] = puzzlesAndSolutions[0];
    const badPuzzle = "88" + puzzle.slice(2);
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: badPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Puzzle cannot be solved",
          "Should return an error"
        );
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: testPuzzle.coord,
        value: testPuzzle.goodValue,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true, "Should return { 'valid': true }");
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: testPuzzle.coord,
        value: testPuzzle.singleBadValue,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false, "Should return 'valid': false");
        assert.property(
          res.body,
          "conflict",
          "Should have property 'conflict'"
        );
        assert.lengthOf(
          res.body.conflict,
          1,
          "Length of conflict array should be 1"
        );
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: testPuzzle.coord,
        value: testPuzzle.doubleBadValue,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false, "Should return 'valid': false");
        assert.property(
          res.body,
          "conflict",
          "Should have property 'conflict'"
        );
        assert.lengthOf(
          res.body.conflict,
          2,
          "Length of conflict array should be 2"
        );
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: testPuzzle.coord,
        value: testPuzzle.allBadValue,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false, "Should return 'valid': false");
        assert.property(
          res.body,
          "conflict",
          "Should have property 'conflict'"
        );
        assert.lengthOf(
          res.body.conflict,
          3,
          "Length of conflict array should be 3"
        );
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: testPuzzle.coord,
        value: "",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(
          res.body,
          { error: "Required field(s) missing" },
          "Should return error"
        );
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string.replace(".", "$"),
        coordinate: testPuzzle.coord,
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(
          res.body,
          { error: "Invalid characters in puzzle" },
          "Should return error"
        );
        done();
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string.slice(5),
        coordinate: testPuzzle.coord,
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(
          res.body,
          { error: "Expected puzzle to be 81 characters long" },
          "Should return error"
        );
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: "K0",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(
          res.body,
          { error: "Invalid coordinate" },
          "Should return error"
        );
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testPuzzle.string,
        coordinate: testPuzzle.coord,
        value: "0",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(
          res.body,
          { error: "Invalid value" },
          "Should return error"
        );
        done();
      });
  });
});
