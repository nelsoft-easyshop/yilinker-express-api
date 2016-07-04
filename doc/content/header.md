---
### Introduction

The [REST APIs](https://dev-express.yilinker.com) present in this page provide programmatic access to the various services provided by [Yilinker Express](https://express.yilinker.com). 
This service aims to seamlessly connect your business to ours and leverage the logistic network of Yilinker Express.

### Preliminaries

#### Data Encoding

The entire API Framework of Yilinker Express identifies both the request and response using the `JSON` data format.
In connection with this, it is important to preface all requests to the Yilinker Express API with the 
appropriate content type header i.e.

`Content-Type: application/json`

It can be assumed safely that all responses of the framework will also be in `JSON` format as well.

#### Authentication

The API framework utilizes the [Basic Access Authententication Protocol](https://en.wikipedia.org/wiki/Basic_access_authentication)
to enforce authentication on all endpoints. Thus, it is also important to preface all requests with the appropriate
authorization header i.e.

`Authorization: Basic <string>`

Where `<string>` is simply the base64 encoding of the string <client_key>:<client_secret>.

For example:

Say we have `Aladdin` as the `client_key` and `Seven Dwarves` as the `client_secret`. The header is formed as follows:

`Authorization: Basic QWxhZGRpbjpTZXZlbiBEd2FydmVz`

### API Settings

#### Default Shipper Address

The client is required to set the `Default Shipper Address` API setting which can be found under the API header on the 
left navigation bar of the Client Portal Dashboard. This would be taken as the Shipper's address on all packages that the client will
send under the API Framework.

A tutorial on how to set the default shipper address can be found [here](https://i.imgur.com/ozrAcKU.gifv). If the client does not have an address yet,
a tutorial on how to generate an address can be found [here](https://i.imgur.com/eW7HObI.gifv).

#### Callbacks (Optional)

The API Framework utilizes callbacks to increase the responsiveness of I/O bound endpoints and avoid request timeouts. This adds asynchronicity to the framework but is optional.
They are simply urls from where the API Framework will send a result payload after the system has finished processing an I/O bounded client request.


If the callback url is omitted on the request parameters, the endpoint will still process the request but will not return any result.


A more verbose definition can be found [here](https://en.wikipedia.org/wiki/Callback_(computer_programming)).

##### Securing Callback URLS

Once the client has configured their application to receive payloads from the Express API, it is of paramount importance to secure these endpoints from malicious attacks.
The API Framework incorporates an HMAC-SHA-256 hexdigest on every payload which the client can use to verify the authenticity and integrity of the payload.


The client first must [set the Callback Secret Token](https://i.imgur.com/3ytSXdS.gifv) option on the Client API Setting. When the token is set, the Express API will use it to create the hash signature with each payload.
This hash signature is passed along with every request in the headers as `X-YLX-Signature`.


The task of the client then is to compute a hash using the Callback Secret Token provided and ensure that the hash from the Express API payload matches.


If ever the client forgets to set the Callback Secret Token and tries to subscribe to the Callback, the empty string `''` will be used as the key for the hash.


### API Routes Versioning

The API Framework route versioning adheres to [Semantic Versioning](http://semver.org/) such that:

* Major version bump (x.0.0) contains backwards-incompatible changes (breaking changes).
* Minor version bump (0.x.0) contains new functionalities that are backwards-compatible.
* Patch version bump (0.0.x) contains backwards-compatible bug fixes.

As such, the API would only incorporate Major version bump in the route endpoints (e.g `/v3/create-waybill/`).

The latest version of the route will be reflected by the giant dropdown button on the very top of this page.

Yilinker Express will send email notifications on the event of a major version bump only. The email will include details regarding breaking changes, upgrading and deprecation timeline.
