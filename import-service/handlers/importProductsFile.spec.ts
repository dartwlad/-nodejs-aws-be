import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import {importProductsFile} from './importProductsFile';
import {headers} from "../constants/headers";

describe('importProductsFile', () => {
    it('should import products file', async () => {
        const mockSignedUrl = 'mockSignedUrl';
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
            callback(null, mockSignedUrl);
        });

        expect(await importProductsFile({
            queryStringParameters: {
                name: 'testName',
                type: 'text/csv'
            }
        })).toEqual( {
            body: mockSignedUrl,
            headers,
            statusCode: 200
        });

        AWSMock.restore('S3');
    });

    it('should throw validation error', async () => {
        const mockSignedUrl = 'mockSignedUrl';
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
            callback(null, mockSignedUrl);
        });

        expect(await importProductsFile({
            queryStringParameters: {
                name: 'testName',
                type: 'video/mp4'
            }
        })).toEqual( {
            body: 'Content type not supported',
            headers,
            statusCode: 400
        });

        AWSMock.restore('S3');
    });

    it('should not import products file', async () => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', () => {
            throw new Error();
        });

        expect(await importProductsFile({
            queryStringParameters: {
                name: 'testName',
                type: 'text/csv'
            }
        })).toEqual( {statusCode: 500});

        AWSMock.restore('S3');
    });
});
