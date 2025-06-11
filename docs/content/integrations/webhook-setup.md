# bi(OS) Webhook Setup

bi(OS) simplifies webhook setup for integrating third parties. Refer table below for three most common integrations and their configuration.

The URL for incoming requests would be: https://**bios.isima.io**/integration/**{TENANT_NAME}**/**{PATH}**

| Third-party | Path       | Auth                                                                           | Payload Validation                                                    |
| ----------- | ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Segment     | /segment   | [HttpHeadersPlain](https://bios.isima.io/docs/content/developer-guide/webhook) | -                                                                     |
| Clevertap   | /clevertap | [In-message](https://bios.isima.io/docs/content/developer-guide/webhook)       | -                                                                     |
| Shopify     | /shopify   | [Login](https://bios.isima.io/docs/content/developer-guide/webhook)            | [Enabled](https://bios.isima.io/docs/content/developer-guide/webhook) |

Depending on the third-party, the **path** value from the table above should replace the **{PATH}** in the final URL.

**Note**: Shopify does not allow credentials to be sent in payload, but, supports <span style="font-family:Courier New;">Payload Validation</span> through a <span style="font-family:Courier New;">Signing Key</span>
that gets generated during shopify setup. Refer [Shopify Setup](https://bios.isima.io/docs/content/integrations/shopify-setup) section below for details.
