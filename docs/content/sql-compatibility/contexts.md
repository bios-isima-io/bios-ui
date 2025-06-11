# Contexts

This schema can be used for aggregate queries on contexts that contain user-defined features.
Aggregates that can be used include count, sum, min, and max.
There are no virtual columns in tables in this schema.

Refer below for some sample queries from firedalert <span style="font-family:Courier New;">context</span> -

```shell
trino:contexts> desc firedalert;
         Column         |     Type     |  Extra  | Comment
------------------------+--------------+---------+---------
 alertkey               | varchar      | key     |
 alertname              | varchar      |         |
 firstactivationtime    | bigint       |         |
 lastnotificationtime   | bigint       |         |
 lastremindertime       | bigint       |         |
 lastactivationtime     | bigint       |         |
 activationcount        | bigint       |         |
 notificationcount      | bigint       |         |
 __upsert_timestamp     | timestamp(6) | virtual |
 __upsert_time_epoch_ms | bigint       | virtual |
(10 rows)

Query 20231017_040224_00096_chsew, FINISHED, 1 node
Splits: 11 total, 11 done (100.00%)
0.22 [10 rows, 817B] [45 rows/s, 3.59KB/s]

trino:contexts> select count(), max(activationcount), max(notificationcount), max(lastactivationtime) from firedalert;
 _col0 | _col1 | _col2 |     _col3
-------+-------+-------+---------------
    55 |   399 |     6 | 1697547050937
(1 row)

Query 20231017_040248_00097_chsew, FINISHED, 1 node
Splits: 9 total, 9 done (100.00%)
0.23 [1 rows, 0B] [4 rows/s, 0B/s]

```

You can also use a group by clause if a feature has been defined with that attribute as an attribute to query by.

```shell
trino:contexts> select count(), max(activationcount), max(notificationcount), max(lastactivationtime), alertname from firedalert group by alertname;
 _col0 | _col1 | _col2 |     _col3     |        alertname
-------+-------+-------+---------------+-------------------------
     3 |     3 |     1 | 1697051739631 | biosdbIsDown1
     1 |     2 |     1 | 1689444076261 | biosHeartbeat15Min1
     1 |     1 |     1 | 1689445834313 | biosHeartbeat30Min2
     5 |     4 |     1 | 1697107232872 | highCpuUsage1
     1 |     1 |     1 | 1697186756257 | highDiskIoReadLatency1
     6 |     3 |     1 | 1697547050937 | highDiskIoWriteLatency1
     2 |    58 |     1 | 1693518590033 | highDiskSpaceUsage1
     1 |     1 |     1 | 1693517154952 | highDiskSpaceUsage2
    17 |   399 |     6 | 1697523933392 | highLbErrors1
     4 |     3 |     1 | 1697172337537 | highLbErrors2
     1 |     2 |     1 | 1696353111196 | logErrorApps1
     3 |     2 |     1 | 1697009477148 | logErrorBios1
     3 |     3 |     1 | 1697004348069 | logErrorBios2
     2 |     2 |     1 | 1695726049577 | logErrorBiosdb1
     2 |     9 |     3 | 1697520340793 | logErrorBioslb1
     2 |     1 |     1 | 1689114064126 | logErrorBioslb2
     1 |    10 |     2 | 1697245269410 | logErrorDbdozer1
(17 rows)

Query 20231017_040339_00098_chsew, FINISHED, 1 node
Splits: 9 total, 9 done (100.00%)
0.44 [17 rows, 0B] [38 rows/s, 0B/s]
```
