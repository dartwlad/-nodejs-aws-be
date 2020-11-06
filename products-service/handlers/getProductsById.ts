import {ProductsService} from "../../services/products-service";
import {headers} from "../mocks/headers";

export const getProductsById: (event) => Promise<{ body: string; statusCode: number } | { body: string; statusCode: any }> = async (event) => {
    try {
        const body = JSON.stringify(await new ProductsService().getProductsById(Number(event.pathParameters.productId)));
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
