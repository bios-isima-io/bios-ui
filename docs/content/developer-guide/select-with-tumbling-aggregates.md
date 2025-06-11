# SELECT WITH *TUMBLING AGGREGATES*

>
> There are two aspects to defining tumbling window aggregates -
> * Window Size
> * Time Range
>
The number of data windows returned would be - (_**snapped time range**_ / _**window size**_)

Since the time range (_start_ and _delta_) can fall in between window slots, the time range parameters are
snapped to the nearest window size (_floor_)

Refer the figure below for an overview of tumbling window features:

<br/>

<p align="center">
    <img src="/docs/images/tumbling_window.png" style="width:50%" />
</p>

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

signal_name = 'covidDataSignal'
start, delta = bios.time.now(), -bios.time.minutes(60)
window_size_in_ms = bios.time.minutes(10)
try:
    request = (
        bios.isql()
        .select("sum(reportedCases)", "sum(reportedDeaths)")
        .from_signal(signal_name)
        .group_by(["countryName"])
        .tumbling_window(window_size_in_ms)
        .time_range(start, delta)
        .build()
    )
    response = session.execute(request)
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
| _group\_by_            | The attribute on which to group the data                                                                    |
| _window\_size\_in\_ms_ | Tumbling window size in milliseconds                                                                        |

### Return values
|            |                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| _response_ | _bios.models.select_response.SelectResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/select-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _start_ and _delta_ are not integers<br>If group_by is not a list<br>If hop_size_in_ms, num_hops are not integers |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                                                                                   |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist                                                                      |
| BAD_INPUT        | If there are validation failures                                                                                                                          |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import java.time.Duration;
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String signalName = "covidDataSignal";
long start = System.currentTimeMillis();
long delta = -60 * 60 * 1000;
long windowSizeInMillis = 10 * 60 * 1000;s
try {
    final var statement = Bios.isql().select("sum(reportedCases)", "sum(reportedDeaths)")
      .fromSignal(signalName)
      .groupBy("countryCode")
      .tumblingWindow(Duration.ofMillis(windowSizeInMillis))
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
| _attributes_ | attributes / metrics that need to be fetched                                                                |
| _groupBy_    | The attribute on which to group the data                                                                    |
| _window_     | _tumbling_<br> - window size<br> - TimeUnit for the window                                                  |

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
    const delta = bios.time.minutes(-60);
    const attribute = "sum(reportedCases)";
    const windowSizeInMillis = bios.time.minutes(10);

    const statement = bios
        .iSqlStatement()
        .select(attribute)
        .from(signalName)
        .groupBy("countryName")
        .tumblingWindow(windowSizeInMillis)
        .snappedTimeRange(start, delta)
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
| _groupBy_    | Comma separated strings of attribute names on which to group                                                |
| _window_     | Tumbling window size                                                                                        |
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
