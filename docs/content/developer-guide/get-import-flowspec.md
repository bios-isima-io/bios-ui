# GET IMPORT FLOW SPECIFICATION

A flow config can be retrieved using the **get_import_flow_spec()** method as shown below

```python
import_flow_spec = "efaae84c-0e35-4155-9e01-407842d41341"

try:
  admin_session.get_import_flow_spec(import_flow_spec)
except ServiceError as err:
  print(err)
```
### Input parameters
A string containing the flow id

### Return values
A python dict containing the flow config

Example:
```python
{
  "importFlowId": "efaae84c-0e35-4155-9e01-407842d41341",
  "importFlowName": "employeeFlow",
  "sourceDataSpec": {
    "importSourceId": "d6fee996-1590-4cb8-8348-f2f29c388b8a",
    "payloadType": "Json"
  },
  "destinationDataSpec": {
    "importDestinationId": "2ff42a84-fcd0-4410-aa16-05af34591127",
    "type": "Signal",
    "name": "employee"
  },
  "dataPickupSpec": {
    "attributeSearchPath": "",
    "attributes": [
      {
        "sourceAttributeName": "id"
      },
      {
        "sourceAttributeName": "firstName"
      },
      {
        "sourceAttributeName": "lastName"
      },
      {
        "sourceAttributeName": "gender"
      },
      {
        "sourceAttributeName": "hireDate"
      }
    ]
  }
}
```
### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
