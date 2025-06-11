# SQL Pull

The following parameters can be configured  -
* Source Name - An alphanumeric string as a unique name for this source.
* Database - The type of the RDBMS.[^37]
* Database Host - IP Address or hostname of the RDBMS server.
* Database Port - Port on which the RDBMS server is listening.
* User - Username to connect to the RDBMS server.
* Password - Password to connect to the RDBMS server.
* Enable SSL (optional)- Enable if the RDBMS server supports SSL.
* Polling Interval - The interval at which to poll the RDBMS server.
* Parameters that need to be configured per <span style="font-family:Courier New;">signal/context</span> -
  * Table Name - The table from which to retrieve data.
  * Timestamp column  - The column within a table representing the timestamp when the row was created or updated. bi(OS) will use this timestamp to fetch only newly updated or created rows since the last checkpointed time in bi(OS).
* bi(OS) authentication - To ensure only authorized users are allowed to <span style="font-family:Courier New;">insert or upsert</span> data to bi(OS), the Login authentication type is used with the following parameters -
  * User - Username to connect to bi(OS).
  * Password - Password to connect to bi(OS).

Refer below for an example to connect an <span style="font-family:Courier New;">SQL</span>-pull data source -
```json
{
  "importSourceId": "50fb1208-10c6-42a8-ba7a-3bed84b4e41c",
  "importSourceName": "sqlpull",
  "type": "MysqlPull",
  "authentication": {
    "type": "Login",
    "user": "xxxxxxxx",
    "password": "xxxxxxxx"
  },
  "importDestinationId": "",
  "databaseHost": "DB_HOST_IP",
  "databasePort": 3306,
  "databaseName": "organization",
  "sslEnable": false,
  "pollingInterval": 60
}
```

[^37]: Currently MySQL is validated. <br/>
