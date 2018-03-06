# The `curl --trace` parser

[![NPM Version](https://img.shields.io/npm/v/curl-trace-parser.svg)](https://www.npmjs.com/package/curl-trace-parser)
[![Build Status](https://travis-ci.org/apiaryio/curl-trace-parser.svg)](https://travis-ci.org/apiaryio/curl-trace-parser)
[![Dependency Status](https://david-dm.org/apiaryio/curl-trace-parser.svg)](https://david-dm.org/apiaryio/curl-trace-parser)
[![devDependency Status](https://david-dm.org/apiaryio/curl-trace-parser/dev-status.svg)](https://david-dm.org/apiaryio/curl-trace-parser?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/apiaryio/curl-trace-parser.svg)](https://greenkeeper.io/)


## The story

Did you know that you can record raw HTTP communication of [Curl command-line tool](http://curl.haxx.se/docs/manpage.html) with the `--trace` and `--trace-ascii` option? It's the only way I know to get raw HTTP communication without using the [`tcpdump`](http://www.tcpdump.org/) or [`wireshark`](http://www.wireshark.org/).
For example, this trick is very useful for the proper introspection into HTTP communication of an undocumented RESTful API.

The only glitch is that cURL `--trace` saves data in [its custom format][gist], far from human-friendly, saving chunks as they are being received and splitting them by packets. If you want a human readable form then this parser is what you need. Delivered as a Node.js package.

[gist]: https://gist.github.com/netmilk/6048533

## Usage

```
$ curl --trace - http://httpbin.org/ip | curl-trace-parser
```

## Sample API

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

## Examples

### `--raw` format

The output is ASCII representation of a raw [HTTP message][message] with few modifications:

- Request line begins with `> `
- Response line begins with `< `
- Request and Response is delimited by CR+LF
- Both Request and Response are terminated by an extra trailing LF

Note: This is little bit tricky because HTTP RFC does not have declared delimiter for Request and Response, for obvious reasons.

```bash
$ cat tracefile | curl-trace-parser --raw
> POST /shopping-cart HTTP/1.1
> User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5
> Host: curltraceparser.apiary.io
> Accept: */*
> Content-Type: application/json
> Content-Length: 39
>
> { "product":"1AB23ORM", "quantity": 2 }

< HTTP/1.1 201 Created
< Content-Type: application/json
< Date: Tue, 30 Jul 2013 11:32:30 GMT
< X-Apiary-Ratelimit-Limit: 120
< X-Apiary-Ratelimit-Remaining: 119
< Content-Length: 50
< Connection: keep-alive
<
< { "status": "created", "url": "/shopping-cart/2" }
```

### `--blueprint` format

The output is HTTP Request and Response in the [API blueprint format](http://apiblueprint.org) which is the superset of markdown.

```
$ cat tracefile | ./bin/curl-trace-parser --blueprint
# POST /shopping-cart
+ Request
    + Headers

            User-Agent:curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5
            Host:curltraceparser.apiary.io
            Accept:*/*
            Content-Type:application/json
            Content-Length:39

    + Body

            { "product":"1AB23ORM", "quantity": 2 }

+ Response 201
    + Headers

            Content-Type:application/json
            Date:Tue, 30 Jul 2013 11:32:30 GMT
            X-Apiary-Ratelimit-Limit:120
            X-Apiary-Ratelimit-Remaining:119
            Content-Length:50
            Connection:keep-alive

    + Body

            { "status": "created", "url": "/shopping-cart/2" }

```

Note: This format does not expect any CR+LF in the message body

### Parse the trace to raw HTTP file using Node.JS

```javascript
var fs = require('fs');
var parser = require('curl-trace-parser');
fs.readFile('./tracefile', 'utf8', function (err,trace) {
  console.log(parser.parse(trace));
})
```

## Output format reverse parser

```javascript
var fs = require('fs');
var parser = require('curl-trace-parser');
fs.readFile('./tracefile', 'utf8', function (err,trace) {
  console.log(parser.parseBack(trace));
})
```

## API Reference

`parse(traceString)` - parse string with trace to object with raw request and response

`parseToString(traceString)` - parse string with trace to [output format]

`parseBack(outputString)` - parse string with [output format] back to object with raw request an resposne


[output format]: https://github.com/apiaryio/curl-trace-parser#output-format
[message]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html

