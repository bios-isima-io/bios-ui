## Signal Sketches

bi(OS) auto computes sketches for each attribute in <span
style="font-family:Courier New;">signals</span> and <span
style="font-family:Courier New;">contexts</span>. This schema
defines a sketch table for each <span style="font-family:Courier New;
font-size:18px;">signal</span> (named SIGNALNAME__sketches) which can be used
for running queries on time-windowed sketch functions (such as stddev,
distinctcount etc.). When querying tables in this schema, simply include the
column name in the select clause, corresponding to the sketch function and the
attribute you are interested in.

**Note** - group by clause isn’t supported, but virtual columns such as **window_begin_timestamp** can be included in
the select list (without having to specify a group by clause).

**Note** - to select count of rows in the original signal, use the `count__` column, and not the `count()` function.
The `count()` function returns the number of rows in the sketches virtual table.

```shell
trino> use bios.signals_sketches;
USE
trino:signals_sketches> show tables;
             Table
-------------------------------
 _allclientmetrics_sketches
 _alloperationfailure_sketches
 _failurereport_sketches
 _operations_sketches
 _query_sketches
 alert_sketches
 appstatus_sketches
 audit_log_sketches
 containers_sketches
 cpustats_sketches
 diskstats_sketches
 exception_sketches
 iostats_sketches
 lbrequest_sketches
 memstats_sketches
 netstats_sketches
(16 rows)

Query 20221012_104410_00036_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.22 [16 rows, 591B] [72 rows/s, 2.61KB/s]

trino:signals_sketches> describe cpustats_sketches;
             Column              |     Type     |  Extra  |            Comment
---------------------------------+--------------+---------+--------------------------------
 count__                         | bigint       |         |
 avg__cpuusage                   | double       |         |
 avg__usercpuusage               | double       |         |
 avg__systemcpuusage             | double       |         |
 avg__reporttime                 | double       |         |
 stddev__cpuusage                | double       |         |
 stddev__usercpuusage            | double       |         |
 stddev__systemcpuusage          | double       |         |
 stddev__reporttime              | double       |         |
 variance__cpuusage              | double       |         |
 variance__usercpuusage          | double       |         |
 variance__systemcpuusage        | double       |         |
...
```
It has 133 columns covering:
* avg, stddev, variance, skewness, kurtosis, sum, sum2, sum3, sum4, min, max, median,
  p0[_01, _1], p1, p10, p25, p50, p75, p90, p99, p99[_9, _99]
  for each NUMERIC attribute in the signal.
* distinctcount, dcub1, dcub2, dcub3, dclb1, dclb2, dclb3 for each attribute in the signal.
* Virtual columns for use in where clause: __param_duration_seconds,
  __param_duration_offset_seconds, and __param_window_size_seconds.
* Virtual columns for use in select clause: __window_begin_timestamp and __window_begin_epoch.

Example query:
* Get 10 minute [average, stddev, sum2] of cpuusage from sketches, half an hour in the past

```shell
trino:signals_sketches> select avg__usercpuusage, stddev__cpuusage, sum2__cpuusage, __window_begin_epoch
from cpustats_sketches where
__param_duration_seconds = 600 and __param_duration_offset_seconds = 1800;

 avg__usercpuusage  | stddev__cpuusage  |   sum2__cpuusage   | __window_begin_epoch
--------------------+-------------------+--------------------+----------------------
  6.661262376237624 | 7.845687512561284 | 12143.788728298612 |           1697572200
 3.7517466329966345 | 4.253379894062788 | 3803.2898263888883 |           1697572500
(2 rows)

Query 20231017_054007_00115_chsew, FINISHED, 1 node
Splits: 9 total, 9 done (100.00%)
0.23 [2 rows, 0B] [8 rows/s, 0B/s]
```
