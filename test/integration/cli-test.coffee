fs = require('fs')
{assert} = require('chai')
{exec} = require('child_process')

cmdPrefix = ''

describe "Command line", () ->
  before (done) ->
    #CLI is linked with native JS in /lib so re-compile Coffee /src to /lib
    cmd = './scripts/build'
    cli = exec cmdPrefix + cmd, (error, out, err) ->
      if error
        done error
      done()
 
  describe "parsing from standard input with --raw", () ->
    stdout = ""
    stderr = ""
    exitStatus = ""
    
    before (done) ->
      cmd = 'cat ./test/fixtures/get/tracefile | ' +
            './bin/curl-trace-parser --raw'

      cli = exec cmdPrefix + cmd, (error, out, err) -> 
        stdout = out
        stderr = err
        if error
          exitStatus = error.status
        done()

      cli.on 'exit', (code) ->        
        exitStatus = code
          
    it "should not return nothing to stderr", () ->
      assert.equal stderr, ""

    it "should return with exit code 0", () ->

    it "should return parsed body to standard output", (done) ->
      expectedOutputPath = "./test/fixtures/get/expected-output"
      fs.readFile expectedOutputPath, 'utf8', (err, expected) ->      
        assert.equal stdout, expected
        done()

  describe "parsing from standard input with --blueprint option", () ->
    stdout = ""
    stderr = ""
    exitStatus = ""
    
    before (done) ->
      cmd = 'cat ./test/fixtures/post/tracefile | ' +
            './bin/curl-trace-parser --blueprint'

      cli = exec cmdPrefix + cmd, (error, out, err) -> 
        stdout = out
        stderr = err
        if error
          exitStatus = error.status
        done()

      cli.on 'exit', (code) ->        
        exitStatus = code

    it "should not return nothing to stderr", () ->
      assert.equal stderr, ""

    it "should return with exit code 0", () ->

    it "should return parsed body in API Blueprint format to standard output", (done) ->
      expectedOutputPath = "./test/fixtures/post/expected-output.md"
      fs.readFile expectedOutputPath, 'utf8', (err, expected) ->      
        assert.equal stdout, expected
        done()

  describe "no input on stdin and no options", ()-> 
    
    stdout = ""
    stderr = ""
    exitStatus = ""
    
    before (done) ->
      cmd =  './bin/curl-trace-parser'
      cli = exec cmdPrefix + cmd, (error, out, err) -> 
        stdout = out
        stderr = err
        if error
          exitStatus = error.code
        

      cli.on 'exit', (code) ->        
        exitStatus = code
        done()
      
    
    it "should exit with status 1", () ->
      assert.equal exitStatus, 1

    it "should return error message to stderr", () ->
      assert.include stderr, "No input on stdin"  

