{assert} = require('chai')
{exec} = require('child_process')

cmdPrefix = ''

describe "Command line", () ->

  describe "parsing from standard input", () ->
    stdout = ""
    stderr = ""
    exitStatus = ""
    
    before (done) ->
      cmd = 'cat ./test/fixtures/httpbin-org-ip | ' +
              './bin/curl-trace-parser'

      cli = exec cmd, (error, out, err) -> 
        cmd =  './bin/curl-trace-parser'
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

    it "should return parsed body to standard output", () ->
      agentString = "curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5"
      assert.include stdout, agentString

  describe "no input on stdin and no options", -> 
    
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
        done()

      cli.on 'exit', (code) ->        
        exitStatus = code
      
    
    it "should exit with status 1", () ->
      assert.equal exitStatus, 1

    it "should return error message to stderr", () ->
      assert.include stderr, "No input on stdin"  

