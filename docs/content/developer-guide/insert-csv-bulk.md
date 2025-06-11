# INSERT CSV BULK

This is similar to csv <span style="font-family:Courier New;">insert</span>, except that  we supply a list of records instead of a single record. This is
highly performant and is recommended for high-throughput ingestion.

<!-- tabs:start -->

### **Python**

```python
from bios import ServiceError

signal_name = 'covidDataSignal'
data = ["05/06/2020,AF,787,6",
        "21/06/2020,AL,53,1",
        "13/06/2020,DZ,109,10"]
try:
    request = (
        bios.isql()
        .insert()
        .into(signal_name)
        .csv_bulk(data)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|                |                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| _signal\_name_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                                |
| _data_         | A list of comma separated attribute values in the right order (of their definition in the <span style="font-family:Courier New;">signal</span>) |

### Return values
|            |                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _bios.models.InsertResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/insert-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _data_ is not a _list_                       |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                     |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import java.util.List;
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
try {
    final var statement = Bios.isql().insert()
      .into(signalName)
      .csvBulk(List.of("29/06/2020,AF,234,21", "30/06/2020,AL,298,37"))
      .build();
    final var response = session.execute(statement);
} catch (BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|              |                                                                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                              |
| _records_    | List of comma separated attribute values in the right order (of their definition in the <span style="font-family:Courier New;">signal</span>) |

### Return values
|            |                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.InsertResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/insert-response) for details |

### Errors

A _BiosClientException_ object is returned. Possible errors could be -

| Error Code     | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| UNAUTHORIZED   | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT      | If there are validation failures                                                     |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Javascript**
```javascript
import bios from "bios-sdk";

try {
    const signalName = "covidDataSignal";
    const events = [
        "05/06/2020,AF,787,6",
        "21/06/2020,AL,53,1",
        "13/06/2020,DZ,109,10",
    ];

    const statement = bios
        .iSqlStatement()
        .insert()
        .into(signalName)
        .csvBulk(events)
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|              |                                                                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                              |
| _events_     | List of Comma separated attribute values in the right order (of their definition in the <span style="font-family:Courier New;">signal</span>) |

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
