# Observe

bi(OS) stores a variety of observability metrics that developers can use.  Specifically, SLAs experienced by clients,
usage of bi(OS) across the organization, and any errors/anomalies are all recorded within bi(OS).  All these are
stored as special <span style="font-family:Courier New;">signals</span> starting with the character ‘_’.[^63]  Further, bi(OS) uses itself to measure system performance,
audit logging, and anomalies across all tenants.  See Appendix C for more information.

#### _usage
This <span style="font-family:Courier New;">signal</span> tracks how any particular organization uses the various capabilities of bi(OS).[^64]

The dimensions collected in this signal are -
* <span style="font-family:Courier New;">stream</span> - The <span style="font-family:Courier New;">signal</span> or <span style="font-family:Courier New;">context</span> name.
* <span style="font-family:Courier New;">request</span> - The operation performed on the stream -
  * <span style="font-family:Courier New;">signals</span> - INSERT, INSERT_BULK, SELECT.
  * <span style="font-family:Courier New;">contexts</span> - LIST_CONTEXT_ENTRIES, SELECT_CONTEXT, UPDATE, UPSERT, DELETE, REPLACE_CONTEXT_ATTRIBUTES.
  * <span style="font-family:Courier New;">admin</span> - All control plane operations.  GET_TENANT, LOGIN, RENEW_SESSION, GET_SIGNALS, GET_CONTEXTS etc.
* <span style="font-family:Courier New;">appName</span> - The source application that is using bi(OS).[^65]  E.g., webhook, Kafka, bios-nrt-alerts, etc.
* <span style="font-family:Courier New;">appType</span> - This defines the type of application[^66]  used to access bi(OS) and takes the following values - BATCH, REALTIME, ADHOC.

The metrics collected in this <span style="font-family:Courier New;">signal</span> are -
* <span style="font-family:Courier New;">numReads</span> - Number of rows returned for select queries.[^67]
* <span style="font-family:Courier New;">numWrites</span> - Number of rows inserted or upserted.
* <span style="font-family:Courier New;">numSuccessfulOperations</span>  - Total number of operations that have succeeded as initiated by the client.
* <span style="font-family:Courier New;">numValidationErrors</span> - Total number of operations that failed because of validation errors.  These errors are recorded
  in the _operationFailure <span style="font-family:Courier New;">signal</span> (see below).

#### _clientMetrics
This <span style="font-family:Courier New;">signal</span> tracks SLAs/metrics as seen by the client application using <span style="font-family:Courier New;">isQL</span>.

The dimensions collected in this <span style="font-family:Courier New;">signal</span> are -
* <span style="font-family:Courier New;">stream</span> - The <span style="font-family:Courier New;">signal</span> or <span style="font-family:Courier New;">context</span> name.
* <span style="font-family:Courier New;">request</span> - The operation performed on the stream -
  * <span style="font-family:Courier New;">signals</span> - INSERT, INSERT_BULK, SELECT.
  * <span style="font-family:Courier New;">contexts</span> - LIST_CONTEXT_ENTRIES, SELECT_CONTEXT, UPDATE, UPSERT, DELETE, REPLACE_CONTEXT_ATTRIBUTES.
  * <span style="font-family:Courier New;">admin</span> - All control plane operations.  GET_TENANT, LOGIN, RENEW_SESSION, GET_SIGNALS, GET_CONTEXTS etc.
* <span style="font-family:Courier New;">appName</span> - The source application that is using bi(OS).[^68]  E.g., webhook, Kafka, bios-nrt-alerts, etc.
* <span style="font-family:Courier New;">appType</span> - This defines the type of application[^69]  used to access bi(OS) and takes the following values - BATCH, REALTIME, ADHOC.
* <span style="font-family:Courier New;">serverEndpoint</span> - IP address or HOST of the bi(OS) instance serving the application request.

The metrics collected in this <span style="font-family:Courier New;">signal</span> are -
* <span style="font-family:Courier New;">numReads</span> - Number of rows returned by select queries.[^70]
* <span style="font-family:Courier New;">numWrites</span> - Number of rows <span style="font-family:Courier New;">inserted or upserted</span>.
* <span style="font-family:Courier New;">numSuccessfulOperations</span>  - Total number of operations that have succeeded using <span style="font-family:Courier New;">isQL</span>.
* <span style="font-family:Courier New;">numFailedOperations</span> - Total number of operations that failed.
* <span style="font-family:Courier New;">latency[Min, Max, Sum] and latencyInternal[Min, Max, Sum]</span> - SLA metrics as experienced by the application. The
  Internal variants cover metrics between the C-SDK of <span style="font-family:Courier New;">isQL</span> and the bi(OS) server.
* <span style="font-family:Courier New;">numThreads</span> - the number of threads that are using the current <span style="font-family:Courier New;">isQL</span> instance within the application process.[^71]

#### _operationFailure
This <span style="font-family:Courier New;">signal</span> tracks the various errors as experienced by the client using <span style="font-family:Courier New;">isQL</span>.

