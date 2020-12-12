import { CacheInterceptor, CacheModule, HttpModule, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 60, // seconds
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
