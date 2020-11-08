import {ProductsService} from "../services/products-service";
import {headers} from "../mocks/headers";
import {LogService} from "../services/log-service";

export const getProductsById: (event) => Promise<{ body: string; statusCode: number } | { body: string; statusCode: any }> = async (event) => {
    try {
        new LogService().log('about to getProductsById', event);
        const body = JSON.stringify(await new ProductsService().getProductsById(event.pathParameters.productId));
        return {
            statusCode: 200,
            body,
            headers
        };
    } catch (e) {
        const {error, statusCode} = e;
        return {
            statusCode,
            body: JSON.stringify({error}),
            headers
        };
    }
}
