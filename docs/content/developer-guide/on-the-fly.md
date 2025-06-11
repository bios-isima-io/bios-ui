# ON THE FLY AGGREGATION

The _time range_ for tumbling/hopping windows always returns the computed aggregates for the nearest computed window.

If you need, up to the second real-time aggregates, bi(OS) sdk provides _on_the_fly_ compute capability as  shown below.

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

signal_name = 'covidDataSignal'
start, delta = bios.time.now() - bios.time.hours(1), bios.time.minutes(65)
window_size_in_ms = bios.time.minutes(5)
try:
    request  =(
        bios.isql().select("count()")
            .from_signal(signal_name)
            .tumbling_window(window_size_in_ms)
            .time_range(start, delta)
            .on_the_fly()
            .build()
    )
    res = session.execute(request)
except ServiceError as err:
  print(err)
```
### Input parameters

|                        |                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signal\_name_         | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_                | Milliseconds since epoch                                                                                    |
| _delta_                | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_           | attributes that need to be fetched                                                                          |
| _window\_size\_in\_ms_ | Tumbling window size in milliseconds                                                                        |

### Return values
|            |                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------- |
| _response_ | _bios.models.select_response.SelectResponse_: Refer [here](#select-response) for details |

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
import java.util.concurrent.TimeUnit;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.Instant;
import java.time.ZoneOffset;

import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.models.isql.SelectStatement;
import io.isima.bios.models.SelectResponse;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
long start = System.currentTimeMillis() - 60 * 60 * 1000;
OffsetDateTime startOffset = Instant.ofEpochMilli(start).atOffset(ZoneOffset.UTC);
final var delta = Duration.ofMinutes(65);
final var windowSize = Duration.ofMinutes(5);
try {
    final var statement = Bios.isql().select("count()")
        .fromSignal(signalName)
        .tumblingWindow(windowSize)
        .timeRange(startOffset, delta)
        .onTheFly()
        .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce);
}
```

### Input parameters

|              |                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| _attributes_ | attributes / metrics that need to be fetched                                                                |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _windowSize_ | Tumbling window size                                                                                        |
| _start_      | Milliseconds since epoch                                                                                    |
| _delta_      | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |

### Return values
|            |                                                                                   |
| ---------- | --------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.SelectResponse_: Refer [here](#select-response) for details |

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
    const start = bios.time.now() - bios.time.hours(1);
    const delta = bios.time.minutes(65);
    const windowSize = bios.time.minutes(5)
    const attribute = "count()";

    const statement = bios
        .iSqlStatement()
        .select(attribute)
        .from(signalName)
        .tumblingWindow(windowSize)
        .snappedTimeRange(start, delta)
        .onTheFly()
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|              |                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_      | Milliseconds since epoch                                                                                    |
| _delta_      | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_ | Comma separated attribute names that need to be fetched                                                     |
| _windowSize_ | Tumbling window size                                                                                        |

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
