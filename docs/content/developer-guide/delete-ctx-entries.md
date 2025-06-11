# DELETE CONTEXT ENTRIES

To delete entries from a <span style="font-family:Courier New;">context</span>, a _delete_ request should be made as shown below.

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

contextName = "countryContext"
keys = [["AD"], ["AL"]]
try:
    request = (
        bios.isql()
        .delete()
        .from_context(contextName)
        .where(keys=keys)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|               |                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------ |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from which we need to fetch the data |
| _keys_        | List of _primaryKey_s for which the entries need to be deleted                             |

### Return values
|            |                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------- |
| _response_ | _bios.models.isql_response_message.EmptyISqlResponse_: This is a placeholder for empty response |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _contextName_ is not a string or if the _keys_ are not a list                      |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                      |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String contextName = "countryContext";
try {
    final var statement = Bios.isql().delete()
      .fromContext(contextName)
      .where(Bios.keys().in("AF", "AL"))
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|               |                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------- |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from  which we need to fetch the data |
| _contextKey_  | The _primaryKey_ for which the entries need to be fetched                                   |

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
    const statement = bios
        .iSqlStatement()
        .delete()
        .fromContext(contextName)
        .where(key("AD"), key("AL"))
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|               |                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------- |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from which we need to delete the data |
| _keys_        | List of _primaryKey_s for which the entries need to be deleted                              |

### Return values
|            |                                                              |
| ---------- | ------------------------------------------------------------ |
| _response_ | _VoidISqlResponse_: This is a placeholder for empty response |

### Errors

A _BiosClientError_ object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _contextName_ is not a string                                                      |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                      |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

<!-- tabs:end -->
