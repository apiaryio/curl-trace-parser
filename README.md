# Parser for output from Curl --trace option

[![Build Status](https://travis-ci.org/apiaryio/curl-trace-parser.png)](https://travis-ci.org/apiaryio/curl-trace-parser)
[![Dependency Status](https://david-dm.org/apiaryio/curl-trace-parser.png)](https://david-dm.org/apiaryio/curl-trace-parser)
[![devDependency Status](https://david-dm.org/apiaryio/curl-trace-parser/dev-status.png)](https://david-dm.org/apiaryio/curl-trace-parser#info=devDependencies)

## The story

Did you know that you can record raw HTTP communication of [Curl command-line tool](http://curl.haxx.se/docs/manpage.html) with `--trace` and `--trace-ascii` option? It's the only way I know to get raw HTTP communication without using [`tcpdump`](http://www.tcpdump.org/) and/or [`wireshark`](http://www.wireshark.org/). 
This trick is very useful for proper introspection into HTTP communication of some not-well documented RESTful API for example. 

The only glitch is that Curl `--trace` saves data in [a bit not straightforward format][gist]. It saves chunks as they come and splits them by packets. If you want to decode it back to human readeble format this parser is your friend. Delivered as Node.js package, so far.

[gist]: https://gist.github.com/netmilk/6048533

## Record your first trace file
    
    $ curl -s -o /dev/null --trace tracefile http://httpbin.org/headers

## Command-line interface

    $ cat tracefile | curl-trace-parser
    GET /headers HTTP/1.1
    User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
    Host: httpbin.org
    Accept: */*

    HTTP/1.1 200 OK
    Content-Type: application/json
    Date: Mon, 01 Jul 2013 15:40:49 GMT
    Server: gunicorn/0.17.4
    Content-Length: 199
    Connection: keep-alive

    {
      "headers": {
        "Host": "httpbin.org",
        "Connection": "close",
        "Accept": "*/*",
        "User-Agent": "curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5"
      }
    }


## Node.JS API

    var fs = require('fs');
    var parser = require('curl-trace-parser');
    fs.readFile('./tracefile', 'utf8', function (err,trace) {
      console.log(parser.parse(trace));
    })

## Installation

    $ npm install -g curl-trace-parser


- - -

NOTE: Quick and dirty, of course... 
