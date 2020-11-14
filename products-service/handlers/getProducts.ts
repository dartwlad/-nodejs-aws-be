import {ProductsService} from "../services/products-service";
import {headers} from "../mocks/headers";
import {LogService} from "../services/log-service";

export const getProducts = async (event) => {
    try {
        new LogService().log('about to getProducts', event);
        const body = JSON.stringify(await new ProductsService().getProducts());
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
