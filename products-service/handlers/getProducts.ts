import {ProductsService} from "../../services/products-service";
import {headers} from "../mocks/headers";

export const getProducts: () => Promise<{ body: string; statusCode: number }> = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify(await new ProductsService().getProducts()),
        headers
    };
}
