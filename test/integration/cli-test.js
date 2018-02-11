/* eslint-disable
    no-return-assign,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const { assert } = require('chai');
const { exec } = require('child_process');

const cmdPrefix = '';

describe('Command line', () => {
  describe('parsing from standard input with --raw', () => {
    let stdout = '';
    let stderr = '';
    let exitStatus = '';

    before((done) => {
      const cmd = 'cat ./test/fixtures/get/tracefile | ' +
            './bin/curl-trace-parser --raw';

      const cli = exec(cmdPrefix + cmd, (error, out, err) => {
        stdout = out;
        stderr = err;
        if (error) {
          exitStatus = error.status;
        }
        return done();
      });

      return cli.on('exit', code => exitStatus = code);
    });

    it('should not return nothing to stderr', () => assert.equal(stderr, ''));

    it('should return with exit code 0', () => {});

    return it('should return parsed body to standard output', (done) => {
      const expectedOutputPath = './test/fixtures/get/expected-output';
      return fs.readFile(expectedOutputPath, 'utf8', (err, expected) => {
        assert.equal(stdout, expected);
        return done();
      });
    });
  });

  describe('parsing from standard input with --blueprint option', () => {
    let stdout = '';
    let stderr = '';
    let exitStatus = '';

    before((done) => {
      const cmd = 'cat ./test/fixtures/post/tracefile | ' +
            './bin/curl-trace-parser --blueprint';

      const cli = exec(cmdPrefix + cmd, (error, out, err) => {
        stdout = out;
        stderr = err;
        if (error) {
          exitStatus = error.status;
        }
        return done();
      });

      return cli.on('exit', code => exitStatus = code);
    });

    it('should not return nothing to stderr', () => assert.equal(stderr, ''));

    it('should return with exit code 0', () => {});

    return it('should return parsed body in API Blueprint format to standard output', (done) => {
      const expectedOutputPath = './test/fixtures/post/expected-output.md';
      return fs.readFile(expectedOutputPath, 'utf8', (err, expected) => {
        assert.equal(stdout, expected);
        return done();
      });
    });
  });

  return describe('no input on stdin and no options', () => {
    let stdout = '';
    let stderr = '';
    let exitStatus = '';

    before((done) => {
      const cmd = './bin/curl-trace-parser';
      const cli = exec(cmdPrefix + cmd, (error, out, err) => {
        stdout = out;
        stderr = err;
        if (error) {
          return exitStatus = error.code;
        }
      });


      return cli.on('exit', (code) => {
        exitStatus = code;
        return done();
      });
    });


    it('should exit with status 1', () => assert.equal(exitStatus, 1));

    return it('should return error message to stderr', () => assert.include(stderr, 'No input on stdin'));
  });
});
