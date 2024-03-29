---
### Introduction

The [REST APIs](https://dev-express.yilinker.com) present in this page provide programmatic access to the various services provided by [Yilinker Express](https://express.yilinker.com). 
This service aims to seamlessly connect your business to ours and leverage the logistic network of Yilinker Express.

### Preliminaries

## Data Encoding

The entire API Framework of Yilinker Express identifies both the request and response using the `JSON` data format.
In connection with this, it is important to preface all requests to the Yilinker Express API with the 
appropriate content type header i.e.

`Content-Type: application/json`

It can be assumed safely that all responses of the framework will also be in `JSON` format as well.

## Authentication

The API framework utilizes the [Basic Access Authententication Protocol](https://en.wikipedia.org/wiki/Basic_access_authentication)
to enforce authentication on all endpoints. Thus, it is also important to preface all requests with the appropriate
authorization header i.e.

`Authorization: Basic <string>`

Where `<string>` is simply the base64 encoding of the string <client_key>:<client_secret>.

For example:

Say we have `Aladdin` as the `client_key` and `Seven Dwarves` as the `client_secret`. The header is formed as follows:

`Authorization: Basic QWxhZGRpbjpTZXZlbiBEd2FydmVz`

## Default Shipper Address

The client is required to set the `Default Shipper Address` API setting which can be found under the API header on the 
left navigation bar of the Client Portal Dashboard. This would be taken as the Shipper's address on all packages that the client will
send under the API Framework.

A tutorial on how to set the default shipper address can be found [here](https://i.imgur.com/ozrAcKU.gifv). If the client does not have an address yet,
a tutorial on how to generate an address can be found [here](https://i.imgur.com/eW7HObI.gifv).
