# CREATE CONTEXT

A <span style="font-family:Courier New;">context</span> can be created using the **create_context()** method as shown below -

```python
try:
  ctx = session.create_context(context_config)
except ServiceError as err:
  print(err)
```
### Input parameters

|                                                                               |                                                                                                |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [context_config](https://bios.isima.io/docs/content/developer-guide/contexts) | A JSON dict containing the <span style="font-family:Courier New;">context</span> configuration |

### Return values

|       |                                                                                                                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _ctx_ | A _python dict_ representing the JSON config of the created <span style="font-family:Courier New;">context</span>. It includes a  ‘version’ number identifying the current deployed version for reference |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| INVALID_ARGUMENT | If _context_config_ parameter is not a string or dict                   |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation |
| BAD_INPUT        | If _context_config_ is not valid or if validations fail                 |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
