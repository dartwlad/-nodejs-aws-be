import {ProductsService} from "../services/products-service";
import {LogService} from "../services/log-service";
import {SNS} from 'aws-sdk';

export const catalogBatchProcess = async (event) => {
    const logService = new LogService();
    const productsService = new ProductsService();
    const sns = new SNS();

    try {
        logService.log('about to catalogBatchProcess', event);
        const productsToAdd = event.Records.map((record) => productsService.createProduct(record.body));
        logService.log('about to add products', event.Records);
        await Promise.all(productsToAdd);
        logService.log('about to notify subscribers');

        await sns.publish({
            Subject: 'Products added',
            Message: JSON.stringify(event.Records),
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
                status: {
                    DataType: "String",
                    StringValue: getStatus(),
                },
            },
        }).promise();
        console.log('Email send');
    } catch (error) {
        console.log('error', error);
    }
}

function getStatus(): string {
    const random = Math.floor(Math.random() * 11);
    return random >= 5
        ? 'success'
        : 'failed';
}
