# Raw Contexts

This schema allows you to run <span style="font-family:Courier New;">SQL</span> queries against bi(OS) <span style="font-family:Courier New;">contexts</span>.

```shell
trino> use bios.contexts_raw;
USE
trino:contexts_raw> show tables;
   Table
------------
 host_raw
 mountpoint_raw
(2 rows)

Query 20221012_115158_00063_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.23 [2 rows, 50B] [8 rows/s, 222B/s]

trino:contexts_raw> describe host_raw;
         Column         |     Type     |  Extra  |    Comment
------------------------+--------------+---------+---------------
 hostname               | varchar      | key     |
 hostfriendlyname       | varchar      |         | default: None
 role                   | varchar      |         |
 subrole                | varchar      |         |
 cloud                  | varchar      |         |
 ipaddress              | varchar      |         |
 numcpus                | bigint       |         |
 memorygb               | bigint       |         |
 __upsert_timestamp     | timestamp(6) | virtual |
 __upsert_time_epoch_ms | bigint       | virtual |
(10 rows)

Query 20221012_115255_00065_p5rtu, FINISHED, 1 node
Splits: 4 total, 4 done (100.00%)
0.23 [10 rows, 716B] [43 rows/s, 3.07KB/s]

trino:contexts_raw> select hostname, role, subrole, numcpus from host_raw;

  hostname  |  role   | subrole  | numcpus
------------+---------+----------+---------
 analysis-1 | storage | analysis |       4
 compute-1  | compute | compute  |       2
 lb-1       | lb      | lb       |       1
 lcm        | lcm     | lcm      |       1
 rollup-1   | storage | rollup   |       4
 signal-1   | storage | signal   |       4
(6 rows)
Query 20221012_115629_00067_p5rtu, FINISHED, 1 node
Splits: 2 total, 2 done (100.00%)
0.22 [6 rows, 0B] [26 rows/s, 0B/s]
```

`contexts_raw` schema also allows users to issue queries with where clauses. If there is a suitable
index on the context, where clauses involving one attribute are pushed down to the bi(OS) server.
Below are some examples of queries whose where clauses are pushed down to bi(OS).

```
use bios.contexts_raw;
select * from host_raw where numcpus = 4;
select hostname, hostfriendlyname, numcpus from host_raw where role = 'lcm';
select hostname, hostfriendlyname, numcpus from bios.contexts_raw.host_raw where role = 'lcm' or role = 'storage';
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus in (4, 5, 6, 7, 8);
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus < 4;
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus <= 4;
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus > 4;
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus >= 4;
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus > 4 and numcpus < 10;
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus >= 4 and numcpus < 10;
select hostname, hostfriendlyname, numcpus, role from bios.contexts_raw.host_raw where numcpus <= 16 and numcpus >= 4;
select role, sum(numcpus) from bios.contexts_raw.host_raw where role in ('lcm', 'storage', 'compute') group by role;
desc firedalert_raw;
select * from firedalert_raw where alertname='highCpuUsage1';
```
