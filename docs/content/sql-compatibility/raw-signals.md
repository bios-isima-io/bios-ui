# Raw Signals

This schema can be used  to retrieve raw (non-aggregated) data from <span style="font-family:Courier New;">signals</span>. Complex <span style="font-family:Courier New;">SQL</span> queries, joins, group by’s
and aggregates (not defined in biOS) are all supported. These queries will not be as performant as <span style="font-family:Courier New;">isQL</span>.

```shell
trino> use bios.signals_raw;
USE
trino:signals_raw>
trino:signals_raw> show tables;
           Table
--------------------------
 _allclientmetrics_raw
 _alloperationfailure_raw
 _failurereport_raw
 _operations_raw
 _query_raw
 alert_raw
 appstatus_raw
 audit_log_raw
 containers_raw
 cpustats_raw
 diskstats_raw
 exception_raw
 iostats_raw
 lbrequest_raw
 memstats_raw
 netstats_raw
(16 rows)

Query 20221012_112137_00049_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.22 [16 rows, 559B] [71 rows/s, 2.45KB/s]

trino:signals_raw> describe cpustats_raw;

             Column              |     Type     |  Extra  |    Comment
---------------------------------+--------------+---------+---------------------
 cpuusage                        | double       |         |
 usercpuusage                    | double       |         | default: 0.0
 systemcpuusage                  | double       |         | default: 0.0
 hostname                        | varchar      |         |
 reporttime                      | bigint       |         | default: 0
 __event_timestamp               | timestamp(6) | virtual |
 __event_time_epoch_ms           | bigint       | virtual |
 __param_duration_seconds        | bigint       | virtual | default: 900
 __param_duration_offset_seconds | bigint       | virtual | default: 0 (from current time)
(9 rows)

Query 20221012_112528_00052_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.22 [9 rows, 868B] [40 rows/s, 3.8KB/s]
```
* Get assorted column data for 30 seconds from cpustats, starting 30 mins in the past

```shell
trino:signals_raw> select hostname, cpuusage, systemcpuusage from cpustats_raw where __param_duration_seconds = 30 and __param_duration_offset_seconds = 1800;

  hostname  |      cpuusage      |   systemcpuusage
------------+--------------------+--------------------
 signal-1   | 0.7666666666666667 |              0.325
 rollup-1   |              1.225 |              0.425
 analysis-1 | 0.4833333333333333 |              0.175
 lb-1       |                0.7 |                0.3
 compute-1  |                1.6 | 0.4333333333333333
 lcm        | 0.5333333333333333 | 0.1666666666666667
(6 rows)

Query 20221012_114154_00057_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.22 [6 rows, 0B] [26 rows/s, 0B/s]
```
* Get assorted column data from cpustats, for specific hosts, between a specific time range (using __event_timestamp) for select hosts

```shell
trino:signals_raw> select hostname, cpuusage, systemcpuusage from cpustats_raw where __event_timestamp >= timestamp '2022-10-12 11:01:20' and __event_timestamp < timestamp '2022-10-12 11:01:45' and hostname in ('signal-1', 'analysis-1', 'rollup-1');

  hostname  |      cpuusage      |   systemcpuusage
------------+--------------------+--------------------
 signal-1   | 0.6333333333333333 | 0.2333333333333334
 rollup-1   |              1.075 | 0.3833333333333334
 analysis-1 | 0.6416666666666667 |              0.225
(3 rows)

Query 20221012_114627_00059_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.20 [6 rows, 0B] [29 rows/s, 0B/s]
```
