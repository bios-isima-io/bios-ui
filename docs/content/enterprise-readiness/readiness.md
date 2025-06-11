# Enterprise Readiness

#### Unlimited Compute
* For JSON Flattening, Python UDFs, Enrichments, User-defined Indexes + Features, 25+ streaming aggregations per column, Deterministic Index/Feature Backfills, Alerts, and Querying of features/indexes.
#### QoS Guarantees
Across -
  * Onboarding (and pre-processing) vs. Processing (and storage) vs. Consuming stages. Each of these functions executes on separate resources as opposed to processing (and storage)
  * Backfilling vs. real-time — While bi(OS) supports live changes in production, these changes can trigger automatic backfilling of indexes, user-defined aggregations, and data sketches of historical data. bi(OS) always prioritizes real-time feature computation while supporting deterministic backfilling.
  * Different appTypes - Different application types(e.g., Real-time, ETL, Adhoc) have different SLA tolerance; hence, bi(OS) performs best-effort optimization across different application types.
#### Disaster recovery
  * QUORUM consistency across 3 copies of data across three availability zones within a region for all inserts/upserts and selects.
  * Configurable incremental and snapshot backups to Cloud Storage.
  * 100% scale-out data path with zero single points of failure.
#### Access control
  * bi(OS) provides a 5-tier role-based access control (RBAC).
#### Governance
  * North-south encryption - All communication between clients and bi(OS), whether using isQL (read or write) or the UI, is over TLS v1.2. All internal communication is encrypted using certificates issued by the certificate authority (e.g., lets-encrypt.)
  * East-west encryption - Replication traffic across availability zones uses TLS v1.2 or higher.  This is encrypted using certificates issued by a certificate authority (e.g., letsencrypt.)
  * Data-at-rest- encryption - bi(OS) uses encrypted storage using an XTS-AES-256 block cipher implemented in hardware. 
  * Personally identifiable information (PII) handling - Customers can obfuscate or drop any PII data pre-storage using UDFs. 
  * Isima offers multi-cloud bot detection and attack prevention capability, which allows the sharing threat “vectors” across clusters and cloud deployments. 
  * Audit logging - Any changes within bi(OS) (e.g., schema changes, accesses) are audited and can be visualized in real-time. 
  * Observability - Alerts and visualization of data-plane metrics (e.g., per-table number of inserts, number of selects, etc.) are built-in. 
  * QoS guarantees that physically separate inserts and selects ensure that any attacker exploiting a compromised Data Engineer or Analyst’s credential will not impact other roles. 
  * bi(OS)’s unique hyper-converged architecture allows for unified governance and enforcement of security policies. 
  * Isima offers a single-tenant PaaS deployment, combining quarantined access and cloud agility.

