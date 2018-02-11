/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');

const {assert} = require('chai');
const {exec} = require('child_process');
const parser = require('../../lib/parser');

describe("Javascript API", () =>
  describe("parsing from file", () =>

    it("should return expected raw HTTP in format described in Readme", function(done) {
      const traceFilePath = "./test/fixtures/get/tracefile";
      const expectedOutputPath = "./test/fixtures/get/expected-output";

      return fs.readFile(traceFilePath, 'utf8', function(err,trace) {
        const parsed = parser.parseToString(trace);
        return fs.readFile(expectedOutputPath, 'utf8', function(err,expected) {
          assert.equal(parsed, expected);
          return done();
        });
      });
    })
  )
);
