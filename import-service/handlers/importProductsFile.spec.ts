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
                name: 'testName'
            }
        })).toEqual( {
            body: JSON.stringify(mockSignedUrl),
            headers,
            statusCode: 200
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
                name: 'testName'
            }
        })).toEqual( {statusCode: 500});

        AWSMock.restore('S3');
    });
});
