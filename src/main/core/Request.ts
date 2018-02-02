import {Http4jsRequest, Method} from "./HttpMessage";
import {Headers} from "./Headers";
import {Body} from "./Body";

export class Request implements Http4jsRequest {

    uri: string;
    method: string;
    headers: object = {};
    body: Body;

    constructor(
        method: Method,
        uri: string,
        body: Body = new Body(new Buffer("")),
        headers = null
    ) {
        this.method = method.toString();
        this.uri = uri;
        this.body = body;
        this.headers = headers ? headers : {};
        return this;
    }

    setUri(uri: string): Request {
        return undefined;
    }

    getHeader(name: string): string {
        return this.headers[name];
    }

    setHeader(name: string, value: string): Request {
        if (this.headers[name] == null) {
            this.headers[name] = value;
        } else if (typeof this.headers[name] == "string") {
            this.headers[name] = [this.headers[name], value];
        } else {
            this.headers[name].push(value);
        }
        return this;
    }

    replaceHeader(name: string, value: string): Request {
        this.headers[name] = value;
        return this;
    }

    removeHeader(name: string): Request {
        delete(this.headers[name]);
        return this;
    }

    setBody(body: Body): Request {
        this.body = body;
        return this;
    }

    setBodystring(string: string): Request {
        this.body.bytes = string;
        return this;
    }

    bodystring(): string {
        return this.body.bodyString();
    }

}