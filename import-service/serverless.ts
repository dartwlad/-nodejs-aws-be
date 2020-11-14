import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
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
  // Add the serverless-webpack plugin
  plugins: ['serverless-offline', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iamRoleStatements: [
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
                  name: true
                }
              }
            }
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
