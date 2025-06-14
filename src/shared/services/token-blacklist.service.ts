import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { TokenUtilsService } from '../utils/token-utils.service';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly tokenUtilsService:TokenUtilsService
  ) {}

  async blacklistToken(token: string): Promise<void> {
    const ttl: number = this.tokenUtilsService.getTokenTtl(token);
    if (ttl > 0) {
      await this.redis.set(`blacklist:${token}`, '1', 'EX', ttl);
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${token}`);
    return result === '1';
  }


}
