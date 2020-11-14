import {Product} from "../models/Product";
import {DbService} from "./db-service";
import {NotFoundException} from "../exceptions/NotFoundException";
import {MapperService} from "./mapper-service";

export class ProductsService {
    private dbService: DbService;
    private mapperService: MapperService;

    constructor() {
        this.dbService = new DbService();
        this.mapperService = new MapperService();
    }

    getProducts = async (): Promise<Product[]> => {
        return (await this.dbService.getAllProducts())
            .map(this.mapperService.mapToProduct);
    }

    getProductsById = async (id: string): Promise<Product> => {
        const neededProduct = await this.dbService.getProductById(id);
        if (neededProduct) {
            return this.mapperService.mapToProduct(neededProduct);
        }
        throw new NotFoundException(id);
    }

    createProduct = async (body) => {
        await this.dbService.createProduct(JSON.parse(body));
    }
}
