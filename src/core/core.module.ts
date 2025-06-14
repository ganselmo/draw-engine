import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedRedisModule } from '../shared-redis/shared-redis.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { SharedModule } from '../shared/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    SharedRedisModule,
    PersistenceModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [ConfigModule, SharedRedisModule, PersistenceModule, SharedModule],
})
export class CoreModule {}
