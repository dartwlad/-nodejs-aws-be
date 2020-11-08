import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {ValidationException} from "../exceptions/ValidationException";

export class ValidationService {
    async validateBody(type, body, skipMissingProperties = false) {
        const errors: ValidationError[] = await validate(plainToClass(type, JSON.parse(body)), { skipMissingProperties });
        if (errors.length) {
            const message = errors
                .map((error: ValidationError) => Object.values(error.constraints))
                .join(', ');
            throw new ValidationException(message);
        }
    }
}
