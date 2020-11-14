import {S3} from "aws-sdk";
import {Bucket} from "../constants/bucket";
import csv from 'csv-parser';

export const processUploadedFile = async (event) => {
    console.log('about to process uploaded file', event);

    try {
        const s3 = new S3();

        for (const record of event.Records) {
            const streamParams = {
                Bucket,
                Key: record.s3.object.key
            }
            const s3Stream = s3.getObject(streamParams)
                .createReadStream();

            s3Stream.pipe(csv())
                .on('data', (data) => console.log(data))
                .on('end', async () => {
                    const copyParams = {
                        Bucket,
                        CopySource: `${Bucket}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded', 'parsed')
                    };
                    await s3.copyObject(copyParams).promise();

                    const deleteParams = {
                        Bucket,
                        Key: record.s3.object.key
                    };
                    await s3.deleteObject(deleteParams).promise();
                });
        }

        return {
            statusCode: 202
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500
        }
    }
}
