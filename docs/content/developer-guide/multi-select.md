# EXECUTE MULTIPLE SELECT REQUESTS WITH A SINGLE CALL

bi(OS) supports executing multiple select requests with a single call. This helps in optimizing network overhead in executing multiple requests.

**Ex**: Let assume you need to retrieve some metric for a specific 15 minute interval, for previous 30 days. Normally, you would have to loop thru
and execute multiple statements. This can be optimized with the **multi_execute** statement as show below -

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

start = bios.time.now()
delta = -bios.time.minutes(15)
window_size_in_ms = bios.time.minutes(15)
try:
    queries = []
    for _ in range(0, 30):
        req = (
            bios.isql()
                .select("avg(reportedCases)")
                .from_signal("covidDataSignal")
                .group_by(["countryName"])
                .tumbling_window(window_size_in_ms)
                .time_range(start, delta)
                .build()
            )
        start -= bios.time.days(1)
        queries.append(req)
    responses = session.multi_execute(*queries)
except ServiceError as err:
    print(
        "Select Error. code -> " + str(err.error_code) + ", message -> " + err.message
    )
```

### Input parameters

|                        |                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signal\_name_         | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_                | Milliseconds since epoch                                                                                    |
| _delta_                | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_           | attributes that need to be fetched                                                                          |
| _group\_by_            | The attribute on which to group the data                                                                    |
| _window\_size\_in\_ms_ | Tumbling window size in milliseconds                                                                        |

### Return values
|             |                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------- |
| _responses_ | Array of _bios.models.select_response.SelectResponse_: Refer [here](#select-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _start_ and _delta_ are not integers<br>If group_by is not a list<br>If hop_size_in_ms, num_hops are not integers |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                                                                                   |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist                                                                      |
| BAD_INPUT        | If there are validation failures                                                                                                                          |

For a complete list of error codes please refer to the <a href="/content/developer-guide/exceptions">Exception Handling</a> section

### **Java**

```java
import java.time.Duration;
simport io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;


final String signalName = "covidDataSignal";
long start = System.currentTimeMillis();
long delta = -60 * 60 * 1000;
long windowSizeInMillis = 10 * 60 * 1000;
try {
    List<ISql.SignalSelect> statements = new ArrayList<>();
    for (int i = 0; i < 30; i++) {
      final var statement = Bios.isql().select("avg(reportedCases)")
              .fromSignal(signalName)
              .groupBy("countryCode")
              .tumblingWindow(Duration.ofMillis(windowSizeInMillis))
              .timeRange(start, delta)
              .build();
      statements.add(statement);
      start -= 86400000;
    }
    final var response = session.multiExecute((ISql.SignalSelect[]) statements.toArray());
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|                      |                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signalName_         | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_              | Milliseconds since epoch                                                                                    |
| _delta_              | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_         | attributes / metrics that need to be fetched                                                                |
| _groupBy_            | The attribute on which to group the data                                                                    |
| _windowSizeInMillis_ | _tumbling_<br> - window size<br> - TimeUnit for the window                                                  |

### Return values
|             |                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------- |
| _responses_ | List of _io.isima.bios.models.SelectResponse_: Refer [here](#select-response) for details |

### Errors

A _BiosClientException_ object is returned. Possible errors could be -

| Error Code     | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| UNAUTHORIZED   | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT      | If there are validation failures                                                     |

For a complete list of error codes please refer to the <a href="/content/developer-guide/exceptions">Exception Handling</a> section

### **Javascript**
```javascript
import bios from "bios-sdk";

try {
    const signalName = "covidDataSignal";
    const start = bios.time.now();
    const delta = bios.time.minutes(-15);
    const attribute = "avg(reportedCases)";
    const windowSizeInMillis = bios.time.minutes(15);

    const statements = [];
    for (let i = 0; i < 30; i++) {
        const statement = bios
          .iSqlStatement()
          .select(attribute)
          .from(signalName)
          .groupBy("countryName")
          .tumblingWindow(windowSizeInMillis)
          .snappedTimeRange(start, delta)
          .build();
        start = start - bios.time.days(1)
        statements.push(statement)
    }
    const responses = await bios.multiExecute(...statements);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|                      |                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signalName_         | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_              | Milliseconds since epoch                                                                                    |
| _delta_              | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_         | Comma separated attribute names that need to be fetched                                                     |
| _groupBy_            | Comma separated strings of attribute names on which to group                                                |
| _windowSizeInMillis_ | Tumbling window size                                                                                        |
|                      |
### Return values
|            |                                                                                   |
| ---------- | --------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.SelectResponse_: Refer [here](#select-response) for details |

### Errors

A _BiosClientError_ object is returned. Possible errors could be -

| Error Code     | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| UNAUTHORIZED   | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |
| BAD_INPUT      | If there are validation failures                                                     |

For a complete list of error codes please refer to the <a href="/content/developer-guide/exceptions">Exception Handling</a> section

<!-- tabs:end -->
