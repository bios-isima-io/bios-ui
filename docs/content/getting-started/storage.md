# Storage Engines

bi(OS)’s storage engines model the human sensory system -
<span style="font-family:Courier New;">signals</span> and
<span style="font-family:Courier New;">contexts</span>.
These loosely represent an advanced version of <span style="font-family:Courier New;">
facts</span> and <span style="font-family:Courier New;">dimensions</span> in analytics.

<br/>

<p align="center">
    <img src="/docs/images/storage_primitives.png" style="width:40%">
</p>

<br/>

Both <span style="font-family:Courier New;">signals</span> and <span style="font-family:Courier New;">contexts</span> -
* Support semi-structured data - i.e. are a collection of key-value pairs.
* Are schema-oriented with an ability to define advanced constraints on columns.
* Support live updates to schema - <span style="font-family:Courier New;">create, update,</span> and <span style="font-family:Courier New;">delete</span> - during
  ingestion, with an ability to perform <span style="font-family:Courier New;">selects</span> across schema versions.
* Support a declarative mechanism to index, aggregate, and compute features.
* Support TTL (time-to-live) settings - Developers can configure retention policies for data stored within bi(OS). The default TTL is 60 days for <span style="font-family:Courier New;">signals</span> and infinite for <span style="font-family:Courier New;">contexts</span>.[^3]


[^3]: Configurable TTL support for <span style="font-family:Courier New;">signals</span> is coming soon. <br/>
