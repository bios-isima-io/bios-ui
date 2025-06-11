# Concepts

### Connectors
Trino provides a SPI (service-provider-interface) to hook into a variety of data
sources.  Isima has built one using <span style="font-family:Courier New;
font-size:18px;">isQL</span> to connect to bi(OS).  Given this connector uses
<span style="font-family:Courier New;">isQL</span>’s SDKs  it
benefits from all the benefits of the <span style="font-family:Courier New;
font-size:18px;">isQL</span> capabilities, such as QoS guarantees between
inserts and selects.  For developers connecting to Isima’s self-serve
deployment, everything is pre-configured and ready to use - no installation or
configuration is necessary.

### Catalogs
Trino can connect across a variety of data sources via connectors and each of these sources exposes a catalog.  Each
connector maps to a single catalog and can contain 0-N schemas.  bi(OS) exposes a catalog called bios.  To list all
catalogs in the system -
```shell
trino> show catalogs;
 Catalog
---------
 bios
 system
(2 rows)
```
### Schemas
Schemas are a way to organize different types of tables. bi(OS) exposes six schemas[^86]  -
* <span style="font-family:Courier New;">signals</span> - This schema allows users to query time-windowed aggregates on signals - count, sum, min, max by user-defined dimensions defined on any <span style="font-family:Courier New;">signal</span>.
* <span style="font-family:Courier New;">signals_sketches</span> - This schema allows users to query time-windowed sketch functions - stddev, skewness, distinctcount, etc. on <span style="font-family:Courier New;">signals</span>.
* <span style="font-family:Courier New;">signals_raw</span> - This schema can be used to query raw data stored within <span style="font-family:Courier New;">signals</span>.
* <span style="font-family:Courier New;">contexts_raw</span> - This schema can be used to query raw data stored within <span style="font-family:Courier New;">contexts</span>.
* <span style="font-family:Courier New;">contexts</span> - This schema allows users to query aggregates on contexts - count, sum, min, max by user-defined dimensions defined on any <span style="font-family:Courier New;">context</span>.
* <span style="font-family:Courier New;">contexts_sketches</span> - This schema allows users to query sketch functions - stddev, skewness, distinctcount, etc. on <span style="font-family:Courier New;">contexts</span>.

To list all schemas in bios catalog -
```shell
trino> show schemas in bios;
       Schema
--------------------
 contexts
 contexts_raw
 contexts_sketches
 information_schema
 signals
 signals_raw
 signals_sketches
(7 rows)

Query 20231017_004234_00025_chsew, FINISHED, 1 node
Splits: 11 total, 11 done (100.00%)
0.24 [7 rows, 124B] [29 rows/s, 523B/s]
```
### Tables
Schemas contain tables.  To list tables within the bios catalog and <span style="font-family:Courier New;">signals</span> schema -
```shell
trino> use bios.signals;
USE
trino:signals> show tables;
        Table
----------------------
 _allclientmetrics
 _alloperationfailure
 _failurereport
 _operations
 _query
 alert
 appstatus
 audit_log
 containers
 cpustats
 diskstats
 exception
 iostats
 lbrequest
 memstats
 netstats
(16 rows)

Query 20221011_161915_00012_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.24 [16 rows, 431B] [66 rows/s, 1.74KB/s]

trino:signals> describe cpustats;
             Column              |     Type     |  Extra  |      Comment
---------------------------------+--------------+---------|-----------------------
 cpuusage                        | double       |         |
 usercpuusage                    | double       |         | default: 0.0
 systemcpuusage                  | double       |         | default: 0.0
 hostname                        | varchar      |         |
 reporttime                      | bigint       |         | default: 0
 __window_begin_timestamp        | timestamp(0) | virtual |
 __window_begin_epoch            | bigint       | virtual |
 __param_duration_seconds        | bigint       | virtual | default: 900
 __param_duration_offset_seconds | bigint       | virtual | default: 0 (from current time)
 __param_window_size_seconds     | bigint       | virtual | default: 300
(10 rows)
Query 20221011_163259_00014_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.38 [10 rows, 908B] [26 rows/s, 2.34KB/s]
```
### Virtual Columns
These columns can be used in where, select and group by clauses.

##### Where Clause
These columns are prefixed with __param and specify duration and window sizes
* __param_window_size_seconds: The size of the time window over which aggregation is performed; default is 5 minutes
  (300 seconds).
* __param_duration_seconds: The total duration that the query spans; default is 15 minutes (900 seconds).
* __param_duration_offset_seconds: Used to query a time in the past rather than the most recent time duration, e.g.
  to query a day ago’s data, set it to 86400.

##### Select and GroupBy
These columns are prefixed with __window and specify starting time of a window
* __window_begin_timestamp: The starting time of each time window returned by the select query - in <span style="font-family:Courier New;">SQL</span> timestamp format.
* __window_begin_epoch: The starting time of each time window returned by the select query - in seconds since epoch (Jan 1, 1970).

We shall now cover each of the schemas in depth.
