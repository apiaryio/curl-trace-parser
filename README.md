
# Parser for output from Curl --trace option

[![Build Status](https://travis-ci.org/apiaryio/curl-trace-parser.png)](https://travis-ci.org/apiaryio/curl-trace-parser)
[![Dependency Status](https://david-dm.org/apiaryio/curl-trace-parser.png)](https://david-dm.org/apiaryio/curl-trace-parser)
[![devDependency Status](https://david-dm.org/apiaryio/curl-trace-parser/dev-status.png)](https://david-dm.org/apiaryio/curl-trace-parser#info=devDependencies)

# API NOT STABLE, YET!

## The story

Did you know that you can record raw HTTP communication of [Curl command-line tool](http://curl.haxx.se/docs/manpage.html) with `--trace` and `--trace-ascii` option? It's the only way I know to get raw HTTP communication without using [`tcpdump`](http://www.tcpdump.org/) and/or [`wireshark`](http://www.wireshark.org/). 
This trick is very useful for proper introspection into HTTP communication of some not-well documented RESTful API for example. 

The only glitch is that Curl `--trace` saves data in [a bit not straightforward format][gist]. It saves chunks as they come and splits them by packets. If you want to decode it back to human readeble format this parser is your friend. Delivered as Node.js package, so far.

[gist]: https://gist.github.com/netmilk/6048533


## Api mock

For example purposes I created [API documentation an API mock][apiarydoc] on Apiary.

[apiarydoc]: http://docs.curltraceparser.apiary.io/

## Record your first trace file
    
    $ curl --trace tracefile --header "Content-Type: application/json" \
     --request POST \
     --data-binary "{ \"product\":\"1AB23ORM\", \"quantity\": 2 }" \
     "http://curltraceparser.apiary.io/shopping-cart"

Curl example iss pasted from [Apiary interactive API documentation][example].

[example]: http://docs.curltraceparser.apiary.io/#get-%2Fshopping-cart

## Command-line interface

    $ cat tracefile | curl-trace-parser
    GET /shopping-cart HTTP/1.1
    User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5
    Host: curltraceparser.apiary.io
    Accept: */*

    HTTP/1.1 200 OK
    Content-Type: application/json
    Date: Sun, 21 Jul 2013 13:23:55 GMT
    X-Apiary-Ratelimit-Limit: 120
    X-Apiary-Ratelimit-Remaining: 119
    Content-Length: 119
    Connection: keep-alive

    { "items": [
    { "url": "/shopping-cart/1", "product":"2ZY48XPZ", "quantity": 1, "name": "New socks", "price": 1.25 }
    ] }

## Node.JS API

    var fs = require('fs');
    var parser = require('curl-trace-parser');
    fs.readFile('./tracefile', 'utf8', function (err,trace) {
      console.log(parser.parse(trace));
    })

## Installation

    $ npm install -g curl-trace-parser


## Output format (TBD)

Output is ASCII representation of raw [HTTP message][message] with few modifications:

- Both Request and Response has extra trailing CR+LF

[message]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html
