import jwt from 'jsonwebtoken';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { AWSCognitoConnector } from '../../connectors';
import { configs } from '../../configs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class logInService {
  private cognitoUser: CognitoUser;
  private authenticationPayload: AuthenticationDetails;

  handleLogin = async (email: string, password: string) => {
    this.authenticationPayload = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    this.cognitoUser = new CognitoUser({
      Username: email,
      Pool: AWSCognitoConnector,
    });
    const logInServiceResponse = await this.authenticateUser();
    return logInServiceResponse;
  };

  private authenticateUser = () => {
    const {
      InvalidParameterException,
      NotAuthorizedException,
      LOGIN_SERVICE_INVALID_PAYLOAD_ERROR,
      LOGIN_SERVICE_INCORRECT_CREDENTIALS_ERROR,
    } = configs.errors.authentication;

    const authenticationPromise = new Promise((resolve) => {
      // function that handles authentication failure
      const handleFailure = (error: any): void => {
        console.log('COGNITO_LOGIN_EROOR', error);
        switch (error.code) {
          case InvalidParameterException: {
            resolve({
              error: LOGIN_SERVICE_INVALID_PAYLOAD_ERROR,
              payload: {},
            });
            break;
          }
          case NotAuthorizedException: {
            resolve({
              error: LOGIN_SERVICE_INCORRECT_CREDENTIALS_ERROR,
              payload: {},
            });
            break;
          }
          default: {
            resolve({
              error: 'LOGIN_SERVICE_ERROR',
              payload: {},
            });
          }
        }
      };
      // function that sends jwt back or resolves promise with account parsing error
      const handleSuccess = (account: any): void => {
        try {
          /*
                       const idToken = account.getIdToken().getJwtToken();
                       const decodedIDToken = jwt.decode(idToken, { complete: true });
                       const refreshToken = account.getRefreshToken().getToken();
                     */
          const accessToken = account.getAccessToken().getJwtToken();
          const decodedAccessToken = jwt.decode(accessToken, {
            complete: true,
          });
          resolve({
            error: false,
            payload: decodedAccessToken.payload.username,
          });
        } catch (error) {
          console.log('LOGIN_SERVICE_ACCOUNT_PARSING_ERROR', error);
          resolve({
            error: 'LOGIN_SERVICE_ACCOUNT_PARSING_ERROR',
            payload: error,
          });
        }
      };

      try {
        this.cognitoUser.authenticateUser(this.authenticationPayload, {
          onFailure: handleFailure,
          onSuccess: handleSuccess,
        });
      } catch (error) {
        console.log('LOGIN_SERVICE_ERROR', error);
        resolve({ error: 'LOGIN_SERVICE_ERROR', payload: {} });
      }
    });
    return authenticationPromise;
  };
}
