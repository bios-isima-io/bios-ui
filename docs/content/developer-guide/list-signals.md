# LIST SIGNALS

All the <span style="font-family:Courier New;">signals</span> provisioned in bi(OS) can be listed using the **get_signals()** method as shown below -

```python
try:
  signal_list = admin_session.get_signals()
except ServiceError as err:
  print(err)
```
### Input parameters

|                    |                                                                                   |
| ------------------ | --------------------------------------------------------------------------------- |
| _names_ (Optional) | list of names to filter the <span style="font-family:Courier New;">signals</span> |

### Return values

|                 |                                                                                      |
| --------------- | ------------------------------------------------------------------------------------ |
| **signal_list** | List of _dict_ containing <span style="font-family:Courier New;">signal</span> names |

Example:
```python
[
  {'signalName': 'special_page_viewed_signal'},
  {'signalName': 'order_placed_signal'}
]
```
### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code   | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| UNAUTHORIZED | If the user does not have required permissions to perform the operation |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
