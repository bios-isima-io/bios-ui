# GET IMPORT SOURCE

An integration source config can be  retrieved using the **get_import_source()** method as shown below

```python
import_source_id = "33b6cc97-62df-40be-8900-3266b20863de"

try:
  admin_session.get_import_source(import_source_id)
except ServiceError as err:
  print(err)
```
### Input parameters
A string containing the import_source_id

### Return values
A python dict containing the source config

Example:
```python
{
  "importSourceId": "256522a6-552a-4518-8c78-5a514a3b3132",
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
```
#### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
