# LIST CONTEXTS

All the <span style="font-family:Courier New;">contexts</span> provisioned in bi(OS) can be listed using the **get_contexts()** method
as shown below -

```python
try:
  ctx_list = session.get_contexts()
except ServiceError as err:
  print(err)
```
### Input parameters

|                    |                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------- |
| _names_ (Optional) | list of names to filter the <span style="font-family:Courier New;">contexts</span> |

### Return values

|              |                                                                                       |
| ------------ | ------------------------------------------------------------------------------------- |
| **ctx_list** | List of _dict_ containing <span style="font-family:Courier New;">context</span> names |
Example:
```python
[
  {'contextName': 'product_context'},
  {'contextName': 'device_context'}
]
```
### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
