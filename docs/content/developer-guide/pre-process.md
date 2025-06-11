# Pre-process

bi(OS) connects a data source (as covered in the  Connect section above) to a storage engine - <span style="font-family:Courier New;">signal or context</span>
through a <span style="font-family:Courier New;">flow. Flows</span> provide a simplified framework to connect sources to targets and support in-flight processing.  Here are a few capabilities that bi(OS) supports -
* Filters  - Developers can write rules to skip certain rows.
* Deletion spec - Developers can specify a condition on an attribute to delete a <span style="font-family:Courier New;">context</span> entry.
* Data mapping - Developers can declaratively map attributes in data sources to those within a <span style="font-family:Courier New;">signal or context</span>.
* Attribute transformation  - bi(OS) also allows in-flight transformations using Python <span style="font-family:Courier New;">lambdas and  UDFs</span>.
  (user-defined-functions).

We will expand further on these capabilities below.
