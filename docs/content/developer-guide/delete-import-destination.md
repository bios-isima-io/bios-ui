# DELETE IMPORT DESTINATION

An integration source config can be deleted using the **delete_import_destination()** method as shown below

```python
import_dest_id = 'd83f192d-ebc4-40da-87e4-7c4ccf284b86'

try:
  admin_session.delete_import_destination(import_dest_id)
except ServiceError as err:
  print(err)
```
### Input parameters
A string containing the destination id

### Return values
None

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
