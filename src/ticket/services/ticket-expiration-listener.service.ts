import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { TicketService } from './ticket.service';

@Injectable()
export class RedisExpirationListenerService implements OnModuleInit {
  constructor(
    @Inject('REDIS_SUBSCRIBER') private readonly subscriber: Redis,
    private readonly ticketService: TicketService,
  ) {}

  async onModuleInit() {
    await this.subscriber.psubscribe('__keyevent@0__:expired', (err, count) => {
      if (err) console.error(err);
    });

    this.subscriber.on('pmessage', async (_pattern, _channel, key) => {
      if (key.startsWith('ticket:reserved:')) {
        const ticketId = key.replace('ticket:reserved:', '');
        await this.ticketService.markTicketAsCancelled(ticketId);
      }
    });
  }
}
