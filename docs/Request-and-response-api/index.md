# http4js

### Table of Contents

- [Overview](/http4js/#basics)
- [Intro](/http4js/Intro/#intro)
- [Handlers and Filters](/http4js/Handlers-and-filters/#handlers-and-filters)
- [Request and Response API](/http4js/Request-and-response-api/#request-and-response-api)
- [URI API](/http4js/Uri-api/#uri-api)
- [In Memory Testing](/http4js/In-memory-testing/#in-memory-testing)
- [Approval testing with fakes](/http4js/Approval-testing-with-fakes/#approval-testing-with-fakes)
- [Express or Koa Backend](/http4js/Express-or-koa-backend/#express-or-koa-backend)
- [Proxy](/http4js/Proxy/#proxy)
- [Example App](https://github.com/TomShacham/http4js-eg)

# Request and Response API

## Immutability - why?

Both `Request` and `Response` are immutable, so every method on them returns a new object. 
For example we might want to set a header on a `Request` but then replace it:

```typescript
const request = new Request(Method.GET, "/")
                    .setHeader(Headers.EXPIRES, "max-age=60")
                    
const noMaxAgeRequest = request.replaceHeader(Headers.EXPIRES, "max-age=0");
```

`request` and `noMaxAgeRequest` are different objects. This stops us from passing around
state all over our codebase and finding it hard to know where our `Request` or `Response`
is mutated. For example, it stops the following:

```typescript
getTo("/" , (req: Request) => {
    doSomethingOverThere(req)
    return Promise.resolve(new Response(200, req.bodyString()));
})

function doSomethingOverThere(req: Request): number {
    req.setHeader(Headers.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
    return Math.random();
}
```

where our function `doSomethingOverThere` takes a `Request` and tries to set a cache control directive
but is actually doing something else - returning a number. Because `doSomethingOverThere` doesn't return
the `Request` explicitly and because `Request` is immutable, it actually has no effect on the `Request`
used in `new Response(200, req.bodyString())` because `Request` is immutable.

## API

Every method that returns a `Request` will call 

```typescript
const request = Request.clone(this);
```

to achieve immutability.

The full api is as follows:

```typescript

class Request {
    setUri(uri: Uri | string): Request
    
    getHeader(name: string): string 
    
    setHeader(name: string, value: string): Request 
    
    replaceHeader(name: string, value: string): Request 
    
    removeHeader(name: string): Request
    
    setBody(body: Body | string): Request
    
    setFormField(name: string, value: string | string[]): Request 
    
    setForm(form: object): Request 
    
    bodyString(): string 
    
    formBodystring(): string 
    
    setQuery(name: string, value: string): Request
    
    getQuery(name: string): string
}

class Response {
    getHeader(name: string): string

    setHeader(name: string, value: string): Response 

    setHeaders(headers: object): Response 

    replaceAllHeaders(headers: object): Response 

    replaceHeader(name: string, value: string): Response 

    removeHeader(name: string): Response 

    setBody(body: Body | string): Response 

    bodyString(): string 
}
 ```