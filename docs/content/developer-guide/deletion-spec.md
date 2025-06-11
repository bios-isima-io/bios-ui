# Deletion Spec

This is an optional feature that allows a <span style="font-family:Courier New;">context</span> entry to be deleted[^40]  based on a condition (lambda) on a source attribute. This is applicable only for <span style="font-family:Courier New;">contexts</span>

```json
"deletionSpec": {
  "sourceAttributeName": "operation",
  "condition": "lambda operation: operation == 'DELETE'"
}
```

[^40]: Support for <span style="font-family:Courier New;">Create</span> and <span style="font-family:Courier New;">Update</span> coming soon. <br/>
