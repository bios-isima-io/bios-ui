# INSERT RESPONSE

bi(OS) provides two types of <span style="font-family:Courier New;">insert</span> capability depending on the user requirement.  Both versions of <span style="font-family:Courier New;">insert</span>
return an _InsertResponse_ object.

<!-- tabs:start -->

#### **Python**

|                  |                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _response\_type_ | This is always set to ISqlResponseType.INSERT                                                                                                                                                                                                                                                                                                                                                                            |
| _records_        | For each successful INSERT operation, biOS returns a pair of identifiers that uniquely identify the operation. They are -<br><br>**event_id**: UUID (Universally Unique Identifier of type _TimeUUID_)<br>**timestamp**: The timestamp of _insertion_ in UTC<br><br>If the operation is a single record insertion, one record is returned. For bulk operations, multiple records (event_id/timestamp pairs) are returned |

The code below iterates over the response to print the event_id and timestamp fields.

```python
for record in response.records:
  print('event_id -> ' + str(record.get_event_id()))
  print('timestamp -> ' + str(record.get_timestamp()))
```

#### **Java**
The InsertResponse supports following methods -

|                     |                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _getResponseType()_ | This is always set to _ISqlResponseType.INSERT_                                                                                                                                                                                                              |
| _getRecords()_      | For each successful INSERT operation, bi(OS) returns a _List\<Record\>_<br>_Record_ has following methods<br> - **getEventId()**: UUID (Universally Unique Identifier)<br> - **getTimestamp()**: The time at which ingestion happened (Ingest time)  in UTC. |

The code below iterates over the response to prints the eventId and timestamp

```java
for (final var record : response.getRecords()) {
    logger.info("event_id -> " + record.getEventId());
    logger.info("timestamp -> " + record.getTimestamp());
}
```

#### **Javascript**
The InsertResponse consists of -

|                  |                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _response\_type_ | This is always set to ResponseType.INSERT                                                                                                                                                                                                                                                                                                                                                                               |
| _records_        | For each successful INSERT operation, biOS returns a pair of identifiers that uniquely identify the operation. They are -<br><br>**eventId**: UUID (Universally Unique Identifier of type _TimeUUID_)<br>**timestamp**: The timestamp of _insertion_ in UTC<br><br>If the operation is a single record insertion, one record is returned. For bulk operations, multiple records (event_id/timestamp pairs) are returned |

The code below iterates over the response to print the event_id and timestamp fields.

```javascript
for record in response.records:
    console.log('eventId -> ' + record.eventId)
    console.log('timestamp -> ' + record.timestamp)
```

<!-- tabs:end -->
