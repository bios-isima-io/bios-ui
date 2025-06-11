# Adapt

### Live Schema and Flow Changes
bi(OS) allows <span style="font-family:Courier New;">CUD (create, update, delete)</span> operations on <span style="font-family:Courier New;">signals</span> or <span style="font-family:Courier New;">contexts</span> in production. Further, the following
changes to the schema can be done during live ingestion -
* Flows -  <span style="font-family:Courier New;">CUD</span> on flows to start/stop/change onboarding.
* <span style="font-family:Courier New;">signals</span>/<span style="font-family:Courier New;">contexts</span> - CUD[^76]  on attributes.
* Enrichments - <span style="font-family:Courier New;">CUD</span> on enrichments.
* Indexes, Features  - <span style="font-family:Courier New;">CUD</span> on user-defined aggregations.

Changes to flows take effect immediately.  Adding new columns or indexes/features will result in automatic and deterministic backfilling.[^77]  Any <span style="font-family:Courier New;">select</span> queries
that access data across multiple schemas will use default values of attributes to return results to the client.


[^76]: In case of deletes the FLOW and <span style="font-family:Courier New;">signal/context</span> schema should be changed together. <br/>
[^77]: Support for backfilling raw data is coming soon. <br/>
