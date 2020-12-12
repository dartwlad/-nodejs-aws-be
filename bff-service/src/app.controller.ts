import { All, CacheInterceptor, Controller, Req, Request, UseInterceptors } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All([''])
  async bff(@Req() req: Request) {
    return await this.appService.bff(req);
  }
}
