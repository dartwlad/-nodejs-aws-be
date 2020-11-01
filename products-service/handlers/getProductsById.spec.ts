import {getProductsById} from "./getProductsById";
import {ProductsService} from "../../services/products-service";
import {products} from "../mocks/products";
import {headers} from "../mocks/headers";

describe('getProductsById', () => {
    test('should get product by id', async() => {
        const productId = 1;
        const product = products[0];
        const event = {
            pathParameters: {
                productId
            }
        };
        jest.spyOn(new ProductsService(), 'getProductsById').mockResolvedValueOnce(product);
        const actualResponse = await getProductsById(event);

        expect(actualResponse).toEqual({
            body: JSON.stringify(product),
            statusCode: 200,
            headers
        });
    });

    test('should throw error if no products found', async() => {
        const productId = 5;
        const statusCode = 404;
        const error = 'NotFound';
        const localError = {
            statusCode,
            error
        };
        const event = {
            pathParameters: {
                productId
            }
        };
        jest.spyOn(new ProductsService(), 'getProductsById').mockRejectedValueOnce(localError);
        const actualResponse = await getProductsById(event);

        expect(actualResponse).toEqual({
            body: JSON.stringify({error}),
            statusCode,
            headers
        });
    });
});
