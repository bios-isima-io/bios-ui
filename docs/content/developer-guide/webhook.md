# Webhook

Any data source can send data to bi(OS) via an HTTP POST.  This configuration supports the following parameters -
* Source name - An alphanumeric string as a unique name for this source.
* Webhook path - URL at which the bi(OS) listens for incoming requests. For e.g. if this path is set to <span style="font-family:Courier New;">“/endpoint”</span>,
  then the complete path to which the data source should send the <span style="font-family:Courier New;">HTTP POST</span> requests is:
  <span style="font-family:Courier New; font-size:16px;">https://&lt;bios_domain&gt;/**integration**/&lt;tenant_name&gt;/endpoint</span>.
* bi(OS) authentication - To ensure only authorized users are allowed to POST data to bi(OS), the following
  authentication types are supported -
  * <span style="font-family:Courier New;">Login</span> - User credentials are provided during configuration of bi(OS).  This option should only be used when the
    source cannot provide authentication parameters.
  * <span style="font-family:Courier New;">In-message</span> - User credentials are part of the payload with the following required fields -
    * Username key - The field name whose value represents the username to authenticate with bi(OS).
    * Password key - The field name whose value represents the password to authenticate with bi(OS).
  * <span style="font-family:Courier New;">HTTPHeadersPlain</span> - This method is the same as above, except the authentication parameters are provided in HTTP
    headers[^20]  (instead of within the body) with the following required headers -
    * Username header - The HTTP header name whose value represents the username to authenticate with bi(OS).
    * Password header - The HTTP header name whose value represents the password to authenticate with bi(OS).
  * <span style="font-family:Courier New;">HTTPAuthorizationHeader</span> - User credentials are base64 encoded in the authorization HTTP header.[^21]
* Payload Validation using <span style="font-family:Courier New;">HMAC</span>[^22]  (optional)  - Validates the HMAC signature of the payload to prevent tampering
  of the payload. This requires -
  * <span style="font-family:Courier New;">Enable HMAC</span> - Indicates if the payload is signed.
  * <span style="font-family:Courier New;">HMAC Header</span> - The HTTP header name whose value represents the signature (hash) of the payload.
  * <span style="font-family:Courier New;">Shared secret</span> - The secret used to hash the payload and compare the resulting value with the
    value provided in the <span style="font-family:Courier New;">HMAC</span> header.
  * <span style="font-family:Courier New;">Encode Digest</span> - Indicates if the signature specified in the HMAC Header is base64 encoded.

Refer below for an example[^23]  to configure a Webhook data source -

```json
{
  "importSourceId": "e4bc5069-053a-4b7a-92ec-1f3501e57bde",
  "importSourceName": "webhook",
  "type": "Webhook",
  "authentication": {
    "type": "HttpHmacHeader",
    "sharedSecret": "xxxxxxxx",
    "hmacHeader": "x-hmac-sha256"
  },
  "webhookPath": "/sdk"
}
```

[^22]: HMAC support for all Authentication types is coming soon.  Currently only Login type is supported. <br/>
[^23]: While examples use declarative JSON format, developers can use bi(OS)’s mobile-friendly UI to perform the same functions. <br/>
