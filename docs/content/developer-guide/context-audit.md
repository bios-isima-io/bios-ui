# Context Audit

bi(OS) can record <span style="font-family:Courier New;">inserts</span>, <span style="font-family:Courier New;">upserts</span>, and <span style="font-family:Courier New;">deletes</span> to a <span style="font-family:Courier New;">context</span> into an audit <span style="font-family:Courier New;">signal</span>. <span style="font-family:Courier New;">Context</span> audit is similar to “Change Data Capture” supported by popular databases, except it is scale-out and works for changing dimensions
at high velocity.[^52]  A shadow <span style="font-family:Courier New;">signal</span>[^54]  is created to log all operations along with the previous and
newly updated data.[^55]  Audit logs on <span style="font-family:Courier New;">contexts</span> enable exploring delta changes with refreshing real-time features
in an efficient manner.[^56]  Furthermore, customers can implement nuanced de-duplication as it fits their business needs.


[^52]: Given these are automatically computed, the user can’t define custom group-bys for these metrics. And hence they can’t support filtering in bi(OS)’s UI either. <br/>
[^54]: This shadow <span style="font-family:Courier New;">signal</span> is auto-named as "audit&lt;ContextName&gt;" and supports all the features of a <span style="font-family:Courier New;">signal</span>. <br/>
[^55]: All capabilities - enrichments, indexing, aggregations, data-sketches and feature-as-context - can be enabled on this <span style="font-family:Courier New;">signal</span>. <br/>
[^56]: Imagine refreshing the feature gBy session for millions of sessions at a 1min frequency. <br/>
