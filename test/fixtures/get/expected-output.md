# GET /shopping-cart
+ Request
    + Headers

            User-Agent:curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5
            Host:curltraceparser.apiary.io
            Accept:*/*

    + Body

            

+ Response 200
    + Headers

            Content-Type:application/json
            Date:Sun, 21 Jul 2013 13:23:55 GMT
            X-Apiary-Ratelimit-Limit:120
            X-Apiary-Ratelimit-Remaining:119
            Content-Length:119
            Connection:keep-alive

    + Body

            { "items": [
            { "url": "/shopping-cart/1", "product":"2ZY48XPZ", "quantity": 1, "name": "New socks", "price": 1.25 }
            ] }

