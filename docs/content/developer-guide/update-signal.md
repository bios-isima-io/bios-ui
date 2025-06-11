# UPDATE SIGNAL

<span style="font-family:Courier New;">Signal</span> configuration can be updated using the **update_signal()** method as shown below -

```python
SIGNAL_NAME = 'covidDataSignal'
try:
  signal = session.update_signal(SIGNAL_NAME, signal_config)
except ServiceError as err:
  print(err)
```
### Input parameters

|                                                                             |                                                                                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [signal_config](https://bios.isima.io/docs/content/developer-guide/signals) | A JSON string or python dict containing the <span style="font-family:Courier New;">signal</span> configuration |

### Return values

|          |                                                                      |
| -------- | -------------------------------------------------------------------- |
| _signal_ | A _python dict_ representing the updated JSON config of the _signal_ |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code       | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| INVALID_ARGUMENT | If SIGNAL_NAME parameter is not a string<br/>If _signal_config_ is not a string or dict |
| UNAUTHORIZED     | If the user does not have required permissions to perform the operation                 |
| NO_SUCH_STREAM   | If a <span style="font-family:Courier New;">signal</span> by the name does not exist    |
| BAD_INPUT        | If _signal_config_ is not valid or if validations fail                                  |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section

>
> The following <span style="font-family:Courier New;">signal</span> updates can be applied while ingestion is live -
> * _Attributes_: can be added and/or removed
> * _Enrichments_: can be added /and or removed
> * _Features_: can be added and/or removed.  Any new features are retroactively computed for already ingested data
>

>
> **NOTE**:
> * For all schema attribute additions, a default value for the attribute must be specified.
    If a new attribute is added, a default value must be specified
> * If an attribute is added to an existing  enrichment, it should have a default / fill-in value even if
    the _missingLookupPolicy_ is set to _Reject_
>
