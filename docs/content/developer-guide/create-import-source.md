# CREATE IMPORT SOURCE

An integration source can be created using the **create_import_source()** method as shown below

```python
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
  admin_session.create_import_source(s3_source)
except ServiceError as err:
  print(err)
```
### Input parameters
A python _dict_ containing the s3 source configuration

### Return values
A python _dict_ with the created source config

Example:
```python
{
  "importSourceId": "33b6cc97-62df-40be-8900-3266b20863de",
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
### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
