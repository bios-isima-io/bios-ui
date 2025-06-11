# Google Tag Manager (GTM) Integration

Google Tag Manager (GTM) allows you to update tags on your website quickly and easily. Tag Manager installation for web requires
a small piece of code that you add to your web pages. This code enables GTM to fire tags by inserting tags into web pages.

bi(OS) allows customers to post data to Isima dashboards using GTM functionality.
### Prerequisites

* Create a Google Tag Manager account and container. Refer [here](https://support.google.com/tagmanager/answer/6103696) for setting up the account.
* In bi(OS), create a new Webhook integration source, with **/gtm** as path.

### Steps

* Login to the GTM account for your site. Select **Container** tab and click on **Tags** menu item.
* Click on **Add a new tag** (at the bottom of "New Tag" card).
* In the **Create Tag > Choose your tag**  section, select **Custom HTML Tag**, click Continue.
* For **What triggers this tag to fire**, select **All Pages**, click Continue (you can configure specific Pages, Forms or Clicks too).
* In **Configure your tag**, specify  appropriate **Tag Name** (say **Isima - All Pages**).
* Copy the code below after substituting the **<tenant name>**

```java
<script>
  var requestOptions = {
      method: "POST",
      headers: {
          "content-type": "application/json"
      },
      body: JSON.stringify({
          pageUrl: {{Page URL}},
          pageType: {{Page Type}},
          identity: datalayer[0].identity,
          (... add other BUILT-IN or USER-DEFINED variables ...)
      })
  };
  fetch(
      "https://bios.isima.io/integration/<tenant_name>/gtm",
      requestOptions
  ).then(function (data) {console.log("Published event",  data)});
</script>
```
* Click **Save Tag**. The tag will be deployed to all the pages.
* You can **Preview** to make sure that tag get fired correctly before clicking **Publish**.

Post **Publish**, bi(OS) will start receiving events from all the pages.
