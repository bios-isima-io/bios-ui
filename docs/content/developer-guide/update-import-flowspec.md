# UPDATE IMPORT FLOW SPECIFICATION

A flow config can be updated using the **update_import_flow_spec()** method as shown below

```python
import_flow_spec_id = "efaae84c-0e35-4155-9e01-407842d41341"

import_flow_spec = { ... }

try:
  admin_session.update_import_flow_spec(import_flow_spec_id, import_flow_spec)
except ServiceError as err:
  print(err)
```
### Input parameters
|                     |                                             |
| ------------------- | ------------------------------------------- |
| import_flow_spec_id | The id of the flow that needs to be updated |
| FLOW CONFIG         | A _dict_ containing the flow config         |

### Return values
A python dict containing the updated destination config

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
