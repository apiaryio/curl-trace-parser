fs = require 'fs'
assert = require('chai').assert
parser = require '../../src/parser'

describe 'parser module', () ->
  output = ""
  trace = ""

  before (done) ->
    fs.readFile __dirname + '/../fixtures/get/tracefile', (err, data) ->
      done err if err
      trace = data.toString()
      done()

  it "has parse() defined", () ->
     assert.isFunction parser.parse

  describe "parse(string) return", () ->

    before () ->
      output = parser.parse trace

    it "is obejct", () -> 
      assert.isObject output
    
    describe "returned object", () ->
      
      it "has key request", () ->
        assert.include  Object.keys(output), "request"

      it "has key response", () ->
        assert.include Object.keys(output), "response"
      
      describe "parsed request", () ->
        request = ""
        before () -> 
          request = output['request']

        it "contains multiple lines delimited by CRLF", () ->  
          lines = request.split "\r\n"
          assert.isTrue lines.length > 1, 'expected more than 1 item, got: ' + lines.length

        it "contains user agent string", () ->
          agentString = "curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5"
          assert.include request, agentString


        it "does not contain double LF at the end", () ->
            outputChars = request.split ''
            
            lastChars = ""
            lastChars = outputChars.pop() + lastChars
            lastChars = outputChars.pop() + lastChars
            assert.notInclude lastChars, "\n\n"
      
      describe "parsed response", () ->
        response = ""
        before () -> 
          response = output['response']

        it "containt application/json", () ->
          string = "application/json"
          assert.include response, string  

        it "contains multiple lines delimited by CRLF", () ->  
          lines = response.split "\r\n"
          assert.isTrue lines.length > 1, 'expected more than 1 item, got: ' + lines.length
    
  it "has parseToString() defined", () ->
     assert.isFunction parser.parseToString

  describe "parseToString(traceString) return", () ->
    
    before () ->
      output = parser.parseToString trace
    
    it "should have trailing LF as last character to do not brake terminal", () ->
      outputChars = output.split ''
      lastChars = ""
      lastChars = outputChars.pop() + lastChars
      lastChars = outputChars.pop() + lastChars
      assert.include lastChars, "\n"
    
    it "should have Request ended by trailling LF", () ->
      request = []

      for line in output.split('\r\n')
        request.push line if /^> /.test line

      lastLine = request.pop()
      assert.equal lastLine.split('').pop(), '\n'

    it "should have all parsed Request lines leaded by '> '", () ->
      request = parser.parse(trace)['request']
       
      counter = 0
      for line in request.split "\r\n"
        counter++
        needle = '> ' + line
        assert.include output, needle, "Request on line #" + counter.toString() + " does not contain needle."        
   
    it "should have all parsed Response lines leaded by '< '", () ->
      response = parser.parse(trace)['response']
      
      counter = 0
      for line in response.split "\r\n"
        counter++
        needle = '< ' + line
        assert.include output, needle, "Response on line #" + counter.toString() + " does not contain needle." 
  
  describe "parseBackRequestAndResponseFromString(parsedString)", () ->
    parsedObject = {}
    parsedString = ""

    before () ->
      parsedObject = parser.parse trace
      parsedString = parser.parseToString trace
      output = parser.parseBackRequestAndResponseFromString parsedString
    
    it "has parseBackRequestAndResponseFromString() defined", () ->
     assert.isFunction parser.parseBackRequestAndResponseFromString
    
    it "should return object", () ->
      assert.isObject output
    
    describe "returned object", () ->
      it "has key request", () ->
        assert.include  Object.keys(output), "request"

      it "has key response", () ->
        assert.include Object.keys(output), "response"
      
      describe "parsed request", () ->
        request = ""
        before () -> 
          request = output['request']   
        
        it "is a string", () ->
          assert.isString request

        it "is equal to raw genuine request", () ->
          assert.equal request, parsedObject['request']

      describe "parsed response", () ->
        response = ""
        before () -> 
          response = output['response']

        it "is a string", () ->
          assert.isString response
        
        it "is equal to raw genuine response", () ->
          assert.equal response, parsedObject['response']
  
  describe "parseBack(parsedString) ", () ->
    it "is a function", () ->
       assert.isFunction parser.parseBack
    
    it "is an alias for parseBackRequestAndResponseFromString", () -> 
      assert.equal parser.parseBack, parser.parseBackRequestAndResponseFromString

