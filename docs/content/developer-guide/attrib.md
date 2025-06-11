# Attributes

An arbitrary number of _attributes_ can be defined as part of <span style="font-family:Courier New;">context</span>/<span style="font-family:Courier New;">signal</span> configuration

```json
{
  "attributeName": "gender",
  "type": "string",
  "allowedValues": ["MALE", "FEMALE", "UNKNOWN"],
  "missingAttributePolicy": "StoreDefaultValue",
  "default": "UNKNOWN"
}
```
| Property Name            | Description                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _attributeName_          | Name of the attribute.                                                                                                                                                                                          |
| _type_                   | Data type of the attribute. Possible values are -<br/> - _String_.<br/> - _Number_ (int64).<br/> - _Decimal_ (double, float).<br/> - _Boolean_.                                                                 |
| _missingAttributePolicy_ | Used to override the setting at the global (<span style="font-family:Courier New;">signal</span> or <span style="font-family:Courier New;">context</span>) level.                                               |
| _default_                | The default value to use if an attribute is empty and _missingAttributePolicy_ results in _StoreDefaultValue_.                                                                                                  |
| _allowedValues_          | For strings which values are allowed<br/> - A list of strings (_enumeration_) can be supplied<br/> - If _missingAttributePolicy_ is set to store a default value, the default value should be part of the list. |

## Context Specific Configuration

| Property Name      | Description                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| _primaryKey_       | An ordered set of _attributes_ within a <span style="font-family:Courier New;">context</span> that form key to find a context entry.[^83] |
| _versionAttribute_ | See below.                                                                                                                                |
| _features_         | See [Context Features](https://bios.isima.io/docs/content/developer-guide/features).                                                      |

### <a id="context_audit"></a>Context Audit

Contexts record changes via operations
<span style="font-family:Courier New;">upsert</span>, <span style="font-family:Courier New;">update</span>, and
<span style="font-family:Courier New;">delete</span> into a separate signal.
The audit signal is created automatically and contains the following attributes -

* _operation - Operation type, values are <span style="font-family:Courier New;">Insert</span>, <span style="font-family:Courier New;">Update</span>, or <span style="font-family:Courier New;">Delete</span>.
* attributes with the same name and type with the source context - the values are attributes after
  the change for upserts and updates, the previous attributes for deletes.
* attributes with the name "prev" + source attribute name - the values are attributes before the
  operation for updates and deletes, attributes after the operation for inserts.

For an example context as follows -

```json
{
  "contextName": "productCatalog",
  "missingAttributePolicy": "Reject",
  "attributes": [
    {
      "attributeName": "productId",
      "type": "Integer"
    },
    {
      "attributeName": "productName",
      "type": "string"
    }
  ],
  "primaryKey": [
    "productId"
  ]
}
```

schema of the audit signal would be as follows -

```json
{
  "signalName": "auditProductCatalog",
  "missingAttributePolicy": "Reject",
  "attributes": [
    {
      "attributeName": "_operation",
      "type": "String"
    },
    {
      "attributeName": "productId",
      "type": "Integer"
    },
    {
      "attributeName": "productName",
      "type": "string"
    },
    {
      "attributeName": "prevProductId",
      "type": "Integer"
    },
    {
      "attributeName": "prevProductName",
      "type": "string"
    }
  ]
}
```

### <a id="version_attribute"></a>Version Attribute
By default, bi(OS) uses the time at which an <span style="font-family:Courier New;">upsert</span> request was made as version/timestamp for the <span style="font-family:Courier New;">context</span> entry. This default behaviour can be overridden by specifying the name of the attribute to be used as version/timestamp in the
<span style="font-family:Courier New;">versionAttribute</span>. Please note that -
* The attribute must be of type <span style="font-family:Courier New;">integer</span>.
* An entry with a lower version is overwritten by an entry with higher version. i.e. If an attempt is made to <span style="font-family:Courier New;">upsert</span> an entry with a lower timestamp
  than the current timestamp for that entry, that <span style="font-family:Courier New;">upsert</span> will be a no-op.

```json
{
  "attributeName": "updatedAt",
  "type": "integer"
}

"versionAttribute": "updatedAt",
```
