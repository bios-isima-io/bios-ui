# Query Languages

<br/>

<p align="center">
    <img src="/docs/images/isql_sql.png" style="width:80%">
</p>

<br/>

## isQL

bi(OS) ships[^6]  with an <span style="font-family:Courier New;">SQL</span>-friendly dialect emphasizing low latency and high determinism. It provides <span style="font-family:Courier New;">Java, Python</span>,
and <span style="font-family:Courier New;">JavaScript</span> SDKs out of the box. Under the hood, these SDKs use a highly performant C++ implementation.[^7]  Furthermore,
<span style="font-family:Courier New;">isQL</span> enforces strict restrictions on the application by -

* Avoiding query-time joins between <span style="font-family:Courier New;">signals</span> and <span style="font-family:Courier New;">contexts</span>. Using <span style="font-family:Courier New;">isQL</span>, it is possible to perform such joins at
  ingest-time, query multiple tables, and perform joins at query-time within the application. <span style="font-family:Courier New;">isQL</span> does support
  query-time joins between multiple <span style="font-family:Courier New;">contexts</span>. This approach ensures deterministic SLAs for micro-services while
  providing flexibility for ad-hoc joins amongst <span style="font-family:Courier New;">contexts</span>.
* Advocating preprocessing. Much of real-world ETL can be converted into user-defined functions (UDFs written
  in <span style="font-family:Courier New;">Python</span>), declarative ingest-time joins, and index/aggregate capability of bi(OS).[^8]  There is always a possibility
  to perform micro-batches using <span style="font-family:Courier New;">isQL</span> if needed.

The <span style="font-family:Courier New;">isQL</span> query optimizer uses raw data, indexes, sketches, or aggregations as needed to deliver the most
predictable SLA for the query. <span style="font-family:Courier New;">isQL</span> targets micro-service, micro-batch, and stream-processing developers who
care about deterministic latencies. (e.g. p99 latencies < 100ms)

## SQL
bi(OS) provides a scale-out <span style="font-family:Courier New;">SQL</span> capability[^9]  to support ad-hoc querying or traditional applications such as BI tools. While this layer also attempts to use as much optimization within bi(OS) as possible, it can’t be as efficient as
<span style="font-family:Courier New;">isQL</span>.

This combination of <span style="font-family:Courier New;">isQL</span> and <span style="font-family:Courier New;">SQL</span> support out of the box is unique in the industry. Developers can use the best
dialect to meet their application’s needs.


[^6]: See <span style="font-family:Courier New;">isQL</span> reference in Appendix A. <br/>
[^7]: A C++ SDK is coming soon. <br/>
[^8]: See the section [Process](https://bios.isima.io/docs/content/developer-guide/process). <br/>
[^9]: Powered  by Apache Trino and optimized for bi(OS)-specific constructs. <br/>
