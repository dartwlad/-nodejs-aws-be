import { Client } from 'pg';
import {Product} from "../models/Product";
import {DbException} from "../exceptions/DbException";
import {LogService} from "./log-service";
import {CreateProductDto} from "../dto/create-product.dto";

export class DbService {
    private logService: LogService;

    constructor() {
        this.logService = new LogService();
    }

    getClient(): Client {
        return new Client(this.getDbOptions());
    }

    getDbOptions() {
        const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

        return {
            host: PG_HOST,
            port: +PG_PORT,
            database: PG_DATABASE,
            user: PG_USERNAME,
            password: PG_PASSWORD,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 5000
        };
    }

    async getAllProducts(): Promise<Product[]> {
        const client = this.getClient();
        await client.connect();

        try {
            const {rows} = await client.query(`select * from product inner join stock s on product.id = s.product_id`);
            return rows;
        } catch (e) {
            this.logService.error('getAllProducts', e);
            throw new DbException();
        } finally {
            await client.end();
        }
    }

    async getProductById(id: string): Promise<Product> {
        const client = this.getClient();
        await client.connect();
        try {
            const {rows} = await client.query(`select * from product p
                inner join stock s on p.id = s.product_id
                where p.id = $1
            `, [id]);

            return rows[0];
        } catch (e) {
            this.logService.error('getProductById', e);
            throw new DbException();
        } finally {
            await client.end();
        }
    }

    async createProduct(body): Promise<void> {
        const client = this.getClient();
        try {
            await client.connect();
            const {
                title,
                description,
                price,
                count,
                image
            } = body as CreateProductDto;
            await client.query('BEGIN');
            await client.query(
                `with resp1 as (insert into product(title, description, price, image) values($1, $2, $3, $4) returning id)
                 insert into stock (product_id, count) values ((select id from resp1), $5)`,
                [title, description, price, image, count]
            );
            await client.query('COMMIT');
        } catch (e) {
            this.logService.error('createProduct', e);
            await client.query('ROLLBACK');
            throw new DbException();
        } finally {
            await client.end();
        }
    }
}
