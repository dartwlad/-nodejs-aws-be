import {S3} from "aws-sdk";
import {Bucket} from "../constants/bucket";
import {headers} from "../constants/headers";

export const importProductsFile = async (event) => {
    console.log('about to get signed url', event);

    try {
        const s3 = new S3();
        const Key = `uploaded/${event.queryStringParameters.name}`;
        const params = {
            Bucket,
            Key,
            Expires: 60,
            ContentType: 'text/csv'
        }
        const url = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(url)
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500
        }
    }
}