#!/usr/bin/env node

const AWS = require("aws-sdk");
const AWSCognito = require("amazon-cognito-identity-js");
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');


async function getConfig() {
  return {
    region: await question("region: "),
    userPoolId: await question("userPoolId: "),
    identityPoolId: await question("identityPoolId: "),
    appClientId: await question("appClientId: "),
    email: await question("email: "),
    password: await question("password: "),
  };
}

async function run() {
  const config = await getConfig();
  const tokens = await authenticate(config);
  const credentials = await getCredentials(config, tokens);
  console.log("AWS Signature parameters")
  console.log(credentials);
}

run()
  .catch(err => console.error(err));

function authenticate(config) {
  var poolData = {
    UserPoolId: config.userPoolId,
    ClientId: config.appClientId
  };

  AWS.config.update({ region: config.region });
  var userPool = new AWSCognito.CognitoUserPool(poolData);

  var userData = {
    Username: config.email,
    Pool: userPool
  };
  var authenticationData = {
    Username: config.email,
    Password: config.password
  };
  var authenticationDetails = new AWSCognito.AuthenticationDetails(
    authenticationData
  );

  var cognitoUser = new AWSCognito.CognitoUser(userData);

  console.log("Authenticating with User Pool");

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        resolve({
          idToken: result.getIdToken().getJwtToken(),
          accessToken: result.getAccessToken().getJwtToken()
        });
      },
      onFailure: function(err) {
        reject(err.message ? err.message : err);
      },
      newPasswordRequired: function() {
        reject("Given user needs to set a new password");
      },
      mfaRequired: function() {
        reject("MFA is not currently supported");
      },
      customChallenge: function() {
        reject("Custom challenge is not currently supported");
      }
    });
  });
}

function getCredentials(config, {idToken}) {
  console.log("Getting temporary credentials");

  var logins = {};
  logins[
    "cognito-idp." + config.region + ".amazonaws.com/" + config.userPoolId
  ] = idToken;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.identityPoolId,
    Logins: logins,
  }, {
    region: config.region,
  });

  return new Promise((resolve, reject) => {
    AWS.config.credentials.get(function(err) {
      if (err) {
        reject(err.message ? err.message : err);
        return;
      }
  
      resolve(
        {
          accessKey: AWS.config.credentials.accessKeyId,
          secretKey: AWS.config.credentials.secretAccessKey,
          sessionToken: AWS.config.credentials.sessionToken,
        }
      );
    });
  });
}

async function question(text) {
  const rl = readline.createInterface({ input, output });
  const promise = new Promise((resolve, reject) => {
    rl.question(text, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
  return promise;
}
