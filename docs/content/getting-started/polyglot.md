# Polyglot Capabilities

<br/>

<p align="center">
    <img src="/docs/images/polyglot.png" style="width:80%">
</p>

<br/>

Building upon <span style="font-family:Courier New;">signals</span> and
<span style="font-family:Courier New;">contexts</span>, bi(OS) ships with the most useful polyglot
capabilities[^4] without the polyglot persistence tax. Moreover, developers can access these features using <span style="font-family:Courier New;">isQL</span>, a
uniform API across different formats. Some of the high level examples of bi(OS)’s polyglot capabilities are -

* <span style="font-family:Courier New;">JSON</span> - bi(OS) can ingest <span style="font-family:Courier New;">JSON</span> and make it <span style="font-family:Courier New;">SQL</span>-ready for consumption. Nested JSON can be flattened at ingest time
  and joined at query time to avoid the <span style="font-family:Courier New;">JSON</span> tax data analysts have to pay. It is possible to store raw <span style="font-family:Courier New;">JSON</span> BLOBs
  for later processing, although it is usually unnecessary due to the advanced schema management capabilities of bi(OS).[^5]
* Time series - <span style="font-family:Courier New;">signals</span> and audit logs from <span style="font-family:Courier New;">contexts</span> can be
  considered time series primitives that can be indexed, aggregated, and set up for alerts.
* In-memory - features of <span style="font-family:Courier New;">signals</span> and most accessed <span style="font-family:Courier New;">context entries</span> are kept in memory for quicker access.
* Index - an index consisting of any number of user-defined columns can be declared to be auto-populated at high-frequency intervals (e.g. 1 min).
* Aggregation - bi(OS) auto-computes a variety of data sketches for each column at a user-defined frequency
  (e.g., <span style="font-family:Courier New;">1m</span>, <span style="font-family:Courier New;">5m</span>, or
  <span style="font-family:Courier New;">15m</span>). Further, bi(OS) can compute aggregations on numeric fields with user-defined composite keys,
  which get stored alongside the index.
* Key-value - features from <span style="font-family:Courier New;">signals</span> and <span style="font-family:Courier New;">contexts</span> represent key-value tables.

Further, bi(OS) supports schema management, deterministic backfilling, and auto-computation of features and sketches.[^5]  In summary, instead of gluing together 6+ specialized data stores, developers can use bi(OS) as a single multi-model
data store with <span style="font-family:Courier New;">SQL</span>-friendly dialect, and best price-performance on the cloud.

[^4]: bi(OS) provides the most common polyglot primitives to make use cases live in days without attempting feature parity. <br/>
[^5]: See the section [Operate](https://bios.isima.io/docs/content/developer-guide/operate). <br/>
