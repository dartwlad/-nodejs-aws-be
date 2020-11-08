import {LogService} from "../services/log-service";
import {ProductsService} from "../services/products-service";
import {headers} from "../mocks/headers";
import {ValidationService} from "../services/validation-service";
import {CreateProductDto} from "../dto/create-product.dto";

export const createProduct = async (event) => {
    try {
        new LogService().log('about to createProduct', event);
        await new ValidationService().validateBody(CreateProductDto, event.body);
        await new ProductsService().createProduct(event.body);
        return {
            statusCode: 204,
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