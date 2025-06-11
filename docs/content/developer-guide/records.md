#### Records
These contain the records returned by the system for a given window. If the SELECT query does not request
a tumbling or hopping window, all the data is returned in a single window.

Refer below for printing all the records within all data windows.

<!-- tabs:start -->

##### **Python**
```python
for window in response.get_data_windows():
    for record in window.records:
        print('Country -> ' + record.get('countryName'))
        print('Deaths  -> ' + str(record.get('reportedDeaths')))
```

##### **Java**
```java
for (final DataWindow window: response.getDataWindows()) {
    for (final Record record: window.getRecords()) {
        logger.info("Country -> " + record.getAttribute("countryName").asString());
        logger.info("Deaths  -> " + record.getAttribute("reportedDeaths").asLong());
    }
}
```

##### **Javascript**
```javascript
response.dataWindows.forEach(dataWindow => {
    dataWindow.records.forEach(record => {
        console.log(record);
    })
})
```

<!-- tabs:end -->
