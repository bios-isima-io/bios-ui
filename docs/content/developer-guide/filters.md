# Filters

Filters produce boolean results based on attributes in the incoming data and decide if and how a <span style="font-family:Courier New;">flow</span> should process the data.

See below for an example filter that allows request processing if the type attribute has the value <span style="font-family:Courier New;">track</span> and[^39]  the
<span style="font-family:Courier New;">event</span> attribute has the value “Product Viewed”. This feature can be used to split data from a single source into
various <span style="font-family:Courier New;">signals</span> or <span style="font-family:Courier New;">contexts</span>.


```json
"filters": [
	{
		"sourceAttributeName": "type",
		"filter": "lambda value: value == 'track'"
	},
	{
		"sourceAttributeName": "event",
		"filter": "lambda value: value in {'Product Viewed'}"
	}
]
```

[^39]: Support for OR conditions is coming soon. <br/>
