fs = require 'fs'

{assert} = require('chai')
{exec} = require('child_process')
{parse} = require('../../src/parser')

describe "Javascript API", () ->
  describe "parsing from file", () ->
    
    it "should return expected raw HTTP", (done) ->
      traceFilePath = "./test/fixtures/httpbin-org-ip"
      expectedOutputPath = "./test/fixtures/expected-output"

      fs.readFile traceFilePath, 'utf8', (err,trace) ->
        parsed = parse trace  
        fs.readFile expectedOutputPath, 'utf8', (err,expected) ->      
          assert.equal parsed, expected
          done()