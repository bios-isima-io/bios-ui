# Data Plane Operations

The table below summarizes the data-plane operations supported by <span style="font-family:Courier New;">isQL</span>

| Operation | Context  |  Signal  |
| --------- | :------: | :------: |
| _insert_  | &#10060; | &#10004; |
| _update_  | &#10004; | &#10060; |
| _upsert_  | &#10004; | &#10060; |
| _delete_  | &#10004; | &#10060; |
| _select_  | &#10004; | &#10004; |

>
> Data within <span style="font-family:Courier New;">signals</span> has a configurable TTL(time-to-live), after which, it gets deleted.  The default values for different constructs are
> * <span style="font-family:Courier New;">signals</span> - 60 days
> * <span style="font-family:Courier New;">contexts</span> - 60 days
> * features - 90 days
>

The sections below cover SDK usage using examples in Python, Java and JavaScript.

As discussed previously, a *session* object is required with right permissions for performing the operations below.
For all the examples below, we will use the *countryContext* and *covidDataSignal* defined in the previous section.
