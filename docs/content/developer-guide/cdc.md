# Database CDC

### bi(OS) Configuration
bi(OS) supports receiving data via CDC logs from most common databases.[^26]

The following parameters can be configured -
* Source name - An alphanumeric string as a unique name for this source.
* Database - The type of the database.[^27]
* Database host - IP address/host name of the primary database server.[^28]
* Database port - Port on which the primary database server is listening.[^28]
* Endpoints - List of database IP address/host name and port in format of
  <span style="font-family:Courier New;">"host:port"</span>.[^29]
* authentication
  * type: Authentication type.[^30]
  * User - Username to connect to the primary database server.[^31]
  * Password - Password to use to connect to the primary database server. Required when authentication
    type is <span style="font-family:Courier New;">Login</span>.

* SSL <span style="font-family:Courier New;">(optional)</span> - Option to enable data-in-motion encryption
  when reading data from the primary database server. Note that data written into bi(OS) via <span style="font-family:Courier New;">isQL</span> is always over SSL. The SSL
  parameters consist of
  * Root CA certificate in PEM format, encoded by base64.
  * Client certificate in PKCS12 format, encoded by base64.
  * Client certificate password.

MongoDB source also has following additional parameters
* replicaSet - Name of the MongoDB replica set to connect.
* useDnsSeedList <span style="font-family:Courier New;">(optional)</span> - Enables
  DNS seed list.

To ensure an authorized user being able to
<span style="font-family:Courier New;">insert or upsert</span> data
to bi(OS), the import destination configuration requires an authentication configuration with the
following parameters -
* Type - Must be <span style="font-family:Courier New;">Login</span>.
* User - Username to connect to bi(OS).
* Password - Password to connect to bi(OS).

Refer below for an example to configure a <span style="font-family:Courier New;">SQL</span> CDC data source -
```json
{
  "importSourceId": "611e5f4d-06ec-47e7-8332-c0960004320f",
  "importSourceName": "MySQL CDC Import",
  "type": "Mysql",
  "authentication": {
    "type": "Login",
    "user": "xxxxxxxx",
    "password": "xxxxxxxx"
  },
  "databaseHost": "HOST_IP",
  "databasePort": 3306,
  "databaseName": "organization",
  "ssl": {
    "mode": "Enabled",
    "rootCaContent": "xxxxxxxx",
    "clientCertificateContent": "xxxxxxxx",
    "clientCertificatePassword": "xxxxxxxx"
  }
}
```

The following is another example to configure a MongoDB CDC data source -

```json
{
  "importSourceId": "2a26373a-22bd-11ee-be56-0242ac120002",
  "importSourceName": "MongoDB CDC Import",
  "type": "Mongodb",
  "endpoints": ["bios-mongodb.example.com:27017"],
  "replicaSet": "my-mongo-set",
  "databaseName": "inventory",
  "authentication": {
    "type": "MongodbX509",
    "user": "CN=CdcSource,O=Warehouse",
  },
  "ssl": {
    "mode": "Enabled",
    "rootCaContent": "xxxxxxxx",
    "clientCertificateContent": "xxxxxxxx",
    "clientCertificatePassword": "xxxxxxxx"
  }
}
```

### Database Server Prerequisites

#### MySQL

Prerequisites for MySQL server to enable a CDC importer to follow the tables are listed below -

* Grant <span style="font-family:Courier New;">RELOAD</span>,
  <span style="font-family:Courier New;">REPLICATION CLIENT</span>, and
  <span style="font-family:Courier New;">REPLICATION SLAVE</span> permissions to
  the database user.
* Set global variables
  <span style="font-family:Courier New;">enforce_gtid_consistency = ON</span> and
  <span style="font-family:Courier New;">gtid_mode = ON</span> in order to connect
  to a replicated cluster.

The following is an example of MySQL statements to grant the necessary permissions to user
<span style="font-family:Courier New;">integrations_user</span> -

```sql
GRANT RELOAD ON *.* TO 'integrations_user'@'%';
GRANT REPLICATION CLIENT ON *.* TO 'integrations_user'@'%';
GRANT REPLICATION SLAVE ON *.* TO 'integrations_user'@'%';
```

To set the global variables required to follow a database cluster, the following is an example of
MySQL statements -

```sql
SET GLOBAL enforce_gtid_consistency = ON;
SET GLOBAL gtid_mode = OFF_PERMISSIVE;
SET GLOBAL gtid_mode = ON_PERMISSIVE;
SET GLOBAL gtid_mode = ON
```

#### MongoDB

Prerequisites for MongoDB server to enable a CDC importer to follow the tables are listed below -

* Database servers run with replica set topology.
* MongoDB version 6 or higher.
* Option
  <span style="font-family:Courier New;">changeStreamPreAndPostImages</span>
  enabled in the collections/tables to follow.

The following is an example database command to enable
<span style="font-family:Courier New;">changeStreamPreAndPostImages</span>
in collection
<span style="font-family:Courier New;">orders</span> -

```javascript
db.runCommand({
  collMod: "orders",
  changeStreamPreAndPostImages: { enabled: true }
})
```


[^26]: MySQL, PostgresSQL, and MongoDB has been validated. <br/>
[^27]: Mysql, Postgres, or Mongodb. <br/>
[^28]: Except for Mongodb. <br/>
[^29]: Only for Mongodb. <br/>
[^30]: Only Login except for Mongodb. Mongodb import source can also choose MongodbX509 authentication type that enables MongoDB X.509 client authentication. <br/>
[^31]: The following permissions should be granted to this user - SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT. <br/>
