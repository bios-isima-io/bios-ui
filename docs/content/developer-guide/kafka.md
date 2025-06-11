# Kafka

The following parameters can be configured  -
* Source Name - An alphanumeric string as a unique name for this source.
* Bootstrap Servers - Addresses at which the Kafka cluster nodes are listening. The format is - <span style="font-family:Courier New;">IP:PORT</span> or
  <span style="font-family:Courier New;">HOSTNAME:PORT</span>.
* API Version - The API version to use to connect to Kafka.
* User - Username to connect to the Kafka cluster.
* Password - Password to connect to the Kafka cluster.[^24]
* bi(OS) authentication - To ensure only authorized users are allowed to <span style="font-family:Courier New;">insert or upsert</span> data to bi(OS), the
  Login authentication type is used with the following parameters -
  * User - Username to connect to bi(OS).
  * Password - Password to connect to bi(OS).
* Additional Parameters <span style="font-family:Courier New;">(optional)</span>: Users can provide additional parameters  as key-value pairs for fine-grained
  consumer configuration, such as - <span style="font-family:Courier New;">client_id, group_id,  auto_offset_reset, enable_auto_commit</span> etc.[^25]

Refer below for an example to configure an Apache Kafka data source -

```json
{
  "importSourceId": "10c36da0-0ced-4a8d-84d3-9d9966709f0d",
  "importSourceName": "kafkaplatform",
  "type": "Kafka",
  "authentication": {
    "type": "SaslPlaintext",
    "user": "xxxxxxxx",
    "password": "xxxxxxxx"
  },
  "bootstrapServers": [
    "kafka1.platform.link:9092",
    "kafka2.platform.link:9092",
  ],
  "apiVersion": [
    0,
    10,
    1
  ]
}
```

[^24]: SSL support for client-server communication is coming soon. <br/>
