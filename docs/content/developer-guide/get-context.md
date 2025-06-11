# GET CONTEXT

The configuration for a specific <span style="font-family:Courier New;">context</span> can be fetched by its name using **get_context()** 
method as shown below -

```python
CONTEXT_NAME = 'countryContext'
try:
  ctx = session.get_context(CONTEXT_NAME)
except ServiceError as err:
  print(err)
```
### Input parameters

|              |                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------- |
| CONTEXT_NAME | The name of the <span style="font-family:Courier New;">context</span> whose config must be fetched |

### Return values

|       |                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------- |
| _ctx_ | A _python dict_ representing the JSON config of the created <span style="font-family:Courier New;">context</span> |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If CONTEXT_NAME parameter is not a string                                             |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
