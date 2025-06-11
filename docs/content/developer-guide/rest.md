# REST API

RESTful APIs are stateless, i.e., sessions/cookies can’t be used. A common practice supported by RESTful endpoints is to send a secret access token with each request to authenticate the user.

The following parameters can be configured  -
* Source Name - An alphanumeric string as a unique name for this source.
* Endpoint - The URL from where bi(OS) will fetch data.
* Polling Interval - The interval to poll the REST endpoint
  * bi(OS) expects the REST endpoint to provide a delta since the  previous poll.[^32]
* Method  - The HTTP method to make the REST API call. Only <span style="font-family:Courier New;">GET</span> is currently supported.[^33]
* Developers can configure additional parameters per <span style="font-family:Courier New;">signal/context</span> -
  * Subpath  - If any will be appended to the endpoint.
  * Payload - <span style="font-family:Courier New;">JSON</span> or <span style="font-family:Courier New;">CSV</span>.
  * Query parameters <span style="font-family:Courier New;">(optional)</span>- Key-value pairs.
  * Headers  <span style="font-family:Courier New;">(optional)</span>- Key-value pairs.
* bi(OS) authentication - To ensure only authorized users are allowed to <span style="font-family:Courier New;">insert or upsert</span> data to bi(OS), the
  Login authentication type is used with the following parameters-
  * User - Username to connect to bi(OS).
  * Password - Password to connect to bi(OS).

Refer below for an example to configure connecting to REST API data source -
```json
{
  "importSourceId": "d97645e8-8ac7-4636-9290-f4f2e7fadd1b",
  "importSourceName": "gorest",
  "type": "RestClient",
  "authentication": {
    "type": "ApiAccessToken"
  },
  "queryParams": {
    "limit": 5
  },
  "headers": {
    "Authorization": "BEARER f55f1d82684c197ecbee269355c6e9e48"
  },
  "endpoint": "https://gorest.co.in/public/v2",
  "pollingInterval": 60,
  "method": "GET"
}
```
bi(OS) supports passing an access token via a query parameter or an Authorization header (for bearer tokens, OAuth2).
Note that the  creation of the access token is not part of the REST API client and is done offline.[^34]

In the example above, the access token (<span style="font-family:Courier New;">OAuth2 bearer token</span>) is passed
in the Authorization header. Below is how the request would look -

<span style="font-family:Courier New; font-size:14px;">HTTP GET - https://gorest.co/public/v2?limit=5</span>
<span style="font-family:Courier New; font-size:14px;">HTTP Headers: Authorization: bearer f55f1d82684c197ecbee269355c6e9e48</span>

The same token can be passed in query parameters as shown below -[^35]

```json
{
  "importSourceId": "d97645e8-8ac7-4636-9290-f4f2e7fadd1b",
  "importSourceName": "gorest",
  "type": "RestClient",
  "authentication": {
    "type": "ApiAccessToken"
  },
  "queryParams": {
    "limit": 5,
    "access_token": "f55f1d82684c197ecbee269355c6e9e48",
  },
  "headers": {},
  "endpoint": "https://gorest.co.in/public/v2",
  "pollingInterval": 60
}
```
Below is how the request would look -
<span style="font-family:Courier New; font-size:14px;">HTTP GET - https://gorest.co/public/v2?limit=5&access_token=f55f1d82684c197ecbee269355c6e9e48
</span>

[^32]: Checkpointing REST API data is coming soon. <br/>
[^33]: Support for other HTTP VERBS is coming soon. <br/>
[^34]: Refer [here](https://www.rfc-editor.org/rfc/rfc6750) for RFC6750 (OAuth 2.0 authorization framework).  <br/>
[^35]: Passing access tokens in query params is not a advised, it’s a security risk. <br/>
