import {getProducts} from "./getProducts";
import {ProductsService} from "../../services/products-service";
import {products} from "../mocks/products";
import {headers} from "../mocks/headers";

describe('getProducts', () => {
    test('should get products', async() => {
        jest.spyOn(new ProductsService(), 'getProducts').mockResolvedValueOnce(products);
        const actualResponse = await getProducts();

        expect(actualResponse).toEqual({
            body: JSON.stringify(products),
            statusCode: 200,
            headers
        });
    });
});
