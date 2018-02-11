/* eslint-disable
    no-shadow,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.

const fs = require('fs');

const { assert } = require('chai');
const { exec } = require('child_process');
const parser = require('../../lib/parser');

describe('Javascript API', () =>
  describe('parsing from file', () =>

    it('should return expected raw HTTP in format described in Readme', (done) => {
      const traceFilePath = './test/fixtures/get/tracefile';
      const expectedOutputPath = './test/fixtures/get/expected-output';

      fs.readFile(traceFilePath, 'utf8', (err, trace) => {
        const parsed = parser.parseToString(trace);
        fs.readFile(expectedOutputPath, 'utf8', (err, expected) => {
          assert.equal(parsed, expected);
          done();
        });
      });
    })));
