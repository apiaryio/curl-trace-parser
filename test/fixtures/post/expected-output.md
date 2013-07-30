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
            Date:Sun, 21 Jul 2013 14:51:09 GMT
            X-Apiary-Ratelimit-Limit:120
            X-Apiary-Ratelimit-Remaining:119
            Content-Length:50
            Connection:keep-alive

    + Body

            { "status": "created", "url": "/shopping-cart/2" }

