import { Client } from 'pg';
// const {Client} = require('pg');
import {config} from 'dotenv';
config();
// require('dotenv').config();
import {Product} from "../models/Product";
import {DbException} from "../exceptions/DbException";
import {LogService} from "./log-service";
import {CreateProductDto} from "../dto/create-product.dto";

export class DbService {
    private client;
    private logService: LogService;

    constructor() {
        this.client = this.getClient();
        this.logService = new LogService();
    }

    getClient() {
        return new Client(this.getDbOptions());
    }

    getDbOptions() {
        const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

        return {
            host: PG_HOST,
            port: PG_PORT,
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
        await this.client.connect();
        try {
            const {rows} = await this.client.query(`select * from product inner join stock s on product.id = s.product_id`);
            return rows;
        } catch (e) {
            this.logService.error('getAllProducts', e);
            throw new DbException();
        } finally {
            await this.client.end();
        }
    }

    async getProductById(id: string): Promise<Product> {
        await this.client.connect();
        try {
            const {rows} = await this.client.query(`select * from product p
                inner join stock s on p.id = s.product_id
                where p.id = $1
            `, [id]);

            return rows[0];
        } catch (e) {
            this.logService.error('getProductById', e);
            throw new DbException();
        } finally {
            await this.client.end();
        }
    }

    async createProduct(body): Promise<void> {
        await this.client.connect();
        try {
            const {
                title,
                description,
                price,
                count,
                image
            } = body as CreateProductDto;

            await this.client.query(
                `with resp1 as (insert into product(title, description, price, image) values($1, $2, $3, $4) returning id)
                 insert into stock (product_id, count) values ((select id from resp1), $5)`,
                [title, description, price, image, count]
            );
        } catch (e) {
            this.logService.error('createProduct', e);
            throw new DbException();
        } finally {
            await this.client.end();
        }
    }
}