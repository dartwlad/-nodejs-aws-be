import {HttpException} from "./HttpException";

export class DbException extends HttpException {
    constructor() {
        super(500, 'DB error');
    }
}