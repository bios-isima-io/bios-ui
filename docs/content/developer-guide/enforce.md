# Enforce

Once the table structure is ready developers can select the following schema and column level enforcements to be
performed during ingestion.  Note that there is a limitation of 40 characters for names of <span style="font-family:Courier New;">signals, contexts,
columns, enrichments, features, and alerts</span>.

### Schema Enforcement
Developers can choose to model a table/stream as a <span style="font-family:Courier New;">signal</span> or a <span style="font-family:Courier New;">context</span>.  As described earlier, these two primitives
trade off volume and mutability.  Once developers choose a storage type for a table/stream, they can further apply
the following enforcements -

* For <span style="font-family:Courier New;">CSV</span> and <span style="font-family:Courier New;">JSON</span> payloads
  * Convert snake case to camel case - converts spaces(‘ ’) and underscores(‘_’) in column names to <span style="font-family:Courier New;">camelCase</span>.
  * Convert null or empty strings to  ‘<span style="font-family:Courier New;">MISSING</span>' - converts null and empty strings to a
    string with the default value set to ‘<span style="font-family:Courier New;">MISSING</span>’.
* For <span style="font-family:Courier New;">JSON</span> payloads
  * Stringify[^15]  scalar arrays - stringifies array elements.
  * Convert *_at or *At to timestamp - many <span style="font-family:Courier New;">JSON</span> fields representing timestamps end with a
    postfix of <span style="font-family:Courier New;">‘_at’</span>  or <span style="font-family:Courier New;">‘_At’</span>.  This option
    converts such fields into <span style="font-family:Courier New;">milliseconds</span> since the epoch.
  * Flatten <span style="font-family:Courier New;">JSON</span> - bi(OS) flattens <span style="font-family:Courier New;">JSON</span> payloads during onboarding to make it <span style="font-family:Courier New;">SQL</span>-friendly for downstream consumers.
    The developer can choose two options -
    - Prepend keys - This option recursively prepends the attribute name of the current level to each attribute within the nested level to avoid name conflicts.
    - Prepending key style - This option allows the developer to select either <span style="font-family:Courier New;">snake_case</span> or <span style="font-family:Courier New;">camelCase</span> to use
      during pre-pending keys.

### Column Enforcement
bi(OS) supports the following enforcements for each column -
* Data type - bi(OS) can handle the following data types -
  * <span style="font-family:Courier New;">Number</span> - An integer (64-bit in length); -2<sup>63</sup> to 2<sup>63</sup> - 1.
  * <span style="font-family:Courier New;">Decimal</span> - 64 bit IEEE-754 format;  1.7<sup>-308</sup> to 1.7<sup>+308</sup>.
  * <span style="font-family:Courier New;">Text</span> - Represents a UTF-8[^16]  encoded <span style="font-family:Courier New;">string</span>,
    consisting of 0 to 2<sup>31</sup> -  1 characters. It is recommended to store <= 4KB of data.
  * <span style="font-family:Courier New;">Boolean</span> - a flag that represents TRUE or FALSE.
* Missing value - using this option, an  insert or an <span style="font-family:Courier New;">upsert</span> with a missing value for a column is rejected or
  filled in with a specified default value.
* Allowed values - For <span style="font-family:Courier New;">Text</span> columns, developers can define the list of accepted string values.[^17]

If data within an <span style="font-family:Courier New;">insert</span> or <span style="font-family:Courier New;">upsert</span> doesn’t
follow the enforced rules, that operation is rejected.[^18]  Note that all enforcement rules can be changed at run-time in production without any outage.[^5]

### Attribute Tags
bi(OS) allows the developer to define tags for each column. These tags provide semantic information for consuming
data and insights from bi(OS).  These tags fall into the following groups -[^18]
* <span style="font-family:Courier New;">Category</span> - Identifies the semantic type of the attribute.
  * <span style="font-family:Courier New;">Quantity</span>  - Applicable to numeric types which are additive. E.g., numViews, numOrders etc. These attributes
    can be assigned further tags  as defined[^19]  below -
    * <span style="font-family:Courier New;">Kind</span> - Currency, Weight, etc.
    * <span style="font-family:Courier New;">Unit</span>  - Kilograms, MilliMeters, etc.
    * <span style="font-family:Courier New;">Unit display name</span> - strings such as “$”, “USD”, etc.
    * <span style="font-family:Courier New;">Unit display position</span> - Prefix, Post-fix.
    * <span style="font-family:Courier New;">Positive indicator</span> - Higher is better, Lower is better.
  * <span style="font-family:Courier New;">Dimension</span>  - applicable to both Numeric and Text types.  Numeric types which are not additive E.g., productId,
    categoryId (even though Numeric, are not additive) and non-arbitrary Text types  E.g., gender, deviceType (even though text, have few distinct values).
  * <span style="font-family:Courier New;">Description</span> - Applicable to text data types representing arbitrary strings, E.g., logMessage, fullAddress,
    productDescription, etc.
* <span style="font-family:Courier New;">Primary metric</span>  - specifies the primary metric to be shown on bi(OS)’s built-in data catalog -
  * Numeric Types  - <span style="font-family:Courier New;">sum, min,  max, avg, median, stddev, variance, skewness, kurtosis, percentiles & quantiles</span>.
  * Text Type  - <span style="font-family:Courier New;">Word Cloud</span>.


[^5]: See the section [Operate](https://bios.isima.io/docs/content/developer-guide/operate). <br/>
[^15]: More capabilities to help with JSON handling are coming soon. <br/>
[^16]: Refer [here](https://www.rfc-editor.org/rfc/rfc3629) for RFC3629 which discusses UTF-8 format. <br/>
[^17]: Think of this as <span style="font-family:Courier New;">enum</span> support in most programming languages. <br/>
[^18]: See Consume section below to see how these are utilized. <br/>
[^19]: This isn’t an exhaustive list, please see the Mobile UI for more information. <br/>
