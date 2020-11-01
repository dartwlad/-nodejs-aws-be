import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'products-service',
  },
  frameworkVersion: '2',
  plugins: ['serverless-webpack', 'serverless-openapi-documentation'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'us-east-1',
  },
  custom: {
    documentation: {
      version: '1',
      title: 'products-service',
      description: 'products-service-API',
    },
    // webpack: {
    //   webpackConfig: 'webpack.config.js',
    //   includeModules: true
    // }
  },
  functions: {
    getProducts: {
      handler: 'handler.getProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            },
            // @ts-ignore
            documentation: {
              summary: 'Get Products',
              methodResponses: [{
                statusCode: 200,
                responseBody: {
                  description: 'List of products'
                }
              }]
            }
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
            // @ts-ignore
            documentation: {
              summary: 'Get Product By Id',
              pathParams: [{
                name: 'productId',
                schema: {
                  type: 'number',
                  pattern: '^\d+$'
                }
              }],
              methodResponses: [{
                statusCode: 200,
                responseBody: {
                  description: 'Product'
                }
              },
                {
                statusCode: 404,
                responseBody: {
                  description: 'not found error'
                }
              }]
            }
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
