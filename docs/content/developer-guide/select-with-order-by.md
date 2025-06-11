# SELECT WITH *ORDER_BY*

The _order\_by_ clause  orders the output data based on the provided  attribute. Currently, only one attribute is
supported for _order\_by_

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

signal_name = 'covidDataSignal'
start, delta = bios.time.now(), -bios.time.minutes(5)
try:
    request = (
        bios.isql()
        .select()
        .from_signal(signal_name)
        .where("reportedCases > 100")
        .order_by("countryName")
        .time_range(start, delta)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|                |                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| _signal\_name_ | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_        | Milliseconds since epoch                                                                                    |
| _delta_        | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_   | attributes that need to be fetched                                                                          |
| _order\_by_    | The attribute on which to order the data                                                                    |

### Return values
|            |                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| _response_ | _bios.models.select_response.SelectResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/select-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _start_ and _delta_ are not integers<br>If WHERE clause is not a string<br>If order_by  is not a string |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                                                                         |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist                                                            |
| BAD_INPUT        | If there are validation failures                                                                                                                |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
long start = System.currentTimeMillis();
long delta = -5 * 60 * 1000;
try {
    final var statement = Bios.isql().select()
      .fromSignal(signalName)
      .where("reportedCases > 100")
      .orderBy("countryName")
      .timeRange(start, delta)
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|              |                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_      | Milliseconds since epoch                                                                                    |
| _delta_      | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_ | attributes that need to be fetched                                                                          |
| _where_      | Filter the fetched data using this clause                                                                   |
| _orderBy_    | The attribute on which to order the data                                                                    |

### Return values
|            |                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.SelectResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/select-response) for details |

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
    const start = bios.time.now();
    const delta = bios.time.minutes(-10);
    const attribute = "sum(reportedCases)";

    const statement = bios
        .iSqlStatement()
        .select(attribute)
        .from(signalName)
        .groupBy("countryName")
        .orderBy({
            key: "countryName",
            order: "asc"
        })
        .timeRange(start, delta)
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|              |                                                                                                                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                                                                                                                                                                        |
| _start_      | Milliseconds since epoch                                                                                                                                                                                                                                |
| _delta_      | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time                                                                                                                                             |
| _attributes_ | Comma separated attribute names that need to be fetched                                                                                                                                                                                                 |
| _groupBy_    | Comma separated strings of attribute names on which to group                                                                                                                                                                                            |
| _orderBy_    | OrderByFinalSpecifier is an object with key and order keys.<br><br>The specifier allows the following -<br> - Specific orderby attribute<br> - Sort ascending or descending<br><br>The following are valid -<br> - { key: "countryName", order: "asc" } |
|              |
### Return values
|            |                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.SelectResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/select-response) for details |

### Errors

A _BiosClientError_ object is returned. Possible errors could be -

| Error Code     | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| UNAUTHORIZED   | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT      | If there are validation failures                                                     |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

<!-- tabs:end -->
