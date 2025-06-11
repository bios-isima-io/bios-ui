# Context Sketches

This schema defines a sketch table for each <span style="font-family:Courier New;
font-size:18px;">context</span> (named CONTEXTNAME__sketches) which can be used
for running queries on sketch functions (such as stddev,
distinctcount etc.). When querying tables in this schema, simply include the
column name in the select clause, corresponding to the sketch function and the
attribute you are interested in.

**Note** - group by clause isn’t supported.

**Note** - to select count of rows in the original context, use the `count__` column, and not the `count()` function.
The `count()` function returns the number of rows in the sketches virtual table.

```shell
trino:contexts_sketches> desc firedalert_sketches;
               Column                |  Type  | Extra | Comment
-------------------------------------+--------+-------+---------
 count__                             | bigint |       |
 avg__firstactivationtime            | double |       |
 avg__lastnotificationtime           | double |       |
 avg__lastremindertime               | double |       |
 avg__lastactivationtime             | double |       |
 avg__activationcount                | double |       |
 avg__notificationcount              | double |       |
 stddev__firstactivationtime         | double |       |
 stddev__lastnotificationtime        | double |       |
 stddev__lastremindertime            | double |       |
 stddev__lastactivationtime          | double |       |
 stddev__activationcount             | double |       |
 stddev__notificationcount           | double |       |
 variance__firstactivationtime       | double |       |
 variance__lastnotificationtime      | double |       |
...
```
It contains 195 columns for the various sketch functions on each attribute of the context.
There are no virtual columns in tables in this schema.

Example query:
```shell
trino:contexts_sketches> select count__, stddev__activationcount, median__notificationcount, distinctcount__alertkey from firedalert_sketches;
 count__ | stddev__activationcount | median__notificationcount | distinctcount__alertkey
---------+-------------------------+---------------------------+-------------------------
      55 |       74.67769645019482 |                       1.0 |       53.11755188747866
(1 row)

Query 20231017_054432_00120_chsew, FINISHED, 1 node
Splits: 9 total, 9 done (100.00%)
1.93 [1 rows, 0B] [0 rows/s, 0B/s]
```

