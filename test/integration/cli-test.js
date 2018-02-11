/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const {assert} = require('chai');
const {exec} = require('child_process');

const cmdPrefix = '';

describe("Command line", function() { 
  describe("parsing from standard input with --raw", function() {
    let stdout = "";
    let stderr = "";
    let exitStatus = "";

    before(function(done) {
      const cmd = 'cat ./test/fixtures/get/tracefile | ' +
            './bin/curl-trace-parser --raw';

      const cli = exec(cmdPrefix + cmd, function(error, out, err) {
        stdout = out;
        stderr = err;
        if (error) {
          exitStatus = error.status;
        }
        return done();
      });

      return cli.on('exit', code => exitStatus = code);
    });

    it("should not return nothing to stderr", () => assert.equal(stderr, ""));

    it("should return with exit code 0", function() {});

    return it("should return parsed body to standard output", function(done) {
      const expectedOutputPath = "./test/fixtures/get/expected-output";
      return fs.readFile(expectedOutputPath, 'utf8', function(err, expected) {
        assert.equal(stdout, expected);
        return done();
      });
    });
  });

  describe("parsing from standard input with --blueprint option", function() {
    let stdout = "";
    let stderr = "";
    let exitStatus = "";

    before(function(done) {
      const cmd = 'cat ./test/fixtures/post/tracefile | ' +
            './bin/curl-trace-parser --blueprint';

      const cli = exec(cmdPrefix + cmd, function(error, out, err) {
        stdout = out;
        stderr = err;
        if (error) {
          exitStatus = error.status;
        }
        return done();
      });

      return cli.on('exit', code => exitStatus = code);
    });

    it("should not return nothing to stderr", () => assert.equal(stderr, ""));

    it("should return with exit code 0", function() {});

    return it("should return parsed body in API Blueprint format to standard output", function(done) {
      const expectedOutputPath = "./test/fixtures/post/expected-output.md";
      return fs.readFile(expectedOutputPath, 'utf8', function(err, expected) {
        assert.equal(stdout, expected);
        return done();
      });
    });
  });

  return describe("no input on stdin and no options", function(){

    let stdout = "";
    let stderr = "";
    let exitStatus = "";

    before(function(done) {
      const cmd =  './bin/curl-trace-parser';
      const cli = exec(cmdPrefix + cmd, function(error, out, err) {
        stdout = out;
        stderr = err;
        if (error) {
          return exitStatus = error.code;
        }
      });


      return cli.on('exit', function(code) {
        exitStatus = code;
        return done();
      });
    });


    it("should exit with status 1", () => assert.equal(exitStatus, 1));

    return it("should return error message to stderr", () => assert.include(stderr, "No input on stdin"));
  });
});
