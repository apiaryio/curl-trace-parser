fs = require 'fs'

{assert} = require('chai')
{exec} = require('child_process')
parser = require('../../src/parser')

describe "Javascript API", () ->
  describe "parsing from file", () ->
    
    it "should return expected raw HTTP in format described in Readme", (done) ->
      traceFilePath = "./test/fixtures/get/tracefile"
      expectedOutputPath = "./test/fixtures/get/expected-output"

      fs.readFile traceFilePath, 'utf8', (err,trace) ->
        parsed = parser.parseToString trace  
        fs.readFile expectedOutputPath, 'utf8', (err,expected) ->      
          assert.equal parsed, expected
          done()