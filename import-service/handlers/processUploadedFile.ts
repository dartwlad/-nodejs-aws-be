import {S3, SQS} from "aws-sdk";
import {Bucket} from "../constants/bucket";
import csv from 'csv-parser';

export const processUploadedFile = async (event) => {
    console.log('about to process uploaded file', event);
    const s3 = new S3();
    const sqs = new SQS();
    const processRecord = (record) => {
        return new Promise((resolve) => {
            const streamParams = {
                Bucket,
                Key: record.s3.object.key
            }
            const s3Stream = s3.getObject(streamParams)
                .createReadStream();
            s3Stream.pipe(csv())
                .on('data', async (data) => {
                    const QueueUrl = process.env.SQS_URL;
                    console.log('about to add to sqs', data);
                    console.log('sqs url: ', QueueUrl);
                    try {
                        await sqs.sendMessage({
                            QueueUrl,
                            MessageBody: JSON.stringify(data)
                        }).promise();
                        console.log('Message transferred');
                    } catch (error) {
                        console.log('error', error);
                    }
                })
                .on('end', async () => {
                    console.log('about to copy file');
                    const copyParams = {
                        Bucket,
                        CopySource: `${Bucket}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded', 'parsed')
                    };
                    await s3.copyObject(copyParams).promise();

                    console.log('about to delete file');
                    const deleteParams = {
                        Bucket,
                        Key: record.s3.object.key
                    };
                    await s3.deleteObject(deleteParams).promise();
                    resolve();
                });
        })
    }
    try {
        await Promise.all(
            event.Records.map(async (record) => {
                await processRecord(record);
            })
        );

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
