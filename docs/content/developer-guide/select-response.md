# SELECT RESPONSE

The select method provides flexibility to perform simple record fetches to complex summaries with
tumbling and hopping windows.  All select operations return a SelectResponse object which consists of
DataWindows, which consists of records.

<!-- tabs:start -->

### **Python**

> * _bios.models.select_response.SelectResponse_
    >   * **definitions**: list(dict): Each dictionary contains the following properties
    >     * _name_: attribute name
    >     * _type_: attribute type
    >   * **data_windows**: list(window): Each window contains the following properties
          >     * **window_begin_time**: timestamp that indicates the beginning of the window (in milliseconds)
          >     * **records**: List of records. Each record consists of following properties:
          >       * _event_id_: uuid corresponding to the event
          >       * timestamp: timestamp
          >       * attributes: list of attributes (name-value tuples)
>

### **Java**

> * _io.isima.bios.models.SelectResponse_
    >   * **getDataWindows()**: returns a list of DataWindow objects. Each DataWindow contains
    >     * _getWindowBeginTime()_: Window begin time in millis
    >     * _getRecords()_: Each records contains
    >       * getEventId(): uuid for the event
    >       * getTimestamp(): timestamp in millis
    >       * getAttribute(String name): returns attribute value for a given attribute
    >   * **getRecords()**: Each records contains
          >     * getEventId(): uuid for the event
          >     * getTimestamp(): timestamp in millis
          >     * getAttribute(String name): returns attribute value for a given attribute
>

### **Javascript**

>
> Response for global-window (no window) query consists of properties:
>
> * definitions: list of attribute definition objects that consist of:
    >   * name: attribute name
    >   * type: attribute type
> * dataWindows: List of data windows. Each data window consists of:
    >   * windowBeginTime: timestamp that indicates the beginning of the window (in milliseconds)
    >   * records: List of records. Each record consists of following properties:
    >     * eventId: event ID
    >     * timestamp: timestamp
    >     * values: List of attribute values
>

<!-- tabs:end -->
