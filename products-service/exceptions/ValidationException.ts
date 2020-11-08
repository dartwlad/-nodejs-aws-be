import {HttpException} from "./HttpException";

export class ValidationException extends HttpException {
    constructor(errors: string) {
        super(400, errors);
    }
}