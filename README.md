# Getting Started with Serverless Stack (SST)

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ npm install
```

## Commands

### `npm run start`

Starts the local Lambda development environment.

### `npm run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

### `npm run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Helpers

### Create a test user and get credentials for API

We’ll use AWS CLI to sign up a user with their email and password.

```bash
./helpers/create-cognito-user
```
(fill Region and UserPoolClientId with the ones printed by sst outputs)

Confirm user.

```bash
./helpers/verify-cognito-user-email
```
(fill Region and UserPoolId with the ones printed by sst outputs)

Generate credentials for API:

```
./create-cognito-credentials.js
```
(fill all requested parameters)

Postman can be used to generate AWS signature using a specified auth kind passing the output of the above commands.

## Documentation

Learn more about the Serverless Stack.
- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or [post on our forums](https://discourse.serverless-stack.com).

