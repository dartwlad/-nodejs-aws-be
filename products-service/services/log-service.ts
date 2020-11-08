export class LogService {
    log(text, ...params): void {
        console.log(text, ...params);
    }

    error(text, ...params): void {
        console.error(text, ...params);
    }
}