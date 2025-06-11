# DELETE IMPORT FLOW SPECIFICATION

A flow config can be deleted using the **delete_import_flow_spec()** method as shown below

```python
import_flow_spec_id = "efaae84c-0e35-4155-9e01-407842d41341"

try:
  admin_session.delete_import_flow_spec(import_flow_spec_id)
except ServiceError as err:
  print(err)
```
### Input parameters
A string containing the flow id

### Return values
None

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
