# Export

While bi(OS) can provide most real-time OLAP capabilities, data may need to be exported to 3rd-party systems. bi(OS) supports two mechanisms to perform this export.

### Parquet Export
Data stored within bi(OS) can be exported to cloud data stores such as S3 in parquet[^78]  format periodically as features are computed.
This allows downstream applications to utilize curated data from bi(OS) instead of spending compute resources on processing raw data.

Refer below for an example to specify the AWS S3 export config -

```python
export_config = {
  "exportDestinationName": "s3export",
  "storageType": "S3",
  "status": "Enabled",
  "storageConfig": {
    "s3BucketName": "YOUR_BUCKET_NAME",
    "s3AccessKeyId": "YOUR_ACCESS_KEY",
    "s3SecretAccessKey": "YOUR_SECRET_KEY",
    "s3Region": "ap-south-1",
  }
}
session.create_export_destination(export_config)
```
The reply of this operation includes property “exportDestinationId” that is used to specified the export configuration
by signals.

To export <span style="font-family:Courier New;">signal</span> data, the <span style="font-family:Courier New;">signal</span> configuration needs to be updated with the “exportDestinationId” as shown below -
```python
signal_config = {
  "signalName": "YOUR_SIGNAL",
  "missingAttributePolicy": "...",
  "attributes": [
      ...
  ],
  "enrich": {
    "enrichments": [
        ...
    ],
  },
  "postStorageStage": {
    "features": [
      …
    ]
  },
  "exportDestinationId": "d1d58031-fc04-42df-9b2c-14490d13d2cf"
}
session.update_signal("YOUR_SIGNAL", signal_config)
```

Refer below for sample exported data (from S3 web console) -

<p align="center">
    <img src="/docs/images/export.png" style="width:60%">
</p>

### Streaming Export
Using the Alert capability mentioned above, a simple trick of setting the alert to always evaluate to true can
enable features to be exported as they are computed to any 3rd-party system.


[^78]: Support for <span style="font-family:Courier New;">contexts</span> is coming soon. <br/>
