# GET CONTEXT ENTRIES

To fetch entries from a <span style="font-family:Courier New;">context</span>, a select request should be made as shown below

<!-- tabs:start -->

### **Python**

```python
import bios
from bios import ServiceError

try:
    request = (
        bios.isql()
        .select()
        .from_context('countryContext')
        .where(keys=[["AF"], ["DZ"]])
        .build()
    )
    response = session.execute(request)
	for record in response.get_records():
    	print(record.attributes)
except ServiceError as err:
    print(err)
```
### Input parameters

|                 |                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------ |
| *from\_context* | <span style="font-family:Courier New;">Context</span> from which we need to fetch the data |
| *keys*          | The _primaryKey_ for which the entries need to be fetched                                  |

### Return values
|            |                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _bios.models.select_response.ContextRecords_. The ContextRecords class holds the list of records that were fetched. Each record in turn holds the attributes.<br>ContextRecord<br> → list of _bios.models.select_response.Record_<br> → list of attributes<br>Sample output from the above for loop would look like this<br>**['AF', 'Afghanistan', 38041757, 'Asia']**<br>**['DZ', 'Algeria', 43053054, 'Africa']** | <br> |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _from\_context_ is not a string or if the _keys_ are not a list                    |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                      |


For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

### **Java**

```java
import io.isima.bios.sdk.Bios;
import io.isima.bios.sdk.Session;
import io.isima.bios.sdk.exceptions.BiosClientException;

final String contextName = "countryContext";
try {
    final var statement = Bios.isql().select()
      .fromContext(contextName)
      .where(Bios.keys().in("AF", "AL"))
      .build();
    final var response = session.execute(statement);
} catch (final BiosClientException bce) {
    logger.error(bce.getMessage());
}
```

### Input parameters

|               |                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------- |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from  which we need to fetch the data |
| _contextKey_  | The _primaryKey_ for which the entries need to be fetched                                   |

### Return values
|            |                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | _io.isima.bios.models.ContextRecords_. The _ContextRecords_ class holds the list of records that were fetched. Each record in turn holds the _attributes_.<br>ContextRecord<br> → list of _bios.models.select_response.Record_<br> → list of attributes<br>Sample output from the above for loop would look like this<br>**['AF', 'Afghanistan', 38041757, 'Asia']**<br>**['DZ', 'Algeria', 43053054, 'Africa']** | <br> |

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
    const contextName = "countryContext";
    const primaryKeys = [
        ["AF"],
        ["DZ"]
    ];
    const statement = bios.iSqlStatement()
        .select()
        .fromContext(contextName)
        .where(...primaryKeys.map((pkeys) => bios.isql.keys(...pkeys)))
        .build();
    const response = await bios.execute(statement);
} catch (error) {
    console.log(error);
}
```
### Input parameters

|               |                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------ |
| _contextName_ | <span style="font-family:Courier New;">Context</span> from which we need to fetch the data |
| _primaryKey_  | The _primaryKey_ for which the entries need to be fetched                                  |

### Return values
|            |                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| _response_ | SelectContextISqlResponse. This contains following properties:<br>- entries: list of entries<br>- entries[i].attributes: list of attribute values |

### Errors

A _BiosClientError_ object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _contextName_ is not a string or if the _keys_ are not a list                      |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |
| BAD_INPUT        | If there are validation failures                                                      |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

<!-- tabs:end -->
