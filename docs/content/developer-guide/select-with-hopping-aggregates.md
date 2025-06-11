# SELECT WITH *HOPPING AGGREGATES*

>
> There  are 4 parts to a hopping window aggregate -
> * Time Range - overall duration
> * Hop size
> * Number of hops per window
> * Window Size (which is calculated as (Hop size) * (number of hops per window)
>
The number of data windows returned would be - (**snapped time range** / **window size**)

Since the time range (_start_ and _delta_) can fall in between window slots, the time range parameters are
snapped to the nearest window size (_floor_)

Refer the figure below for an overview on hopping window aggregates
<br/>

<p align="center">
    <img src="/docs/images/sliding_window.png" style="width:50%" />
</p>

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

signal_name = 'covidDataSignal'
start, delta = bios.time.now(), -bios.time.minutes(60)
hop_size_in_ms = bios.time.minutes(15)
num_hops= 3
try:
    request = (
        bios.isql()
        .select("sum(reportedCases)", "sum(reportedDeaths)")
        .from_signal(signal_name)
        .group_by(["countryName"])
        .hopping_window(hop_size_in_ms, num_hops)
        .time_range(start, delta)
        .build()
    )
    response = session.execute(request)
except ServiceError as err:
    print(err)
```
### Input parameters

|                     |                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| _signal\_name_      | Name of the <span style="font-family:Courier New;">signal</span>                                            |
| _start_             | Milliseconds since epoch                                                                                    |
| _delta_             | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time |
| _attributes_        | attributes that need to be fetched                                                                          |
| _group\_by_         | The attribute on which to group the data                                                                    |
| _hop\_size\_in\_ms_ | The hop interval size  window size in milliseconds                                                          |
| _num_hops_          | Number of hops per window                                                                                   |


### Return values
|            |                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| _response_ | _bios.models.select_response.SelectResponse_: Refer [here](https://bios.isima.io/docs/content/developer-guide/select-response) for details |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _signal\_name_ is not a string<br>If _start_ and _delta_ are not integers<br>If group_by is not a list<br>If window_size_in_ms is not an integer |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                                                                             |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist                                                                |
| BAD_INPUT        | If there are validation failures                                                                                                                    |

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
long windowSizeInMillis = 15 * 60 * 1000;
long hopsize = 5 * 60 * 1000;
try {
    final var statement = Bios.isql().select("sum(reportedCases)", "sum(reportedDeaths)")
      .fromSignal(signalName)
      .groupBy("countryCode")
      .hoppingWindow(Duration.ofMillis(windowSizeInMillis), Duration.ofMillis(hopsize))
      .timeRange(start, delta)
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|              |                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| _signalName_ | Name of the <span style="font-family:Courier New;">signal</span>                                                       |
| _start_      | Milliseconds since epoch                                                                                               |
| _delta_      | Positive or negative value depending on whether you want to fetch data from ahead  or behind the start time            |
| _attributes_ | attributes / metrics that need to be fetched                                                                           |
| _groupBy_    | The attribute on which to group the data                                                                               |
| _window_     | _hopping_<br><br>This takes 3 arguments<br> - Hop Size<br> - Time unit for the window<br> - Number of hops in a window |

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
        .slidingWindow(bios.time.minutes(1), 2)
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
| _window_     | Takes 2 arguments<br> - hop size in milliseconds<br> - Number of hop/slide intervals in a window            |

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
