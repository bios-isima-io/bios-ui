# Signals

<span style="font-family:Courier New;">Signals</span> represent observations in the real world - the current price of a stock, clicks in cyberspace, thermostat
reading from an IoT sensor, etc. They are fit for data sources that are -

* Immutable - Developers can’t modify data once written within <span style="font-family:Courier New;">signals</span>.
* Voluminous - From hundreds to millions of events/second.

Refer below for an example <span style="font-family:Courier New;">signal</span> -

```json
{
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
  "enrich": {}
}
```
