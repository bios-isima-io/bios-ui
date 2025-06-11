# UPDATE IMPORT DESTINATION

An integration source config can be updated using the **update_import_source()** method as shown below

```python
import_dest_id = 'd83f192d-ebc4-40da-87e4-7c4ccf284b86'

bios_dest = {
  "type": "Bios",
  "endpoint": "https://bios.isima.io",
  "authentication": {
    "type": "Login",
    "user": "abc@xyz.in",
    "password": "xxxxxxxxx"
  }
}

try:
  admin_session.update_import_destination(import_dest_id, bios_dest)
except ServiceError as err:
  print(err)
```
### Input parameters
|                    |                                                    |
| ------------------ | -------------------------------------------------- |
| import_dest_id     | The id of the destination that needs to be updated |
| DESTINATION_CONFIG | A _dict_ containing the destination configuration  |

### Return values
A python dict containing the updated destination config

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

