import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { TicketStatus } from '../../ticket/enums/ticket-status.enum';
import { Draw } from '../entities/draw.entity';
import { plainToInstance } from 'class-transformer';
import { DrawStatsDto } from '../dtos/draw-stats.dto';

@Injectable()
export class DrawStatsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
  ) {}

  async showStats(id: string): Promise<DrawStatsDto> {
    const draw = await this.drawRepository.findOneOrFail({
      where: { id },
      relations: ['tickets'],
    });
    console.log(draw);

    const grouped = draw.tickets.reduce(
      (acc, ticket) => {
        acc.get(ticket.status)?.push(ticket.number);
        return acc;
      },
      new Map<TicketStatus, number[]>([
        [TicketStatus.RESERVED, []],
        [TicketStatus.PAID, []],
        [TicketStatus.CANCELLED, []],
      ]),
    );

    const reserved = grouped.get(TicketStatus.RESERVED) ?? [];
    const paid = grouped.get(TicketStatus.PAID) ?? [];
    const cancelled = grouped.get(TicketStatus.CANCELLED) ?? [];

    const ownedTickets = [...reserved, ...paid];

    const availableTickets: number[] = Array.from(
      { length: draw.ticketCount },
      (_, i) => i + 1,
    ).filter((num) => !ownedTickets.includes(num));

    return plainToInstance(
      DrawStatsDto,
      {
        count: {
          available: availableTickets.length - cancelled.length,
          cancelled: cancelled.length,
          reserved: reserved.length,
          paid: paid.length,
        },
        available: availableTickets,
        reserved,
        paid,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async totalTicketsCount(id: string) {}

  async availableTickets(id: string) {
    throw new Error('Method not implemented.');
  }

  async reservedTickets(id: string): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: { drawId: id, status: TicketStatus.RESERVED },
    });
  }

  async confirmedTickets(id: string): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: { drawId: id, status: TicketStatus.PAID },
    });
  }

  async statsPercentage(id: string) {
    throw new Error('Method not implemented.');
  }

  async remainingTime(id: string) {
    throw new Error('Method not implemented.');
  }
}
