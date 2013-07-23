# The `curl --trace` parser

[![Build Status](https://travis-ci.org/apiaryio/curl-trace-parser.png)](https://travis-ci.org/apiaryio/curl-trace-parser)
[![Dependency Status](https://david-dm.org/apiaryio/curl-trace-parser.png)](https://david-dm.org/apiaryio/curl-trace-parser)
[![devDependency Status](https://david-dm.org/apiaryio/curl-trace-parser/dev-status.png)](https://david-dm.org/apiaryio/curl-trace-parser#info=devDependencies)

### API NOT STABLE, YET!

## The story

Did you know that you can record raw HTTP communication of [Curl command-line tool](http://curl.haxx.se/docs/manpage.html) with the `--trace` and `--trace-ascii` option? It's the only way I know to get raw HTTP communication without using the [`tcpdump`](http://www.tcpdump.org/) or [`wireshark`](http://www.wireshark.org/). 
For example, this trick is very useful for the proper introspection into HTTP communication of an undocumented RESTful API.

The only glitch is that cURL `--trace` saves data in its [not human-friendly format][gist] saving chunks as they are being received and splitting them by packets. If you want to decode it back to a human readable format this parser is what you need. Delivered as a Node.js package. 

[gist]: https://gist.github.com/netmilk/6048533

## Example

We will be using this [sample API][apiarydoc] created with the [Apiary.io mock server](http://apiary.io) to demonstrate tracing an HTTP communication and the use of the cURL trace parser.

[apiarydoc]: http://docs.curltraceparser.apiary.io/

## Install the cURL trace parser

```bash
$ npm install -g curl-trace-parser
```

## Record your first trace file
    
```bash
$ curl --trace tracefile --header "Content-Type: application/json" \
--request POST \
--data-binary "{ \"product\":\"1AB23ORM\", \"quantity\": 2 }" \
"http://curltraceparser.apiary.io/shopping-cart"
```

Note this cURL example is copied and pasted from [Apiary interactive API documentation][example].

[example]: http://docs.curltraceparser.apiary.io/#get-%2Fshopping-cart

## Parse the trace file from command line

```bash
$ cat tracefile | curl-trace-parser
> GET /shopping-cart HTTP/1.1
> User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5
> Host: curltraceparser.apiary.io
> Accept: */*
> 
>

< HTTP/1.1 200 OK
< Content-Type: application/json
< Date: Sun, 21 Jul 2013 13:23:55 GMT
< X-Apiary-Ratelimit-Limit: 120
< X-Apiary-Ratelimit-Remaining: 119
< Content-Length: 119
< Connection: keep-alive
<
< { "items": [
< { "url": "/shopping-cart/1", "product":"2ZY48XPZ", "quantity": 1, "name": "New socks", "price": 1.25 }
< ] }
```

## Parse the trace file using Node.JS

```javascript
var fs = require('fs');
var parser = require('curl-trace-parser');
fs.readFile('./tracefile', 'utf8', function (err,trace) {
  console.log(parser.parseToString(trace));
})
```

## Output format

The output is ASCII representation of a raw [HTTP message][message] with few modifications:

- Request line begins with `> `
- Response line begins with `< `
- Request and response is delimited by CR+LF
- Both Request and Response are terminated by an extra trailing LF

## Output format reverse parser Node.JS exapmle

```javascript
var fs = require('fs');
var parser = require('curl-trace-parser');
fs.readFile('./tracefile', 'utf8', function (err,trace) {
  console.log(parser.parseBack(trace));
})
```

[message]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html

