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
        done();
      });

      cli.on('exit', (code) => { exitStatus = code; });
    });

    it('should not return nothing to stderr', () => assert.equal(stderr, ''));

    it('should return with exit code 0', () => assert.equal(exitStatus, 0));

    it('should return parsed body to standard output', (done) => {
      const expectedOutputPath = './test/fixtures/get/expected-output';
      fs.readFile(expectedOutputPath, 'utf8', (err, expected) => {
        assert.equal(stdout, expected);
        done();
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
        done();
      });

      cli.on('exit', (code) => { exitStatus = code; });
    });

    it('should not return nothing to stderr', () => assert.equal(stderr, ''));

    it('should return with exit code 0', () => assert.equal(exitStatus, 0));

    it('should return parsed body in API Blueprint format to standard output', (done) => {
      const expectedOutputPath = './test/fixtures/post/expected-output.md';
      fs.readFile(expectedOutputPath, 'utf8', (err, expected) => {
        assert.equal(stdout, expected);
        done();
      });
    });
  });

  describe('no input on stdin and no options', () => {
    let stderr = '';
    let exitStatus = '';

    before((done) => {
      const cmd = './bin/curl-trace-parser';
      const cli = exec(cmdPrefix + cmd, (error, out, err) => {
        stderr = err;
        if (error) {
          exitStatus = error.code;
        }
      });


      cli.on('exit', (code) => {
        exitStatus = code;
        done();
      });
    });


    it('should exit with status 1', () => assert.equal(exitStatus, 1));

    it('should return error message to stderr', () => assert.include(stderr, 'No input on stdin'));
  });
});
