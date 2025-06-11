# UPDATE CONTEXT ENTRY

An update <span style="font-family:Courier New;">context</span> entry is useful, if _specific attributes_ of a <span style="font-family:Courier New;">context</span> entry need to be updated.

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

contextName = 'countryContext'
key = ["AF"]
new_values = [{"population": 38041700}]
try:
    request = (
        bios.isql()
        .update(contextName)
        .set(new_values)
        .where(key=key)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|               |                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from which we need to fetch the data                                                                                    |
| _key_         | The keys for whose attributes are to be updated.[^83]                                                                                                                         |
| _values_      | A list of dict which contains name-value pairs<br> - _name_:  corresponds to attribute that needs to be updated<br> - _value_: The value that will replace the existing value |

### Return values
|            |                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------- |
| _response_ | _bios.models.isql_response_message.EmptyISqlResponse_: This is a placeholder for empty response |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _contextName_ is not a string<br>if _keys_ are not a list<br>if _values_ is not a list |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                   |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist     |
| BAD_INPUT        | If there are validation failures                                                          |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final Map<String, Object> attrMap = new HashMap();
attrMap.put("population", 38049999);
final String contextName = "countryContext";
try {
    final var statement = Bios.isql().update(contextName)
      .set(Collections.unmodifiableMap(attrMap))
      .where(Bios.keys().in("AF"))
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|               |                                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from  which we need to fetch the data                                                                                                |
| _key_         | The key for which the attributes are to be updated.[^83]                                                                                                                                   |
| _attrMap_     | A  Map which contains name-value pairs that need to be updated<br>**name**: corresponds to attribute that needs to be updated<br>**value**: The value that will replace the existing value |

### Return values
|            |                                                                                   |
| ---------- | --------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.VoidISqlResponse_: This is a placeholder for empty response |

### Errors

A _BiosClientException_ object is returned. Possible errors could be -

| Error Code     | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| UNAUTHORIZED   | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM | If a <span style="font-family:Courier New;">context</span> by the name does not exist |
| BAD_INPUT      | If there are validation failures                                                      |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Javascript**
```javascript
import bios from "bios-sdk";

try {
  const contextName = "countryContext";
  const keys = bios.isql.keys;
  const attribute = bios.isql.attribute;

  const statement = bios
    .iSqlStatement()
    .update(contextName)
    .set(attribute("population", 38041700))
    .where(keys("AF"))
    .build();
  const response = await bios.execute(statement);
} catch (error) {
  console.log(error);
}
```
### Input parameters

|               |                                                                                |
| ------------- | ------------------------------------------------------------------------------ |
| _contextName_ | <span style="font-family:Courier New;">Context</span> that needs to be updated |
| _keys_        | List of _primaryKey_s for which the entries need to be updated                 |
| _values_      | Attribute name and values that need to be udpated                              |

### Return values
|            |                                                              |
| ---------- | ------------------------------------------------------------ |
| _response_ | _VoidISqlResponse_: This is a placeholder for empty response |

### Errors

A _BiosClientError_ object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _contextName_ or _keys_ is not a string                                            |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                      |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

<!-- tabs:end -->
