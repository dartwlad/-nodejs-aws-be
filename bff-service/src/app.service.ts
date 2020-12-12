import { HttpService, HttpStatus, Injectable, Request } from '@nestjs/common';
import { config } from 'dotenv';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

config();

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  bff(req: Request) {
    console.log('url', req.url);
    console.log('method', req.method);
    console.log('body', req.body);

    const recipient = req.url.split('/')[1];
    console.log('recipient', recipient);

    const recipientUrl = process.env[recipient];
    console.log('recipientUrl', recipientUrl);

    if (recipientUrl) {
      const body = Object.keys(req.body).length ? req.body : undefined;

      const requestUrl = `${recipientUrl}${req.url}`;
      console.log('requestUrl', requestUrl);

      return this.httpService[req.method.toLowerCase()](
        requestUrl,
        // @ts-ignore
        body,
      ).pipe(
        map((response: any) => {
          console.log('response', response.data);

          return response.data;
        }),
        catchError((error) => {
          console.log('error', error.response.data);

          return of({
            message: error.response.data.message,
            statusCode:
              error.response.data.status ||
              error.response.status ||
              HttpStatus.INTERNAL_SERVER_ERROR,
          } as any);
        }),
      );
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'No such service',
      };
    }
  }
}
