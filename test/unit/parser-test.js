/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const { assert } = require('chai');
const parser = require('../../lib/parser');

describe('parser module', function() {
  let output = "";
  let trace = "";

  before(done =>
    fs.readFile(__dirname + '/../fixtures/get/tracefile', function(err, data) {
      if (err) { done(err); }
      trace = data.toString();
      return done();
    })
  );

  it("has parse() defined", () => assert.isFunction(parser.parse));

  describe("parse(string) return", function() {

    before(() => output = parser.parse(trace));

    it("is obejct", () => assert.isObject(output));

    return describe("returned object", function() {

      it("has key request", () => assert.include(Object.keys(output), "request"));

      it("has key response", () => assert.include(Object.keys(output), "response"));

      describe("parsed request", function() {
        let request = "";
        before(() => request = output['request']);

        it("contains multiple lines delimited by CRLF", function() {
          const lines = request.split("\r\n");
          return assert.isTrue(lines.length > 1, `expected more than 1 item, got: ${lines.length}`);
        });

        it("contains user agent string", function() {
          const agentString = "curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5";
          return assert.include(request, agentString);
        });


        return it("does not contain double LF at the end", function() {
            const outputChars = request.split('');

            let lastChars = "";
            lastChars = outputChars.pop() + lastChars;
            lastChars = outputChars.pop() + lastChars;
            return assert.notInclude(lastChars, "\n\n");
        });
      });

      return describe("parsed response", function() {
        let response = "";
        before(() => response = output['response']);

        it("containt application/json", function() {
          const string = "application/json";
          return assert.include(response, string);
        });

        return it("contains multiple lines delimited by CRLF", function() {
          const lines = response.split("\r\n");
          return assert.isTrue(lines.length > 1, `expected more than 1 item, got: ${lines.length}`);
        });
      });
    });
  });

  it("has parseToString() defined", () => assert.isFunction(parser.parseToString));

  describe("parseToString(traceString) return", function() {

    before(() => output = parser.parseToString(trace));

    it("should have trailing LF as last character to do not brake terminal", function() {
      const outputChars = output.split('');
      let lastChars = "";
      lastChars = outputChars.pop() + lastChars;
      lastChars = outputChars.pop() + lastChars;
      return assert.include(lastChars, "\n");
    });

    it("should have Request ended by trailling LF", function() {
      const request = [];

      for (let line of Array.from(output.split('\r\n'))) {
        if (/^> /.test(line)) { request.push(line); }
      }

      const lastLine = request.pop();
      return assert.equal(lastLine.split('').pop(), '\n');
    });

    it("should have all parsed Request lines leaded by '> '", function() {
      const request = parser.parse(trace)['request'];

      let counter = 0;
      return (() => {
        const result = [];
        for (let line of Array.from(request.split("\r\n"))) {
          counter++;
          const needle = `> ${line}`;
          result.push(assert.include(output, needle, `Request on line #${counter.toString()} does not contain needle.`));
        }
        return result;
      })();
    });

    return it("should have all parsed Response lines leaded by '< '", function() {
      const response = parser.parse(trace)['response'];

      let counter = 0;
      return (() => {
        const result = [];
        for (let line of Array.from(response.split("\r\n"))) {
          counter++;
          const needle = `< ${line}`;
          result.push(assert.include(output, needle, `Response on line #${counter.toString()} does not contain needle.`));
        }
        return result;
      })();
    });
  });

  describe("parseBackRequestAndResponseFromString(parsedString)", function() {
    let parsedObject = {};
    let parsedString = "";

    before(function() {
      parsedObject = parser.parse(trace);
      parsedString = parser.parseToString(trace);
      return output = parser.parseBackRequestAndResponseFromString(parsedString);
    });

    it("has parseBackRequestAndResponseFromString() defined", () => assert.isFunction(parser.parseBackRequestAndResponseFromString));

    it("should return object", () => assert.isObject(output));

    return describe("returned object", function() {
      it("has key request", () => assert.include(Object.keys(output), "request"));

      it("has key response", () => assert.include(Object.keys(output), "response"));

      describe("parsed request", function() {
        let request = "";
        before(() => request = output['request']);

        it("is a string", () => assert.isString(request));

        return it("is equal to raw genuine request", () => assert.equal(request, parsedObject['request']));
    });

      return describe("parsed response", function() {
        let response = "";
        before(() => response = output['response']);

        it("is a string", () => assert.isString(response));

        return it("is equal to raw genuine response", () => assert.equal(response, parsedObject['response']));
    });
  });
});

  return describe("parseBack(parsedString) ", function() {
    it("is a function", () => assert.isFunction(parser.parseBack));

    return it("is an alias for parseBackRequestAndResponseFromString", () => assert.equal(parser.parseBack, parser.parseBackRequestAndResponseFromString));
  });
});