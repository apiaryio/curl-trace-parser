fs = require 'fs'
assert = require('chai').assert
parser = require '../../src/parser'

describe 'parser module', () ->

  it "has parse() defined", () ->
     assert.isFunction parser.parse

  describe "parse() return", () ->
    output = ""
    trace = ""

    before (done) ->
      fs.readFile __dirname + '/../fixtures/httpbin-org-ip', (err, data) ->
        done err if err
        
        trace = data.toString()
        output = parser.parse(trace)
        done()

    it "is string", () -> 
      assert.isString output
    
    it "multiple lines delimited by CRLF", ->  
      lines = output.split("\r\n")
      assert.isTrue lines.length > 1, 'expected more than 1 item, got: ' + lines.length

    it "contains user agent string", ->
      agentString = "curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5"
      assert.include output, agentString


    

