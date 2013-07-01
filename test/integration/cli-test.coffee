{assert} = require('chai')

# FIXME Note on failing tests: I don't know how to run NVM node binary 
# from node process.spawn() via hashbang  and /usr/bin/env. It fails 
# because "no such file or direcotry". Help, or tso be fixed later.
cmdWrapper = 'bash -c '

describe "Command line", () ->

  describe "parsing from standard input", () ->
    baseCmd = 'cat ' + 
              process.cwd() + '/test/fixtures/httpbin-org-ip | ' +
              process.cwd() + '/bin/curl-trace-parser'
    cmd = cmdWrapper + baseCmd 

    stdout = ""
    stderr = ""
    exitStatus = ""
    
    before (done) ->
      
      cli = require('child_process').spawn(cmd)

      cli.stderr.on 'data', (data) ->
        stderr += data

      cli.stdout.on 'data', (data) ->
        stdout += data

      cli.on 'exit', (code) ->        
        exitStatus = code
        done()
    
    it "should not return nothing to stderr", () ->
      assert.equal stderr, ""

    it "should return with exit code 0", () ->

    it "should return parsed body to standard output", () ->
      agentString = "curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5"
      assert.include stdout, agentString

  describe "no input on stdin and no options", -> 

    baseCmd =  process.cwd() + '/bin/curl-trace-parser'
    cmd = cmdWrapper + baseCmd 
    

    stdout = ""
    stderr = ""
    exitStatus = ""
    
    before (done) ->

      cli = require('child_process').spawn(cmd)

      cli.stderr.on 'data', (data) ->
        stderr += data

      cli.stdout.on 'data', (data) ->
        stdout += data

      cli.on 'exit', (code) ->        
        exitStatus = code
        done()
    
    it "should exit with status 1", () ->
      assert.equal exitStatus, 1

    it "should return error message to stderr", () ->
      assert.include stderr, "No input on stdin"  

