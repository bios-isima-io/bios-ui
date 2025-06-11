# [Exception Handling](#exception-handling)

bi(OS) throws a ServiceError exception capturing various errors during SDK method invocations.
This class provides an error code and a message that  provide details of the exception encountered.
Refer below for its typical usage (in python syntax) -

```python
from bios import ServiceError

try:
  response = session.execute(request)
except ServiceError as err:
	print(‘Error code -> ‘ + err.errorCode + ‘, Error Message -> ‘ + err.message)
```

The table below captures various error codes and messages

| Type   | Error Code                | Message                                                                       |
| ------ | ------------------------- | ----------------------------------------------------------------------------- |
| Client | GENERIC_CLIENT_ERROR      | An unexpected problem happened on client side                                 |
| Client | INVALID_ARGUMENT          | Invalid argument was given to an SDK method                                   |
| Client | SESSION_INACTIVE          | A request for an operation was issued to the client, but it is closed already |
| Client | PARSER_ERROR              | Failed to convert a string to a request object                                |
| Client | CLIENT_ALREADY_STARTED    | Tried to start already started client                                         |
| Client | REQUEST_TOO_LARGE         | Request entity too large                                                      |
| Client | INVALID_STATE             | Client is in invalid state                                                    |
| Server | SERVER_CONNECTION_FAILURE | SDK failed to connect with the  server                                        |
| Server | SERVER_CHANNEL_ERROR      | SDK encountered a communication error                                         |
| Server | UNAUTHORIZED              | Not authorized                                                                |
| Server | FORBIDDEN                 | Permission denied                                                             |
| Server | SERVICE_UNAVAILABLE       | Server is currently unavailable                                               |
| Server | GENERIC_SERVER_ERROR      | An unexpected problem happened on the server side                             |
| Server | TIMEOUT                   | Operation has timed out                                                       |
| Server | BAD_GATEWAY               | Load balancer proxy failed due to upstream server crash                       |
| Server | SERVICE_UNDEPLOYED        | Requested resource was not found on the server                                |
| Server | OPERATION_CANCELLED       | Operation has been cancelled by peer                                          |
| Server | NO_SUCH_TENANT            | The specified tenant does not exist                                           |
| Server | NO_SUCH_STREAM            | The specified stream does not exist                                           |
| Server | NOT_FOUND                 | Target entity does not exist in server                                        |
| Server | TENANT_ALREADY_EXISTS     | SDK tried to add an tenant, but specified tenant already exists               |
| Server | STREAM_ALREADY_EXISTS     | SDK tried to add a stream, but specified stream already exists                |
| Server | RESOURCE_ALREADY_EXISTS   | SDK tried to add an entity to server, but the target already exists           |
| Server | BAD_INPUT                 | Server rejected input due to invalid data or format                           |
| Server | NOT_IMPLEMENTED           | Not implemented                                                               |
| Server | CONSTRAINT_WARNING        | Constraint warning. Set force option to override                              |
| Server | SCHEMA_VERSION_CHANGED    | Given stream version no longer exists                                         |
| Server | INVALID_REQUEST           | Server rejected request due to invalid request                                |
| Server | BULK_INGEST_FAILED        | Bulk ingest failed                                                            |
| Server | SERVER_DATA_ERROR         | Server returned malformed data                                                |

