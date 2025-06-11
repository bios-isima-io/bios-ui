# DELETE IMPORT SOURCE

An integration source config can be deleted using the **delete_import_source()** method as shown below

```python
import_source_id = "256522a6-552a-4518-8c78-5a514a3b3132"

try:
  admin_session.delete_import_source(import_source_id)
except ServiceError as err:
  print(err)
```
### Input parameters
A string containing the  _import_source_id_

### Return values
None

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
