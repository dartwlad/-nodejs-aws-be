import {HttpException} from "./HttpException";

export class NotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Product ${id} not found`);
    }
}