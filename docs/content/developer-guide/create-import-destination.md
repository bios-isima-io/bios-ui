# CREATE IMPORT DESTINATION

An integration destination can be created using the **create_import_destination()** method as shown below. Only one type of
destination is supported (Bios)

```python
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
  admin_session.create_import_destination(bios_dest)
except ServiceError as err:
  print(err)
```
### Input parameters
A python dict containing the bios destination configuration

### Return values
A python dict with the created destination config

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

