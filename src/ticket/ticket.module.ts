import { Module } from '@nestjs/common';
import { TicketService } from './services/ticket.service';
import { TicketController } from './controller/ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Draw } from '../draw/entities/draw.entity';
import { SharedRedisModule } from '../shared-redis/shared-redis.module';
import { RedisExpirationListenerService } from './services/ticket-expiration-listener.service';
import { TicketHelperService } from './services/ticket.helper.service';
import { TicketPersistenceService } from './services/ticket-persistence.service';

@Module({
  imports: [TypeOrmModule.forFeature([Draw, Ticket]), SharedRedisModule],
  controllers: [TicketController],
  providers: [
    TicketService,
    TicketHelperService,
    TicketPersistenceService,
    RedisExpirationListenerService,
  ],
})
export class TicketModule {}
