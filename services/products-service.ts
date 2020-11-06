import {products} from "../products-service/mocks/products";
import {Product} from "../products-service/models/Product";

export class ProductsService {
    getProducts = (): Promise<Product[]> => {
        return Promise.resolve(products);
    }

    getProductsById = (id: number): Promise<Product> => {
        const neededProduct = products.find((product) => product.id === id);
        if (neededProduct) {
            return Promise.resolve(neededProduct);
        }

        return Promise.reject({error: 'NotFound', statusCode: 404});
    }
}
