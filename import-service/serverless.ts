import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    'serverless-offline': {
      httpPort: 9000
    },
  },
  plugins: [
    'serverless-offline',
    'serverless-webpack',
    'serverless-pseudo-parameters'
  ],
  resources: {
    Resources: {
      GatewayResponseDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref:  'ApiGatewayRestApi'
          }
        }
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'"
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref:  'ApiGatewayRestApi'
          }
        }
      },
    }
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: '${cf:products-service-crud-${self:provider.stage}.SQSUrl}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: '${cf:products-service-crud-${self:provider.stage}.SQSArn}'
      },
      {
        Effect: 'Allow',
        Action: 's3:uploadToBucket',
        Resource: ['arn:aws:s3:::task5-files-upload']
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['arn:aws:s3:::task5-files-upload/*']
      }
    ]
  },
  functions: {
    processUploadedFile: {
      handler: 'handler.processUploadedFile',
      events: [
        {
          s3: {
            bucket: 'task5-files-upload',
            event: 's3:ObjectCreated:*',
            rules: [{
              prefix: 'uploaded/',
              suffix: ''
            }],
            existing: true
          }
        }
      ]
    },
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true,
                  type: true
                }
              }
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: 'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:authorization-service-dev-basicAuthorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token'
            }
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
