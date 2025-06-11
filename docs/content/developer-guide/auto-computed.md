# SELECT WITH *AUTO COMPUTED FEATURES*

Sketch metrics can be queried similar to simple metrics as shown below -

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

start = bios.time.now()
delta = -(bios.time.hours(1))
window_size_in_ms = bios.time.minutes(15)
try:
    req = (
        bios.isql()
        .select(
            "avg(reportedCases)",
            "stddev(reportedCases)",
            "variance(reportedCases)",
            "skewness(reportedCases)",
            "kurtosis(reportedCases)",
            "sum(reportedCases)",
            "sum2(reportedCases)",
            "sum3(reportedCases)",
            "p0_01(reportedCases)",
            "p10(reportedCases)",
            "p25(reportedCases)",
            "p50(reportedCases)",
            "p90(reportedCases)",
            "p99(reportedCases)",
            "p99_99(reportedCases)",
            "min(reportedCases)",
            "max(reportedCases)",
            "dclb1(reportedCases)",
            "dclb2(reportedCases)",
            "dclb3(reportedCases)",
            "dcub1(reportedCases)",
            "dcub2(reportedCases)",
            "distinctcount(reportedCases)",
            "numsamples(reportedCases)",
            "samplingfraction(reportedCases)"
        )
        .from_signal("covidDataSignal")
        .tumbling_window(window_size_in_ms)
        .time_range(start, delta)
        .build()
    )
    res = session.execute(req)
    for window in res.get_data_windows():
        for record in window.records:
            print(record)
except ServiceError as err:
    print(
        "Select Error. code -> " + str(err.error_code) + ", message -> " + err.message
    )
```

## Input parameters

|                        |                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| _start_                | Milliseconds since epoch                                                                                    |
| _delta_                | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _window\_size\_in\_ms_ | Tumbling window size in milliseconds                                                                        |

### Return values
|            |                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------- |
| _response_ | _bios.models.select_response.SelectResponse_: Refer [here](#select-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _start_ and _delta_ are not integers<br>If group_by is not a list<br>If hop_size_in_ms, num_hops are not integers<br>If _limit_ is not an integer |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                                                                                                                   |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist                                                                                                      |
| BAD_INPUT        | If there are validation failures                                                                                                                                                          |

For a complete list of error codes please refer to the <a href="/content/developer-guide/exceptions">Exception Handling</a> section


### **Java**

```java
import java.time.Duration;
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
long start = System.currentTimeMillis();
long delta = -60 * 60 * 1000;
long windowSizeInMillis = 10 * 60 * 1000;
try {
    final var statement = Bios.isql().select("avg(reportedCases)", "variance(reportedDeaths)", "kurtosis(reportedDeaths)")
      .fromSignal(signalName)
      .tumblingWindow(Duration.ofMillis(windowSizeInMillis))
      .timeRange(start, delta)
      .build();
    final var response = session.execute(statement);
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
| _windowSizeInMillis_ | _tumbling_<br> - window size<br> - TimeUnit for the window                                                  |

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
    const delta = bios.time.minutes(-10);
    const window_size_in_ms = bios.time.minutes(1);
    const attribute = "kurtosis(reportedCases)";

    const statement = bios
        .iSqlStatement()
        .select(attribute)
        .from(signalName)
        .tumblingWindow(window_size_in_ms)
        .snappedTimeRange(start, delta)
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|                        |                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signalName_           | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_                | Milliseconds since epoch                                                                                    |
| _delta_                | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attribute_            | attribute that need to be fetched                                                                           |
| _window\_size\_in\_ms_ | Tumbling window size                                                                                        |

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
