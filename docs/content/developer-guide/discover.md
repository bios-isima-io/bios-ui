# Discover

Developers can use bi(OS) to discover and infer schemas/columns from a data source using one of two paths.

### Perform Discovery
For <span style="font-family:Courier New;">MySQL</span> and <span style="font-family:Courier New;">Apache Kafka</span>[^12] ,
bi(OS) supports bulk discovery of schemas across all <span style="font-family:Courier New;">tables/streams</span>.  Once a developer
configures and picks the data source, bi(OS) reads the schema (column names and data-types) from <span style="font-family:Courier New;">MySQL</span>
to perform inference. For <span style="font-family:Courier New;">Apache Kafka</span>, it reads sample records for one second to perform inference.  It then
lists the various <span style="font-family:Courier New;">tables/streams</span> and walks the developer through an onboarding flow, one <span style="font-family:Courier New;">table/stream</span> at a time.

### Learn Ontology
A developer with access to sample rows of a table/stream, in <span style="font-family:Courier New;">JSON</span> or
<span style="font-family:Courier New;">CSV</span> formats, can paste them into bi(OS)’s onboarding UI.[^13]  bi(OS) supports
an inference engine that automatically detects data types[^14]  for each column using the sample data and presents it to the developer. The
developer has the option to correct mistakes by bi(OS)’s inference engine.

Refer to the block below showcasing a simple JSON with attribute names and example inference performed by bi(OS)

```json
{
  "id": 101,           # name -> id, type -> number
  "amount": 20.5,      # name -> amount, type -> decimal
  "item": {
      "id" : 200,      # name -> itemId, type -> number
      "name" : "",     # name -> itemName, type -> string
      "type": "shirt", # name -> itemType, type -> string
      "quantity": 1,   # name -> itemQuantity, type -> number
      "price": 7.99    # name -> itemPrice, type -> decimal
  }
}
```

[^12]: More push-based data sources are coming soon. <br/>
[^13]: This phase is referred to as Teachbi(OS)™.  A developer can paste upto 1000 rows of data, each with upto 1000 non-empty columns. <br/>
[^14]: Enhancements such as inferring tags, default values, learning from mistakes, etc. are coming soon. <br/>
