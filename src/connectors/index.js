import AWS from "aws-sdk";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { configs } from "../configs";

const awsConfig = configs.services.aws;
const cognitoConfig = awsConfig.cognito;


AWS.config.update({ region: awsConfig.region });

const cognitoUserPoolConfig = {
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId
};

export const AWSCognitoConnector = new CognitoUserPool(cognitoUserPoolConfig);
