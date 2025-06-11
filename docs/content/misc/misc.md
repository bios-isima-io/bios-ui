# What do you need alongside bi(OS)?

While bi(OS) may seem all-encompassing, you need a few products to work alongside.

<p align="center">
    <img src="/docs/images/third_party.png" style="width:70%">
</p>

### OLTP Databases
bi(OS) isn’t an OLTP RDBMS.  For applications that require ACID compliance, it is necessary to use RDBMSs such as
MySQL, AWS AuroraDB, or CockroachDB.
### Queuing systems
It is in vogue nowadays to send data from OLTP systems into a queue such as Apache Kafka or RabbitMQ.  While Isima
believes queuing results from a legacy infrastructure mindset (and does not advocate queuing), bi(OS) can source
data from such queues.
### Orchestrator
Since bi(OS) advocates mostly real-time processing, there is a trivial but credible need to schedule micro-batches.
For this scheduling, developers can use something as simple as cron or as elaborate as Apache Airflow and its
non-OSS variants.
### Data Warehouse / Lake
While bi(OS) can hold data for months on end, if the requirement is to store PBs of data collected over years, it is
best to use a Cloud Data platforms.  One benefit of using such an architecture - where bi(OS) fronts Cloud Storage
and exports data in Parquet format[^87]  - is the massive compute efficiency gains downstream.  This arises from the fact
that instead of wasting compute cycles on raw data, downstream applications - Jupyter notebooks, and BI tools - can
use curated data exported by bi(OS).
### Business Intelligence tools
While bi(OS) ships with a nimble exploratory visualization tool, it is not meant to be used by business users.  For
them, it is best to connect a tool such as Tableau, or PowerBI to bi(OS) using their respective <span style="font-family:Courier New;">SQL</span> connectors.

Finally, the most important ingredient you need is your imagination and desire to deliver non-linear impact.
