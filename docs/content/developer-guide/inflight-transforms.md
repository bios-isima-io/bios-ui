# In-flight Transforms

While the onboarding stage provides enforcement via type validations and filling missing values; developers usually
need to perform complex in-flight transformations (e.g., encoding, encryption, etc.). bi(OS)  provides this
capability to developers using the  <span style="font-family:Courier New;">Attribute Transforms</span> section in two ways - Python <span style="font-family:Courier New;">lambdas</span> and
<span style="font-family:Courier New;">user-defined-functions (UDFs)</span>.

**NOTES**
* These in-flight transforms are executed before data is stored.  Hence, performing complex transforms during this
  process isn’t recommended.
* bi(OS) ensures that a bad code doesn’t bring down the system.

### Lambdas
<span style="font-family:Courier New;">Lambdas</span> consist of a single line of Python code that can perform basic transformations, e.g. the below
concatenates two columns -
```json
{
  "sourceAttributeNames": [
    "A",
    "B"
  ],
  "transforms": [
    {
      "rule": "lambda a, b: a + '_' + b"
    }
  ]
}
```
### User-defined Functions (Processors)
<span style="font-family:Courier New;">User-defined functions (UDFs)</span> are Python functions that perform more complex processing
than <span style="font-family:Courier New;">lambdas</span>.  <span style="font-family:Courier New;">UDFs</span> are registered
into bi(OS) as <span style="font-family:Courier New;">processors</span>. Various data sources, targets, or columns can reuse these
<span style="font-family:Courier New;">UDFs</span> for pre-processing.  E.g.,  if you need to convert an attribute value from a specific date
format to an <span style="font-family:Courier New;">epoch</span>, you can define the following function -
```python
import datetime

def convert_date_to_epoch(val):
    if isNull(val):
        return ""

    try:
        val = str(int(datetime.datetime.strptime(val, "%Y-%m-%d %H:%M:%S").timestamp() * 1000))
    except:
        return ""

    return val
```
This can then be registered with bi(OS) as <span style="font-family:Courier New;">dateUtils</span> processor as shown below[^42]  -
```python
func = """
import datetime

def convert_date_to_epoch(val):
  if isNull(val):
    return ""

  try:
    val = str(int(datetime.datetime.strptime(val, "%Y-%m-%d %H:%M:%S").timestamp()*1000))
  except:
    return ""

  return val
"""
session.create_import_data_processor('dateUtils', func)
```
The <span style="font-family:Courier New;">dateUtils</span> processor can then be used in a flow to transform a sourceAttribute as shown below -
```json
{
  "sourceAttributeNames": [
    "receivedAt"
  ],
  "processes": [
    {
      "processorName": "dateUtils",
      "method": "convert_date_to_epoch"
    }
  ]
}
```
[^42]: Refer bi(OS) <span style="font-family:Courier New;">isQL</span> SDK reference. <br/>
