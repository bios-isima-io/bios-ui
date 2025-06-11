# CREATE SIGNAL

A _signal_ can be created using the **create_signal()** method as shown below -

```python
try:
  response = session.create_signal(signal_config)
except ServiceError as err:
  print(err)
```
### Input parameters

|                                                                             |                                                                                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [signal_config](https://bios.isima.io/docs/content/developer-guide/signals) | A JSON string or python dict containing the <span style="font-family:Courier New;">signal</span> configuration |

### Return values

|            |                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| _response_ | A _python dict_ representing the JSON config of the created <span style="font-family:Courier New;">signal</span> |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _signal_config_ parameter is not a string or dict                    |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation |
| BAD_INPUT        | If _signal_config_ is not valid or if validations fail                  |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
