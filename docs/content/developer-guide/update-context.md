# UPDATE CONTEXT
<span style="font-family:Courier New;">Context</span> config can be updated using the **update_context()** method as shown below -

```python
CONTEXT_NAME = 'countryContext'
try:
  ctx = session.update_context(CONTEXT_NAME, context_config)
except ServiceError as err:
  print(err)
```
### Input parameters

|                                                                               |                                                                                                    |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| CONTEXT_NAME                                                                  | The name of the <span style="font-family:Courier New;">context</span> whose config must be fetched |
| [context_config](https://bios.isima.io/docs/content/developer-guide/contexts) | A JSON dict containing the <span style="font-family:Courier New;">context</span> configuration     |

### Return values

|       |                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------- |
| _ctx_ | A _python dict_ representing the JSON config of the updated <span style="font-family:Courier New;">context</span> |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If CONTEXT_NAME parameter is not a string<br/>If _context_config_ parameter is not a string or dict |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                             |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">context</span> by the name does not exist               |
| BAD_INPUT        | If _context_config_ is not valid or if validations fails                                            |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) sections

bi(OS) allows attributes to be dropped/added as part of the update while ingestion is live
>
>**NOTE**:
>
> * A <span style="font-family:Courier New;">context</span> attribute which is used in <span style="font-family:Courier New;">signal</span> enrichment can’t be removed
> * _primaryKey_ name or it’s type can’t be modified
> * Default values must be provided for all attributes (except the _primaryKey_
    ) whenever any change is done
