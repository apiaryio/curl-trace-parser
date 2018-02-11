const fs = require('fs');

const { assert } = require('chai');
const parser = require('../../lib/parser');

describe('Javascript API', () =>
  describe('parsing from file', () =>

    it('should return expected raw HTTP in format described in Readme', (done) => {
      const traceFilePath = './test/fixtures/get/tracefile';
      const expectedOutputPath = './test/fixtures/get/expected-output';

      fs.readFile(traceFilePath, 'utf8', (err, trace) => {
        const parsed = parser.parseToString(trace);
        fs.readFile(expectedOutputPath, 'utf8', (error, expected) => {
          assert.equal(parsed, expected);
          done();
        });
      });
    })));
