const fs = require('fs');
const { assert } = require('chai');
const parser = require('../../lib/parser');

describe('parser module', () => {
  let output = '';
  let trace = '';

  before(done =>
    fs.readFile(`${__dirname}/../fixtures/get/tracefile`, (err, data) => {
      if (err) { done(err); }
      trace = data.toString();
      done();
    }));

  it('has parse() defined', () => assert.isFunction(parser.parse));

  describe('parse(string) return', () => {
    before(() => { output = parser.parse(trace); });

    it('is obejct', () => assert.isObject(output));

    describe('returned object', () => {
      it('has key request', () => assert.include(Object.keys(output), 'request'));

      it('has key response', () => assert.include(Object.keys(output), 'response'));

      describe('parsed request', () => {
        let request = '';
        before(() => { ({ request } = output); });

        it('contains multiple lines delimited by CRLF', () => {
          const lines = request.split('\r\n');
          assert.isTrue(lines.length > 1, `expected more than 1 item, got: ${lines.length}`);
        });

        it('contains user agent string', () => {
          const agentString = 'curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5';
          assert.include(request, agentString);
        });

        it('does not contain double LF at the end', () => {
          const outputChars = request.split('');

          let lastChars = '';
          lastChars = outputChars.pop() + lastChars;
          lastChars = outputChars.pop() + lastChars;
          assert.notInclude(lastChars, '\n\n');
        });
      });

      describe('parsed response', () => {
        let response = '';
        before(() => { ({ response } = output); });

        it('containt application/json', () => {
          const string = 'application/json';
          assert.include(response, string);
        });

        it('contains multiple lines delimited by CRLF', () => {
          const lines = response.split('\r\n');
          assert.isTrue(lines.length > 1, `expected more than 1 item, got: ${lines.length}`);
        });
      });
    });
  });

  it('has parseToString() defined', () => assert.isFunction(parser.parseToString));

  describe('parseToString(traceString) return', () => {
    before(() => { output = parser.parseToString(trace); });

    it('should have trailing LF as last character to do not brake terminal', () => {
      const outputChars = output.split('');
      let lastChars = '';
      lastChars = outputChars.pop() + lastChars;
      lastChars = outputChars.pop() + lastChars;
      assert.include(lastChars, '\n');
    });

    it('should have Request ended by trailling LF', () => {
      const request = [];

      for (const line of output.split('\r\n')) {
        if (/^> /.test(line)) { request.push(line); }
      }

      const lastLine = request.pop();
      assert.equal(lastLine.split('').pop(), '\n');
    });

    it("should have all parsed Request lines leaded by '> '", () => {
      const { request } = parser.parse(trace);

      let counter = 0;
      for (const line of request.split('\r\n')) {
        counter++;
        const needle = `> ${line}`;
        assert.include(output, needle, `Request on line #${counter.toString()} does not contain needle.`);
      }
    });

    it("should have all parsed Response lines leaded by '< '", () => {
      const { response } = parser.parse(trace);

      let counter = 0;
      for (const line of response.split('\r\n')) {
        counter++;
        const needle = `< ${line}`;
        assert.include(output, needle, `Response on line #${counter.toString()} does not contain needle.`);
      }
    });
  });

  describe('parseBackRequestAndResponseFromString(parsedString)', () => {
    let parsedObject = {};
    let parsedString = '';

    before(() => {
      parsedObject = parser.parse(trace);
      parsedString = parser.parseToString(trace);
      output = parser.parseBackRequestAndResponseFromString(parsedString);
    });

    it('has parseBackRequestAndResponseFromString() defined', () => assert.isFunction(parser.parseBackRequestAndResponseFromString));

    it('should return object', () => assert.isObject(output));

    describe('returned object', () => {
      it('has key request', () => assert.include(Object.keys(output), 'request'));

      it('has key response', () => assert.include(Object.keys(output), 'response'));

      describe('parsed request', () => {
        let request = '';
        before(() => { ({ request } = output); });

        it('is a string', () => assert.isString(request));

        it('is equal to raw genuine request', () => assert.equal(request, parsedObject.request));
      });

      describe('parsed response', () => {
        let response = '';
        before(() => { ({ response } = output); });

        it('is a string', () => assert.isString(response));

        it('is equal to raw genuine response', () => assert.equal(response, parsedObject.response));
      });
    });
  });

  describe('parseBack(parsedString) ', () => {
    it('is a function', () => assert.isFunction(parser.parseBack));

    it('is an alias for parseBackRequestAndResponseFromString', () => assert.equal(parser.parseBack, parser.parseBackRequestAndResponseFromString));
  });
});
