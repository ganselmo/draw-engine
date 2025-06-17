
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisConfigService implements OnApplicationBootstrap {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onApplicationBootstrap() {
    await this.redis.config('SET', 'notify-keyspace-events', 'Ex');
  }
}