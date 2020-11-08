export class HttpException extends Error {
    statusCode: number;
    error: string;

    constructor(status: number, message: string) {
        super(message);
        this.statusCode = status;
        this.error = message;
    }
}