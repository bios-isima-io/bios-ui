# Authentication

All operations performed on bi(OS) require creation of a session via the login method. This login
method authenticates the user and, if successful, assigns one of the roles as defined in the
personna section.

Session to bi(OS) can be created as follows -

```python
from bios import login, ServiceError

try:
  session = login('https://bios.isima.io',
                  'admin@iam.com',
                  'password')
except ServiceError as err:
  print('Login Failure. Error code -> ' + err.error_code + ', Error message -> ' + err.message)
```

### Input parameters

| Property Name | Description                                      |
| ------------- | ------------------------------------------------ |
| _url_         | A secure URL pointing to the bi(OS) installation |
| _email_       | The work email (which acts as a userName)        |
| _password_    | The password setup for the user                  |

### Return values

| Property Name | Description                                             |
| ------------- | ------------------------------------------------------- |
| _session_     | Session object which can be used for various operations |

### Errors

A ServiceError object is returned. Possible errors could be -

| Error Code             | Description                         |
| ---------------------- | ----------------------------------- |
| CLIENT_ALREADY_STARTED | If the user is already signed in    |
| UNAUTHORIZED           | If the user credentials are invalid |

For a complete list of error codes please refer to the [Exception Handling](https://bios.isima.io/docs/content/developer-guide/exceptions) section
