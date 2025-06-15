import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Draw } from '../draw/entities/draw.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Draw,Ticket])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
