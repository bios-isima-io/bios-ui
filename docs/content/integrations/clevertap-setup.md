# Clevertap Setup

To setup clevertap, perform the following steps -
* Login to clevertap. Navigate to <span style="font-family:Courier New;">Settings > Channels > Webhooks</span>. Click <span style="font-family:Courier New;">+ Add Webhook</span>

<p align="center">
    <img src="/docs/images/ct_webhooks_list.png">
</p>

* The Create webhook template popup opens. Enter details in the webhook template -
  * Method: POST
  * Destination URL: https://**bios.isima.io**/integration/**{TENANT_NAME}**/**clevertap**
  * Click <span style="font-family:Courier New;">Create</span>

<p align="center">
    <img width="60%" src="/docs/images/ct_create_webhook.png">
</p>

* Create a webhook campaign from the dashboard
  * Navigate to Campaigns

<p align="center">
    <img src="/docs/images/ct_homepage.png">
</p>

* Click <span style="font-family:Courier New;">+ Campaign</span>. Select <span style="font-family:Courier New;">Webhooks</span>

<p align="center">
    <img src="/docs/images/ct_campaigns.png">
</p>

* Give appropriate name for the webhook campaign

<p align="center">
    <img src="/docs/images/ct_new_webhook_campaign.png">
</p>

* Select <span style="font-family:Courier New;">Live behavior</span> for <span style="font-family:Courier New;">Qualification criteria</span>. Click <span style="font-family:Courier New;">Done</span>

<p align="center">
    <img src="/docs/images/ct_criteria.png">
</p>

* Select webhook for the campaign from the drop-down (created in Step 2 above). Click <span style="font-family:Courier New;">Done</span>

<p align="center">
    <img src="/docs/images/ct_select_webhook.png">
</p>

* In the <span style="font-family:Courier New;">Who</span> section, add Events in <span style="font-family:Courier New;">Target Segment</span> based on their behavior.

<p align="center">
    <img src="/docs/images/ct_who.png">
</p>

* In the <span style="font-family:Courier New;">What</span> section, Click on <span style="font-family:Courier New;">Go To Editor</span>

<p align="center">
    <img src="/docs/images/ct_what.png">
</p>

* In the <span style="font-family:Courier New;">Webhook Content</span> section of the editor
  * Select <span style="font-family:Courier New;">JSON</span> as <span style="font-family:Courier New;">Content Format</span>
  * Select the Radio button <span style="font-family:Courier New;">Profile variables & custom key-value pairs</span>
  * Check the <span style="font-family:Courier New;">Event Properties</span> box

<p align="center">
    <img src="/docs/images/ct_webhook_content.png">
</p>

* In the <span style="font-family:Courier New;">Custom key-value pairs</span> section of the editor
  * Provide bi(OS) <span style="font-family:Courier New;">user</span> and <span style="font-family:Courier New;">password</span> credentials
  * Provide the target <span style="font-family:Courier New;">signal / context</span> filter key

<p align="center">
    <img src="/docs/images/ct_bios_credentials.png">
</p>

* In the <span style="font-family:Courier New;">Date and time</span> section
  * Select <span style="font-family:Courier New;">Now</span> for <span style="font-family:Courier New;">Start date and time</span>
  * Select <span style="font-family:Courier New;">Never</span> for <span style="font-family:Courier New;">End date and time</span>
  * Select <span style="font-family:Courier New;">No delay</span> for <span style="font-family:Courier New;">Set delay</span>
  * Click <span style="font-family:Courier New;">Done</span>

<p align="center">
    <img src="/docs/images/ct_webhook_date.png">
</p>

* Webhook campaign setup is complete. Click <span style="font-family:Courier New;">Send for Approval</span>

<p align="center">
    <img src="/docs/images/ct_send_for_approval.png">
</p>

* Once the campaign is approved, it will start publishing to the webhook. No further action is required.
