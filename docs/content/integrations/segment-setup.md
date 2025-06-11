# Segment Setup

Segment can submit real-time data to this endpoint using HTTP POST. Refer to the steps below to configure segment -

* Login to Segment web app

<p align="center">
    <img src="/docs/images/segment_connections.png">
</p>

* Click on <span style="font-family:Courier New;">Connections > Catalog</span>. Select <span style="font-family:Courier New;">Destinations</span> tab

<p align="center">
    <img src="/docs/images/segment_catalog.png">
</p>

* Search for <span style="font-family:Courier New;">webhook</span>. From the Search Results, click on <span style="font-family:Courier New;">Webhooks</span>

<p align="center">
    <img src="/docs/images/segment_webhook.png">
</p>

*  Click on <span style="font-family:Courier New;">Configure Webhooks</span>

<p align="center">
    <img src="/docs/images/segment_webhook1.png">
</p>

* Specify bi(OS) as the Webhook destination and click <span style="font-family:Courier New;">Save</span>

<p align="center">
    <img src="/docs/images/segment_bios_dest.png">
</p>

* On the Settings page, provide the <span style="font-family:Courier New;">Webhook URL</span> and Auth <span style="font-family:Courier New;">Headers</span>. Substitute the TENANT_NAME in the <span style="font-family:Courier New;">Webhook URL</span> and provide your bi(OS) credentials in the corresponding <span style="font-family:Courier New;">Headers</span>.
  Click <span style="font-family:Courier New;">Save</span>.

<p align="center">
    <img src="/docs/images/segment_edit_settings.png">
</p>

* Click on <span style="font-family:Courier New;">Settings</span> tab and enable the destination

<p align="center">
    <img src="/docs/images/segment_webhook_activate.png">
</p>

Segment should start sending events to the webhook configured in bi(OS).
