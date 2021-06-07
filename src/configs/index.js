export const configs={
    services: {
        aws: {
          region: "xyz",
          cognito: {
            userPoolId: "root",
            clientId: "root"
          }
      }
  },
  errors: {
    authentication: {
        InvalidParameterException: "InvalidParameterException",
        NotAuthorizedException: "NotAuthorizedException",
        LOGIN_SERVICE_INVALID_PAYLOAD_ERROR:
        "LOGIN_SERVICE_INVALID_PAYLOAD_ERROR",
      LOGIN_SERVICE_INCORRECT_CREDENTIALS_ERROR:
        "LOGIN_SERVICE_INCORRECT_CREDENTIALS_ERROR"
    }
  }
}