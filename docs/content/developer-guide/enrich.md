# Enrich

bi(OS) supports enrichments that add attributes to <span style="font-family:Courier New;">signals</span> and <span style="font-family:Courier New;">contexts</span>.  bi(OS) allows any context to enrich
<span style="font-family:Courier New;">signals</span> and other <span style="font-family:Courier New;">contexts</span>.  <span style="font-family:Courier New;">Context-to-signal</span> enrichments are performed at <span style="font-family:Courier New;">insert</span> time and materialized before
persisting the <span style="font-family:Courier New;">signal</span> data. <span style="font-family:Courier New;">Context-to-context</span> enrichments happen at <span style="font-family:Courier New;">select</span> time.  Further, bi(OS) supports three
levels of nesting[^43]  for such enrichments.

**Note** - <span style="font-family:Courier New;">Context-to-signal</span> enrichments block ingestion, and <span style="font-family:Courier New;">context-to-context</span> enrichments can impact query latencies.

An enrichment configuration specifies -
* the <span style="font-family:Courier New;">foreignKey</span> attributes in the originating <span style="font-family:Courier New;">signal</span> or <span style="font-family:Courier New;">context</span>.
* the <span style="font-family:Courier New;">primaryKey</span> attributes in the referring <span style="font-family:Courier New;">context</span>.
* list of attributes in the referring <span style="font-family:Courier New;">context</span> to incorporate.
* policy that determines the behavior when the referring entry does not exist. Possible values are as following -
  * <span style="font-family:Courier New;">Reject</span> - The operation fails if there is no match.
  * <span style="font-family:Courier New;">FailParentLookup</span> - This option is only applicable to <span style="font-family:Courier New;">context-to-context</span> enrichment. If there is no match, the process defers the decision to the parent process stage with
    passing no value. In case the enriched
    <span style="font-family:Courier New;">context</span> is a source of
    another enrichment, the behavior is defined by that parent enrichment.  In case of selecting data from
    the enriched <span style="font-family:Courier New;">context</span>, the query
    fails because of the missing attributes.
  * <span style="font-family:Courier New;">StoreFillInValue</span> - Stores configured <span style="font-family:Courier New;">fill-in</span> values in case there is no match.

Enrichments in bi(OS) can be mapped to popular <span style="font-family:Courier New;">SQL</span> joins as follows -
* <span style="font-family:Courier New;">Inner</span> - Enrichment succeeds only if lookup succeeds.
* <span style="font-family:Courier New;">Left-outer</span> - Enrichment succeeds with fill-in values if lookup fails.
* <span style="font-family:Courier New;">Chained  (snowflake)</span> - Attributes from a previous enrichment can become foreignKeys for other enrichments.
* <span style="font-family:Courier New;">Unions(context-to-context only)</span> - A single <span style="font-family:Courier New;">context</span> can be enriched with multiple <span style="font-family:Courier New;">contexts</span> of overlapping columns
  In this case, the first <span style="font-family:Courier New;">context</span> that matches the lookup short-circuits any further enrichments.[^44] 

[^43]: Maximum level is configurable in customer deployments, but higher nesting levels may impact ingestion speed. <br/>
[^44]: Pretty powerful capability best experienced via code. <br/>
