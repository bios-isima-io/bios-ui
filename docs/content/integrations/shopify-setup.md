# Shopify Setup

* Login to Shopify web, Click on <span style="font-family:Courier New;">Connections > Settings > Notifications</span> and scroll to the bottom. Click on <span style="font-family:Courier New;">Create Webhook</span>.

<p align="center">
    <img src="/docs/images/shopify_create_webhook.png">
</p>

* In the <span style="font-family:Courier New;">Add Webhook</span> dialog, select an appropriate <span style="font-family:Courier New;">event</span>. Select <span style="font-family:Courier New;">JSON</span> format

<p align="center">
    <img src="/docs/images/shopify_select_event.png">
</p>

* Specify the webhook <span style="font-family:Courier New;">URL</span>. Substitute the TENANT_NAME in the <span style="font-family:Courier New;">URL</span> and Click <span style="font-family:Courier New;">Save</span>

<p align="center">
    <img src="/docs/images/shopify_save_webhook.png">
</p>

* Note down the <span style="font-family:Courier New;">Signing Key</span>. The signing key will become <span style="font-family:Courier New;">Shared Secret</span> for the shopify webhook source defined above

<p align="center">
    <img src="/docs/images/shopify_hmac_salt.png">
</p>

* Repeat the above steps for all events
