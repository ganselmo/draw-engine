import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatus } from '../enums/ticket-status.enum';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis/built';

@Injectable()
export class TicketPersistenceService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async reserveTicketsWithReuse(
    tickets: Ticket[],
    redisTicketExpirationTime: number,
    manager: EntityManager,
  ): Promise<Ticket[]> {
    const reservationTickets: Ticket[] = [];

    for (const ticket of tickets) {
      const saved = await manager.save(ticket);
      await this.redis.set(
        `ticket:reserved:${ticket.id}`,
        'reserved',
        'EX',
        redisTicketExpirationTime,
      );
      reservationTickets.push(saved);
    }
    return reservationTickets;
  }

  async updateTicketStatusAndSave(
    tickets: Ticket[],
    status: TicketStatus,
    manager: EntityManager,
  ): Promise<Ticket[]> {
    const updatedTickets: Ticket[] = [];

    for (const ticket of tickets) {
      const updated = manager.merge(Ticket, ticket, {
        status,
        expiresAt: undefined,
      });
      const saved = await manager.save(updated);
      updatedTickets.push(saved);
    }

    return updatedTickets;
  }

  async deleteRedisKeys(reservedTickets: Ticket[]): Promise<void> {
    await Promise.all(
      reservedTickets.map((reservedTicket) =>
        this.redis.del(`ticket:reserved:${reservedTicket.id}`),
      ),
    );
  }
}
