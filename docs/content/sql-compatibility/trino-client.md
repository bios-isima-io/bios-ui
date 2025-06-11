# Trino Client Setup

To setup your trino-cli use the following commands -

```shell
$ wget -N https://repo.maven.apache.org/maven2/io/trino/trino-cli/374/trino-cli-374-executable.jar
$ mv trino-cli-374-executable.jar trino-cli
$ chmod +x trino-cli
```
To connect to your bi(OS) installation, execute the following command -
```shell
$ ./trino-cli --server https://<TENANT>-sql.<bios-installation-host>.com --user email_address --password
```
Note that the bi(OS) credentials are to be used to access Trino capability.

Upon success you will see the below prompt
```shell
trino>
```
