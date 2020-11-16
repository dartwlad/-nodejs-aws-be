import {S3} from "aws-sdk";
import {Bucket} from "../constants/bucket";
import {headers} from "../constants/headers";

export const importProductsFile = async (event) => {
    console.log('about to get signed url', event);
    const supportedExtensions = ['text/csv', 'application/vnd.ms-excel', 'text/x-csv'];

    try {
        const s3 = new S3();
        const Key = `uploaded/${event.queryStringParameters.name}`;
        const ContentType = decodeURIComponent(event.queryStringParameters.type);

        if (!supportedExtensions.includes(ContentType)) {
            return {
                statusCode: 400,
                body: 'Content type not supported',
                headers
            }
        }

        const params = {
            Bucket,
            Key,
            Expires: 60,
            ContentType
        }
        const url = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers,
            body: url
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500
        }
    }
}
