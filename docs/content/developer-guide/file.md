# File

The following parameters can be configured  -
* Source Name: An alphanumeric string as a unique name for this source.
* File Location: Fully qualified path to the directory containing the files. bi(OS) will periodically poll the directory,process one file at a time, and append <span style="font-family:Courier New;">.processed</span> to the file name once done.
  Thus only newly created files will be processed during the next poll.[^38]
* Polling Interval <span style="font-family:Courier New;">(optional)</span>: The interval, in seconds, to poll the file system.
* bi(OS) authentication - To ensure only authorized users are allowed to <span style="font-family:Courier New;">insert or upsert</span> data to bi(OS), the Login
  authentication type is used with the following parameters -
  * User - Username to connect to bi(OS).
  * Password - Password to connect to bi(OS).

Refer below for an example to connect a File data source -
```json
{
  "importSourceId": "5d85ad16-bef9-4279-add4-b94e6ffe6a12",
  "importSourceName": "filePull",
  "type": "File",
  "fileLocation": "/home/data",
  "pollingInterval": 60
}
```

[^38]: Checkpointing processed data within a file is coming soon. <br/>
