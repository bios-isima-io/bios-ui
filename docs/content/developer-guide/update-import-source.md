# UPDATE IMPORT SOURCE

An integration source config can be updated using the **update_import_source()** method as shown below

```python
import_source_id = "256522a6-552a-4518-8c78-5a514a3b3132"

s3_source = {
  "importSourceName": "s3pull",
  "type": "S3",
  "authentication": {
    "type": "AccessKey",
    "accessKey": "xxxxxxxxxxxxxxxxx",
    "secretKey": "xxxxxxxxxxxxxxxxx"
  },
  "endpoint": "https://s3.us-west-2.amazonaws.com/exportdata/",
  "pollingInterval": 60
}

try:
  admin_session.update_import_source(import_source_id, s3_source)
except ServiceError as err:
  print(err)
```
#### Input parameters
|                  |                                               |
| ---------------- | --------------------------------------------- |
| import_source_id | The id of the source that needs to be updated |
| SOURCE_CONFIG    | A _dict_ containing the source configuration  |

### Return values
A python dict containing the updated source config

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

