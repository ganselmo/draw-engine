import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TicketStatus } from '../../ticket/enums/ticket-status.enum';
import { Draw } from '../entities/draw.entity';
import { plainToInstance } from 'class-transformer';
import { DrawStatsDto } from '../dtos/draw-stats.dto';
import { DrawPercentsDto } from '../dtos/draw-percents.dto';
import { DrawRemainingDaysDto } from '../dtos/draw-remaining-days.dto';

@Injectable()
export class DrawStatsService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
  ) {}

  async showStats(id: string): Promise<DrawStatsDto> {
    const draw = await this.getDrawWithTickets(id);
    const { availableTickets, cancelled, reserved, paid } =
      this.mapTicketData(draw);

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

  async availableTickets(id: string): Promise<DrawStatsDto> {
    const draw = await this.getDrawWithTickets(id);
    const unavailableTickets = draw.tickets
      .filter(
        (ticket) =>
          ticket.status === TicketStatus.PAID ||
          ticket.status === TicketStatus.RESERVED,
      )
      .map((ticket) => ticket.number);
    const availableTickets: number[] = Array.from(
      { length: draw.ticketCount },
      (_, i) => i + 1,
    ).filter((num) => !unavailableTickets.includes(num));

    return plainToInstance(
      DrawStatsDto,
      {
        count: {
          available: availableTickets.length,
        },
        available: availableTickets,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async reservedTickets(id: string): Promise<DrawStatsDto> {
    const draw = await this.getDrawWithTickets(id);

    const reserved = draw.tickets
      .filter((ticket) => ticket.status === TicketStatus.RESERVED)
      .map((ticket) => ticket.number);
    return plainToInstance(
      DrawStatsDto,
      {
        count: {
          reserved: reserved.length,
        },
        reserved: reserved,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async confirmedTickets(id: string): Promise<DrawStatsDto> {
    const draw = await this.getDrawWithTickets(id);

    const reserved = draw.tickets
      .filter((ticket) => ticket.status === TicketStatus.PAID)
      .map((ticket) => ticket.number);
    return plainToInstance(
      DrawStatsDto,
      {
        count: {
          reserved: reserved.length,
        },
        reserved: reserved,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async statsPercentage(id: string): Promise<DrawPercentsDto> {
    const draw = await this.getDrawWithTickets(id);
    const { availableTickets, cancelled, reserved, paid } =
      this.mapTicketData(draw);

    return plainToInstance(
      DrawPercentsDto,
      {
        percents: {
          available:
            (availableTickets.length - cancelled.length) / draw.ticketCount,
          cancelled: cancelled.length / draw.ticketCount,
          reserved: reserved.length / draw.ticketCount,
          paid: paid.length / draw.ticketCount,
        },
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async remainingDays(id: string): Promise<DrawRemainingDaysDto> {
    const draw = await this.getDraw(id);

    if (!draw.drawDate) {
      throw new ConflictException('Draw does not have a draw Date');
    }
    const now = Date.now();
    const drawTime = new Date(draw.drawDate).getTime();

    const diffInMs = drawTime - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return { remainingDays: diffInMs > 0 ? diffInDays : 0 };
  }

  private async getDrawWithTickets(id: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });
    if (!draw) {
      throw new NotFoundException('Draw not found');
    }
    return draw;
  }

  private async getDraw(id: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne({
      where: { id },
    });
    if (!draw) {
      throw new NotFoundException('Draw not found');
    }
    return draw;
  }

  private mapTicketData(draw: Draw): {
    availableTickets: number[];
    cancelled: number[];
    reserved: number[];
    paid: number[];
  } {
    const ticketMap = new Map<TicketStatus, number[]>([
      [TicketStatus.RESERVED, []],
      [TicketStatus.PAID, []],
      [TicketStatus.CANCELLED, []],
    ]);

    const grouped = draw.tickets.reduce((acc, ticket) => {
      acc.get(ticket.status)?.push(ticket.number);
      return acc;
    }, ticketMap);

    const reserved = grouped.get(TicketStatus.RESERVED) ?? [];
    const paid = grouped.get(TicketStatus.PAID) ?? [];
    const cancelled = grouped.get(TicketStatus.CANCELLED) ?? [];

    const ownedTickets = [...reserved, ...paid];

    const availableTickets: number[] = Array.from(
      { length: draw.ticketCount },
      (_, i) => i + 1,
    ).filter((num) => !ownedTickets.includes(num));
    return { availableTickets, cancelled, reserved, paid };
  }
}
