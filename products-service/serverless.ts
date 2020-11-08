import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'products-crud-service',
  },
  frameworkVersion: '2',
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-aws-documentation'
  ],
  custom: {
    documentation: {
      api: {
        info: {
          version: '1',
          title: 'product-service-API',
          description: 'Product Service API'
        }
      },
      models: [{
        name: 'Product',
        description: 'Product model',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Product id',
            },
            title: {
              type: 'string',
              description: 'Product title',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            price: {
              type: 'number',
              description: 'Product price',
            },
            image: {
              type: 'string',
              description: 'Product image',
            }
          }
        }
      },
      {
        name: 'ProductList',
        description: 'List of products',
        contentType: 'application/json',
        schema: {
          type: 'array',
          items: {
            $ref: '{{model: Product}}'
          }
        }
      },
      {
        name: 'ServiceError',
        description: 'Service error',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'Status code of error'
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }]
    },
    'serverless-offline': {
      httpPort: 9000
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: false
    }
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: 'task4.cxj8hx8jheuz.us-east-1.rds.amazonaws.com',
      PG_PORT: 5432,
      PG_DATABASE: 'taskdb',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: 'Q!werty123'
      // PG_HOST: '',
      // PG_PORT: '',
      // PG_DATABASE: '',
      // PG_USERNAME: '',
      // PG_PASSWORD: ''
    },
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
            // @ts-ignore
            documentation: {
              description: 'Get all products',
              methodResponses: [{
                statusCode: '200',
                responseModels: {
                  'application/json': 'ProductList'
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
              description: 'Get product by productId',
              pathParams: [{
                name: 'productId',
                description: 'Product id'
              }],
              methodResponses: [{
                statusCode: '200',
                responseModels: {
                  'application/json': 'Product'
                }
              },
              {
                statusCode: '404',
                responseModels: {
                  'application/json': 'ServiceError'
                }
              }]
            }
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
