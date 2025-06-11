# GET SIGNAL

The configuration for a specific _signal_ can be fetched by its name using **get_signal()** method as shown below -

```python
SIGNAL_NAME = 'covidDataSignal'
try:
  signal = session.get_signal(SIGNAL_NAME)
except ServiceError as err:
  print(err)
```
### Input parameters

|             |                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------- |
| SIGNAL_NAME | The name of the <span style="font-family:Courier New;">signal</span> whose config must be fetched |

### Return values

|          |                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| _signal_ | A _python dict_ representing the JSON config of the created <span style="font-family:Courier New;">signal</span> |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| INVALID_ARGUMENT | If SIGNAL_NAME parameter is not a _string_                                           |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
