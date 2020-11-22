import {ProductsService} from "../services/products-service";
import {LogService} from "../services/log-service";
import {SNS} from 'aws-sdk';

export const catalogBatchProcess = async (event) => {
    const logService = new LogService();
    const productsService = new ProductsService();
    const sns = new SNS();

    logService.log('about to catalogBatchProcess', event)
    for (const record of event.Records) {
        logService.log('about to add product', record)
        await productsService.createProduct(JSON.parse(record));
    }

    logService.log('about to notify subscribers');
    try {
        await sns.publish({
            Subject: 'Products added',
            Message: JSON.stringify(event.Records),
            TopicArn: process.env.SNS_ARN
        }).promise();
        console.log('Email send');
    } catch (error) {
        console.log('error', error);
    }
}
