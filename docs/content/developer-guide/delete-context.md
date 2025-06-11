# DELETE CONTEXT
A <span style="font-family:Courier New;">context</span> can be deleted by its name, as long as it’s not enriching any of the <span style="font-family:Courier New;">signals</span> using
the **delete_context()** method as shown below -

```python
CONTEXT_NAME = 'countryContext'
try:
  session.delete_context(CONTEXT_NAME)
except ServiceError as err:
  print(err)
```
This operation is irreversible. It’s similar to dropping a table in RDBMS. All data in the <span style="font-family:Courier New;">context</span>
is deleted and the <span style="font-family:Courier New;">context</span> is dropped.

### Input parameters

|                                                                               |                                                                                                    |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| CONTEXT_NAME                                                                  | The name of the <span style="font-family:Courier New;">context</span> whose config must be fetched |
| [context_config](https://bios.isima.io/docs/content/developer-guide/contexts) | A JSON dict containing the <span style="font-family:Courier New;">context</span> configuration     |

### Return values
NONE

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If CONTEXT_NAME parameter is not a string                                             |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation               |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
