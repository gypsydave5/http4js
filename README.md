# http4js

A simple http library for typescript

## *** [read the docs](https://tomshacham.github.io/http4js/) ***

## Using in your project

#### To install:

```
npm install --save http4js
```

#### Example

An example server and client

```typescript
import {Status} from "./dist/main/core/Status";
import {Request} from "./dist/main/core/Request";
import {HttpHandler} from "./dist/main/core/HttpMessage";
import {routes} from "./dist/main/core/Routing";
import {Response} from "./dist/main/core/Response";
import {HttpClient} from "./dist/main/client/Client";
import {Uri} from "./dist/main/core/Uri";
import {Headers} from "./dist/main/core/Headers";
import {Method} from "./dist/main/core/Methods";

//handler takes a request and promises a response
const handler = (req: Request) => {
    const html = `<h1>${req.method} to ${req.uri.href} with req headers ${Object.keys(req.headers)}</h1>`;
    return Promise.resolve(new Response(Status.OK, html));
};

//add header to every request
const headerFilter = (handler: HttpHandler) => {
    return (req: Request) => {
        return handler(req.setHeader(Headers.X_CSRF_TOKEN, Math.random()))
            .then(response => response.setHeader(Headers.VARY, "gzip"));
    }
};

//define our server routes and start on port 3000
routes(Method.GET, ".*", handler)
    .withFilter(headerFilter)
    .asServer()
    .start();

//make an http request to our server and log the response
HttpClient(
    new Request(Method.GET, "http://localhost:3000/any/path")
).then(response => {
    console.log(response);
    console.log(response.bodyString());
});

/*
Response {
    headers:
    { vary: 'gzip',
        date: 'Sun, 08 Apr 2018 08:26:20 GMT',
        connection: 'close',
        'transfer-encoding': 'chunked' },
    body:
        Body {
        bytes: <Buffer 3c 68 31 3e 47 45 54 20 74 6f 20 2f 61 6e 79 2f 70 61 74 68 20 77 69 74 68 20 72 65 71 20 68 65 61 64 65 72 73 20 68 6f 73 74 2c 63 6f 6e 6e 65 63 74 ... > },
    status: 200 }
<h1>GET to /any/path with req headers host,connection,x-csrf-token</h1>
 */
```

#### History and Design

http4js is a port of [http4k](https://github.com/http4k/http4k): an HTTP toolkit written in Kotlin that enables the serving and consuming of HTTP services in a functional and consistent way. Inspiration for http4js is entirely thanks to [David Denton](https://github.com/daviddenton) and [Ivan Sanchez](https://github.com/s4nchez). Thanks! 

If you wrote a thin API layer that translated the wire representation of HTTP into a few domain objects: Request, Response and Routing, and translated back again, you essentially wind up with the whole of http4js.

This seemingly basic idea is the beauty and power of http4js and the SaaF (Server as a Function) concept.

We translate a wire request into a Request object. Our server is a function from Request -> Response, we translate a Response to a wire response. 

We write all our routing logic with our ResourceRouting domain object. 

Hence we can run server in memory and test our entire stack and therefore the only added benefit of functional testing is to test the translation between wire and domain.
 
We inject all of our dependencies to our Server so testing using fakes is easy peasy. We can even write simple fakes of external dependencies and spin them up in memory. 


#### Contributing

I'd be very happy if you'd like to contribute :)

#### To run:

```
git clone git@github.com:TomShacham/http4js.git  
cd http4js
npm install
tsc; node index.js
```

#### To test:

```
npm install
npm test
```

#### To do

- update example app
- write skeleton app
- move over to yarn

- write a tutorial 
