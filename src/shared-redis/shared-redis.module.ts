import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';
import Redis from 'ioredis/built';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const password = configService.get<string>('REDIS_PASSWORD');

        const url = password
          ? `redis://:${password}@${host}:${port}`
          : `redis://${host}:${port}`;

        return {
          type: 'single',
          url,
        };
      },
    }),
  ],
  providers: [
    RedisConfigService,
    {
      provide: 'REDIS_SUBSCRIBER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const password = configService.get<string>('REDIS_PASSWORD');

        const url = password
          ? `redis://:${password}@${host}:${port}`
          : `redis://${host}:${port}`;

        const client = new Redis(url);
        client.config('SET', 'notify-keyspace-events', 'Ex');

        return client;
      },
    },
  ],
  exports: [RedisModule,'REDIS_SUBSCRIBER'],
})
export class SharedRedisModule {}
