# DELETE SIGNAL

A <span style="font-family:Courier New;">signal</span> can be deleted by its name using the **delete_signal()** method as show below -

```python
SIGNAL_NAME = 'covidDataSignal'
try:
  session.delete_signal(SIGNAL_NAME)
except ServiceError as err:
  print(err)
```
### Input parameters

|             |                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------- |
| SIGNAL_NAME | The name of the <span style="font-family:Courier New;">signal</span> that must be deleted |

### Return values
NONE

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| INVALID_ARGUMENT | If SIGNAL_NAME parameter is not a string                                             |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation              |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
