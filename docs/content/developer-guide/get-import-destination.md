# GET IMPORT DESTINATION

An integration destination config can be retrieved using the **get_import_destination()** method as shown below

```python
import_dest_id = 'd83f192d-ebc4-40da-87e4-7c4ccf284b86'

try:
  admin_session.get_import_destination(import_dest_id)
except ServiceError as err:
  print(err)
```
### Input parameters
A string containing the destination id

### Return values
A python dict containing the destination config

Example:
```python
{
  "importDestinationId": "d83f192d-ebc4-40da-87e4-7c4ccf284b86",
  "type": "Bios",
  "endpoint": "https://bios.isima.io",
  "authentication": {
    "type": "Login",
    "user": "abc@xyz.in",
    "password": "xxxxxxxxx"
  }
}
```
### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