The dimensions collected in this <span style="font-family:Courier New;">signal</span> are -
* <span style="font-family:Courier New;">stream</span> - The <span style="font-family:Courier New;">signal</span> or <span style="font-family:Courier New;">context</span> name.
* <span style="font-family:Courier New;">request</span> - The operation performed on the stream -
  * <span style="font-family:Courier New;">signals</span> - INSERT, INSERT_BULK, SELECT.
  * <span style="font-family:Courier New;">contexts</span> - LIST_CONTEXT_ENTRIES, SELECT_CONTEXT, UPDATE, UPSERT, DELETE, REPLACE_CONTEXT_ATTRIBUTES.
  * <span style="font-family:Courier New;">admin</span> - All control plane operations.  GET_TENANT, LOGIN, RENEW_SESSION, GET_SIGNALS, GET_CONTEXTS etc.
* <span style="font-family:Courier New;">appName</span> - The source application that is using bi(OS).[^72]  E.g.,: webhook, Kafka, bios-nrt-alerts, etc.
* <span style="font-family:Courier New;">appType</span> - This defines the type of application[^73]  used to access bi(OS) and takes the following values - BATCH, REALTIME, ADHOC.
* <span style="font-family:Courier New;">errorName</span> - This is the short error reported by bi(OS).
* <span style="font-family:Courier New;">errorMessage</span> - This is the long error reported by bi(OS)

**Note** - since the three <span style="font-family:Courier New;">signals</span> described above are internal <span style="font-family:Courier New;">signals</span>, changes to them by developers aren’t permitted.

#### Alerts
Developers can configure alerts on any features of <span style="font-family:Courier New;">signals</span> (user-defined or bi(OS) internal).  Alerts are triggered by
conditions defined in a simple expression language that supports the following -
* Aggregate functions  - <span style="font-family:Courier New;">sum, min, max, avg, distinctcount, count</span>
* Operators - <span style="font-family:Courier New;">+, -, /, *,(), >, <, >=, <=, ==, CONTAINS, AND, OR</span>

Any dimension value OR metric of a user-defined feature[^74]  can be used within an alert condition.  Once an alert
condition is satisfied, it will be posted to the configured webhook url.[^75]

There are two types of alerts - <span style="font-family:Courier New;">Json</span> and <span style="font-family:Courier New;">Slack</span>. While the alert
content is same between the two, slack expects a preamble as shown below.

Refer below for example of a typical alert configuration -
```json
{
  "featureName": "byProduct",
  "dimensions": [
    "productId"
  ],
  "attributes": [
    "numViews",
    "numOrders"
  ],
  "featureInterval": 300000,
  "alerts": [
    {
      "alertName": "productAndViews",
      "condition": "(productId contains “12345” OR (sum(numViews) < 300))",
      "webhookUrl": "https://alerts.xxxxx.io",
      "userName": "bios@isima.io",
      "Password": "XXXXXX"
    }
  ]
}
```
If the alert condition is satisfied then the configured webhook Url would receive a message that looks as follows -

##### Json Payload

```json
{
 "domainName" : "bios.isima.io",
 "tenantName" : "fooTenant",
 "signalName" : "productViews",
 "featureName" : "productViews.rollup.alert",
 "alertName" : "productAndViews",
 "condition" : "((productId == '12345') and (count() > 10))",
 "windowStartTime" : "2022-10-11T21:10:00Z",
 "windowEndTime" : "2022-10-11T21:11:00Z",
 "windowLength" : "1 mins",
 "event" : {
   "productId" : "12345",
   "count()" : 13
 },
 "timestamp" : "2022-10-11 T 21:11:08.216 Z",
 "timestampMillisSinceEpoch" : 1665522668216
}
```

##### Slack Payload


```
A bi(OS) alert productAndViews has been raised, Please have a look at the following JSON object and/or log into the system to get more information - https://bios.isima.io

{
 "domainName" : "bios.isima.io",
 "tenantName" : "fooTenant",
 "signalName" : "productViews",
 "featureName" : "productViews.rollup.alert",
 "alertName" : "productAndViews",
 "condition" : "((productId == '12345') and (count() > 10))",
 "windowStartTime" : "2022-10-11T21:10:00Z",
 "windowEndTime" : "2022-10-11T21:11:00Z",
 "windowLength" : "1 mins",
 "event" : {
   "productId" : "12345",
   "count()" : 13
 },
 "timestamp" : "2022-10-11 T 21:11:08.216 Z",
 "timestampMillisSinceEpoch" : 1665522668216
}
```

[^63]: _ is a reserved character in bi(OS). <br/>
[^64]: This <span style="font-family:Courier New;">signal</span> is used by Isima for bi(OS)s billing. <br/>
[^65]: This name is provided when creating a bi(OS) session via <span style="font-family:Courier New;">isQL</span>. <br/>
[^66]: This appType is used to provide different QoS for different applications. <br/>
[^67]: bi(OS) does not count rows filtered, indexes, aggregates, and data sketches. <br/>
[^68]: This name is provided when creating a bi(OS) session via <span style="font-family:Courier New;">isQL</span>. <br/>
[^69]: This appType is used to provide different QoS for different applications. <br/>
[^70]: bi(OS) does not count rows filtered, indexes, aggregates, and data sketches. <br/>
[^71]: For thread-safety characteristics of the SDK refer to <span style="font-family:Courier New;">isQL</span> reference in Appendix A. <br/>
[^72]: This name is provided when creating a bi(OS) session via <span style="font-family:Courier New;">isQL</span>. <br/>
[^73]: This appType is used to provide different QoS for different applications. <br/>
[^74]: Support for using data sketches in alerts is coming soon. <br/>
[^75]: Support of other alert targets e.g. email, SMS, is coming soon. <br/>
