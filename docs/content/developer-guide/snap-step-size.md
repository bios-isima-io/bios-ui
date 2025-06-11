# TUMBLING/HOPPING AGGREGATES WITH SNAP STEP SIZE

The _time range_ specified in tumbling/hopping aggregates always snaps the start time to the _floor_ of the nearest window size.

Instead of defaulting to the _floor_ of the nearest window size, the _time range_ can take a _snap step_ parameter which gives control on where the snap occurs.

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

signal_name = 'covidDataSignal'
start, delta = bios.time.now(), -bios.time.minutes(60)
window_size_in_ms = bios.time.minutes(30)
snap_step_in_ms = bios.time.minutes(10)
try:
    request  =(
        bios.isql().select("count()")
            .from_signal(signal_name)
            .tumbling_window(window_size_in_ms)
            .time_range(start, delta, snap_step_in_ms)
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
| _snap\_step\_in\_ms_   | Snap step size in milliseconds                                                                              |

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
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
long start = System.currentTimeMillis();
long delta = -60 * 60 * 1000;
long windowSizeInMillis = 10 * 60 * 1000;
long alignmentDurationInMillis = 5 * 60 * 1000;
try {
    final var statement = Bios.isql().select("sum(reportedCases)", "sum(reportedDeaths)")
      .fromSignal(signalName)
      .groupBy("countryCode")
      .tumblingWindow(Duration.ofMillis(windowSizeInMillis))
      .timeRange(start, delta, alignmentDurationInMillis)
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|                             |                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signalName_                | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_                     | Milliseconds since epoch                                                                                    |
| _delta_                     | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_                | attributes / metrics that need to be fetched                                                                |
| _windowSizeInMillis_        | Tumbling window size in millis                                                                              |
| _alignmentDurationInMillis_ | Snap step size in millis                                                                                    |

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
    const start = bios.time.now();
    const delta = bios.time.minutes(-60);
    const windowSize = bios.time.minutes(30)
    const snapStepSize = bios.time.minutes(10)
    const attribute = "count()";

    const statement = bios
        .iSqlStatement()
        .select(attribute)
        .from(signalName)
        .tumblingWindow(windowSize)
        .snappedTimeRange(start, delta, snapStepSize)
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|                |                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| _signalName_   | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_        | Milliseconds since epoch                                                                                    |
| _delta_        | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_   | Comma separated attribute names that need to be fetched                                                     |
| _windowSize_   | Tumbling window size                                                                                        |
| _snapStepSize_ | Snap step size                                                                                              |

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
