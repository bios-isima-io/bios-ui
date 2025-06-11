# ADD OR UPDATE CONTEXT ENTRIES

To add or update <span style="font-family:Courier New;">context</span> entries an <span style="font-family:Courier New;">upsert</span> operation is to be performed as shown below -

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

countries = [
    "AF,Afghanistan,38041757,Asia",
    "AL,Albania,2862427,Europe",
    "DZ,Algeria,43053054,Africa",
    "AD,Andorra,76177,Europe",
]
try:
    request = (
        bios.isql()
        .upsert()
        .into("countryContext")
        .csv_bulk(countries)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|                   |                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| *contextName*     | <span style="font-family:Courier New;">Context</span> into which these values are inserted or updated |
| *list of entries* | The entries that need to be added or updated                                                          |

### Return values
|            |                                                                          |
| ---------- | ------------------------------------------------------------------------ |
| *response* | _bios.models.EmptyISqlResponse_ This is a placeholder for empty response |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _into_ parameter is not a string                                                   |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

try {
    final var statement = Bios.isql().upsert()
      .intoContext(contextName)
      .csvBulk(List.of("AF,Afghanistan,38041757,Asia", "AL,Albania,2862427,Europe"))
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```
### Input parameters

|                   |                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| *contextName*     | <span style="font-family:Courier New;">Context</span> into which these values are inserted or updated |
| *list of entries* | The entries that need to be added or updated                                                          |

### Return values
|            |                                                                                  |
| ---------- | -------------------------------------------------------------------------------- |
| *response* | _io.isima.bios.models.VoidISqlResponse_ This is a placeholder for empty response |

### Errors

A _BiosClientException_ object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _into_ parameter is not a string                                                   |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Javascript**
```javascript
import bios from "bios-sdk";

try {
    const contextName = "countryContext";
    const countries = [
        "AF,Afghanistan,38041757,Asia",
        "AL,Albania,2862427,Europe",
        "DZ,Algeria,43053054,Africa",
        "AD,Andorra,76177,Europe",
    ];

    const statement = bios
        .iSqlStatement()
        .upsert()
        .into(contextName)
        .csvBulk(countries)
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|                   |                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| *contextName*     | <span style="font-family:Courier New;">Context</span> into which these values are inserted or updated |
| *list of entries* | The entries that need to be added or updated                                                          |

### Return values
|            |                                                           |
| ---------- | --------------------------------------------------------- |
| *response* | VoidISqlResponse.This is a placeholder for empty response |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _into_ parameter is not a string                                                   |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section


<!-- tabs:end -->
