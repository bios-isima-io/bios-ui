# INSERT A CSV STRING

This is the simplest form of <span style="font-family:Courier New;">insert</span>. The input to the <span style="font-family:Courier New;">insert</span> is a comma  separated string of all the _attributes_
in the <span style="font-family:Courier New;">signal</span> (in the order of their definition in the <span style="font-family:Courier New;">signal</span>)

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

signal_name = 'covidDataSignal'
csv_str = '29/06/2020,AF,234,21'
try:
    request = (
        bios.isql()
        .insert()
        .into(signal_name)
        .csv(csv_str)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|                |                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| _signal\_name_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                      |
| _csv\_str_     | Comma separated attribute values in the right order (of their definition in the <span style="font-family:Courier New;">signal</span>) |

### Return values
|            |                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _bios.models.InsertResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/insert-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _csv\_str_ is not a string                   |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                     |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
try {
    final var statement = Bios.isql().insert()
      .into(signalName)
      .csv("29/06/2020,AF,234,21")
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|              |                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                      |
| _csvStr_     | Comma separated attribute values in the right order (of their definition in the <span style="font-family:Courier New;">signal</span>) |

### Return values
|            |                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.InsertResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/insert-response) for details |

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
    const signalName = "covidDataSignal";
    const statement = bios
        .iSqlStatement()
        .insert()
        .into(signalName)
        .csv("29/06/2020,AF,234,21")
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|              |                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                      |
| _csv_        | Comma separated attribute values in the right order (of their definition in the <span style="font-family:Courier New;">signal</span>) |

### Return values
|            |                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| _response_ | _InsertISqlResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/insert-response) for details |

### Errors

A _BiosClientError_ object is returned. Possible errors could be -

| Error Code     | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| UNAUTHORIZED   | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT      | If there are validation failures                                                     |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

<!-- tabs:end -->
