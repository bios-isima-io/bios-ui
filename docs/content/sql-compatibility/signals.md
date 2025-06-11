# Signals

As with <span style="font-family:Courier New;">isQL</span>, all <span style="font-family:Courier New;">signal</span> queries should specify time-ranges. Unlike the <span style="font-family:Courier New;">isQL</span> syntax for specifying a time range, bi(OS) - Trino connector supports time-windowed queries by defining virtual columns.

Refer below for some sample queries from cpustats <span style="font-family:Courier New;">signal</span> (described above) -
* Average last 15 min cpu usage, grouped by window start time (5 min rollup window)

```shell
trino:signals> select __window_begin_timestamp,  sum(cpuusage)/count(*) as AVG_CPU from cpustats where __param_duration_seconds = 900 group by __window_begin_timestamp;

  __window_begin_timestamp |      AVG_CPU
--------------------------+--------------------
 2022-10-12 08:40:00      |  1.532777777777778
 2022-10-12 08:45:00      |  1.411805555555556
 2022-10-12 08:50:00      | 1.5604166666666666
(3 rows)

Query 20221012_085705_00005_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.48 [3 rows, 0B] [6 rows/s, 0B/s]
```

* Average 15 min cpu usage, starting one hour in the past, grouped by window start time

```shell
trino:signals> select __window_begin_timestamp,  sum(cpuusage)/count(*) as AVG_CPU from cpustats where __param_duration_seconds = 900 and __param_duration_offset_seconds = 3600  group by __window_begin_timestamp;

 __window_begin_timestamp |      AVG_CPU
--------------------------+--------------------
 2022-10-12 07:40:00      | 1.4894444444444443
 2022-10-12 07:45:00      | 1.3827777777777779
 2022-10-12 07:50:00      | 1.4769444444444446
(3 rows)

Query 20221012_085740_00006_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.25 [3 rows, 0B] [12 rows/s, 0B/s]
```

* Average 15 min cpuusage, starting one hour in the past, grouped by window start  time (timestamp from epoch)

```shell
trino:signals> select __window_begin_epoch,  sum(cpuusage)/count(*) as AVG_CPU from cpustats where __param_duration_seconds = 900 and __param_duration_offset_seconds = 3600  group by __window_begin_epoch;

 __window_begin_epoch |      AVG_CPU
----------------------+--------------------
           1665560700 | 1.3827777777777779
           1665561000 | 1.4769444444444446
           1665561300 | 1.2994444444444444
(3 rows)

Query 20221012_090120_00009_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.23 [3 rows, 0B] [12 rows/s, 0B/s]
```
* Average cpu usage in the past one hour, grouped by window start  time, with a window size of 15 mins (tumbling window)

```shell
trino:signals> select __window_begin_timestamp,  sum(cpuusage)/count(*) as AVG_CPU from cpustats where __param_duration_seconds = 3600 and __param_window_size_seconds = 900 group by __window_begin_timestamp;

 __window_begin_timestamp |      AVG_CPU
--------------------------+--------------------
 2022-10-12 08:00:00      |  1.448287037037037
 2022-10-12 08:15:00      | 1.3938425925925926
 2022-10-12 08:30:00      | 1.4588425925925925
 2022-10-12 08:45:00      | 1.4539814814814815
(4 rows)

Query 20221012_090453_00010_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.24 [4 rows, 0B] [16 rows/s, 0B/s]
```
* Sum successful and failed operations in the last 5 minutes, grouped by stream,request, apptype and appname

```shell
trino:signals> select stream, request, apptype, appname, sum(numSuccessfulOperations) as SuccessfulOps, sum(numFailedOperations) as FaileOps from _allclientmetrics where __param_duration_seconds = 300 group by stream, request, apptype, appname;

      stream       |   request   | apptype  |  appname   | SuccessfulOps | FaileOps
------------------+-------------+----------+------------+---------------+----------
                   | GET_TENANT  | Adhoc    | trino-bios |             1 |        0
 _allClientMetrics | SELECT      | Adhoc    | trino-bios |             4 |        0
 alert             | INSERT      | Realtime | bios-intg  |             3 |        0
 appStatus         | INSERT      | Realtime | bios-intg  |            40 |        0
 containers        | INSERT      | Realtime | bios-intg  |           107 |        0
 cpuStats          | INSERT      | Realtime | bios-intg  |            58 |        0
 diskStats         | INSERT_BULK | Realtime | bios-intg  |            60 |        0
 exception         | INSERT      | Realtime | bios-intg  |             2 |        0
 ioStats           | INSERT      | Realtime | bios-intg  |            30 |        0
 ioStats           | INSERT_BULK | Realtime | bios-intg  |            30 |        0
 memStats          | INSERT      | Realtime | bios-intg  |            60 |        0
 netStats          | INSERT_BULK | Realtime | bios-intg  |            60 |        0
(12 rows)

Query 20221012_101425_00032_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.24 [12 rows, 0B] [50 rows/s, 0B/s]
```
