# Parser for output from Curl --trace option

![Circle CI status badge](https://circleci.com/gh/apiaryio/curl-trace-parser.png?circle-token=42b3d77605312e8c40381c714068415f7ca14d27) 

[**SEE WHY TESTS ARE FAILING!!!**](https://github.com/apiaryio/curl-trace-parser/blob/master/test/integration/cli-test.coffee#L3)

Did you know that you can record raw HTTP communication of [Curl command-line tool](http://curl.haxx.se/docs/manpage.html) with `--trace` and `--trace-ascii` option? It's the only way I know to get raw HTTP communication without using [`tcpdump`](http://www.tcpdump.org/) and/or [`wireshark`](http://www.wireshark.org/). 
This trick is very useful for proper introspection into HTTP communication of some not-well documented RESTful API for example. 

The only glitch is that Curl `--trace` saves data in a bit obfuscated format. It saves chunks as they come and splits them by packets. If you want to decode it back to human readeble format this parser is your friend. Delivered as Node.js package, so far.

    $ npm install -g git+ssh://git@github.com:apiaryio/curl-trace-parser.git
    $ curl -s -o /dev/null --trace tracefile http://httpbin.org/headers
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

    
---    
NOTE: Quick and dirty, of course... 
