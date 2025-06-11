# CREATE IMPORT FLOW SPECIFICATION

An flow connects an integration source, destination and a  <span style="font-family:Courier New;">signal/context</span>. For the purposes of show casing flow  sdk, we will
assume the following -

```python
employee_config = {
  "signalName": "employee",
  "missingAttributePolicy": "Reject",
  "attributes": [
    {
      "attributeName": "id",
      "type": "Integer"
    },
    {
      "attributeName": "firstName",
      "type": "String"
    },
    {
      "attributeName": "lastName",
      "type": "String"
    },
    {
      "attributeName": "gender",
      "type": "String"
    },
    {
      "attributeName": "hireDate",
      "type": "String"
    }
  ],
  "enrich": {
    "ingestTimeLag": []
  }
}

import_source_id: "256522a6-552a-4518-8c78-5a514a3b3132" (defined in above section)
import_destination_id: "d83f192d-ebc4-40da-87e4-7c4ccf284b86" (defined in above section)

employee_flow_spec =     {
  "importFlowName": "employeeFlow",
  "sourceDataSpec": {
    "importSourceId": "256522a6-552a-4518-8c78-5a514a3b3132",
    "payloadType": "Json"
  },
  "destinationDataSpec": {
    "importDestinationId": "d83f192d-ebc4-40da-87e4-7c4ccf284b86",
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

try:
  admin_session.create_import_flow_spec(employee_flow_spec)
except ServiceError as err:
  print(err)
```
### Input parameters
A python _dict_ containing the flow specification

### Return values
A python _dict_ with the created flow config

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
