import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReserveTicketDto } from '../dtos/reserve-ticket.dto';
import { ConfirmTicketDto } from '../dtos/confirm-ticket.dto';
import { CancelReservedTicketDto } from '../dtos/cancel-reserved-ticket.dto';
import { Ticket } from '../entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';
import { plainToInstance } from 'class-transformer';
import { Draw } from '../../draw/entities/draw.entity';
import { runInTransaction } from '../../core/utils/transaction.util';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis/built';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({where:{id}})
    if(!ticket){
      throw new NotFoundException('Ticket not found')
    }
    return ticket;
  }

  async reserveTickets(
    userId: string,
    { drawId, numbers }: ReserveTicketDto,
  ): Promise<Ticket[]> {
    await this.verifyIfNumberIsInDrawRange(drawId, numbers);
    await this.verifyIfTicketsAreReserved(drawId, numbers);
    const redisTicketExpirationTime = this.configService.get<number>(
      'REDIS_TICKET_EXPIRATION_TIME',
    );
    const reservedDate = new Date();
    const expirationDate = new Date(
      reservedDate.getTime() +
        10 * (redisTicketExpirationTime ? redisTicketExpirationTime : 300),
    );

    const ticketData: Partial<Ticket>[] = numbers.map((number) => ({
      drawId,
      number,
      expiresAt: expirationDate,
      reservedAt: reservedDate,
      userId,
      status: TicketStatus.RESERVED,
    }));
    try {
      const tickets = this.ticketRepository.create(ticketData);
      const savedTickets = await runInTransaction(
        this.dataSource,
        async (manager) => {
          return this.createTicketsAndSave(
            tickets,
            redisTicketExpirationTime ? redisTicketExpirationTime : 300,
            manager,
          );
        },
      );

      return savedTickets.map((savedTicket) =>
        plainToInstance(Ticket, savedTicket, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error reserving tickets ' + error,
      );
    }
  }
  async confirmTickets({
    drawId,
    numbers,
  }: ConfirmTicketDto): Promise<Ticket[]> {
    const reservedTickets = await this.fetchTicketsByNumbersAndStatus(
      drawId,
      numbers,
      TicketStatus.RESERVED,
    );

    const confirmedTickets = await runInTransaction(
      this.dataSource,
      async (manager) => {
        return this.updateTicketStatusAndSave(
          reservedTickets,
          TicketStatus.PAID,
          manager,
        );
      },
    );

    return confirmedTickets.map((ticket) =>
      plainToInstance(Ticket, ticket, { excludeExtraneousValues: true }),
    );
  }
  async cancelReservedTickets({
    drawId,
    numbers,
  }: CancelReservedTicketDto): Promise<Ticket[]> {
    const reservedTickets = await this.fetchTicketsByNumbersAndStatus(
      drawId,
      numbers,
      TicketStatus.RESERVED,
    );

    const cancelledTickets = await runInTransaction(
      this.dataSource,
      async (manager) => {
        return this.updateTicketStatusAndSave(
          reservedTickets,
          TicketStatus.CANCELLED,
          manager,
        );
      },
    );
    return cancelledTickets.map((ticket) =>
      plainToInstance(Ticket, ticket, { excludeExtraneousValues: true }),
    );
  }

  private async verifyIfTicketsAreReserved(
    drawId: string,
    numbers: number[],
  ): Promise<void> {
    const ticketAreReserved = await this.ticketRepository.find({
      where: {
        drawId,
        number: In(numbers),
        status: Not(TicketStatus.CANCELLED),
      },
    });
    if (ticketAreReserved.length > 0) {
      const message =
        `Some numbers are not available: ` +
        ticketAreReserved
          .map((ticket) => `#${ticket.number} (${ticket.status})`)
          .join(', ');
      throw new ConflictException(message);
    }
  }

  private async fetchTicketsByNumbersAndStatus(
    drawId: string,
    numbers: number[],
    status: TicketStatus,
  ): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: {
        drawId,
        number: In(numbers),
        status,
      },
    });
  }

  private async verifyIfNumberIsInDrawRange(
    drawId: string,
    numbers: number[],
  ): Promise<void> {
    const draw = await this.drawRepository.findOne({
      where: { id: drawId },
    });
    if (!draw) throw new NotFoundException('Draw not found');

    numbers.forEach((number) => {
      if (number > draw.ticketCount)
        throw new ConflictException('Number exceds draw ticket count');
    });
  }

  private async createTicketsAndSave(
    tickets: Ticket[],
    redisTicketExpirationTime: number,
    manager: EntityManager,
  ): Promise<Ticket[]> {
    const createdTickets: Ticket[] = [];
    for (const ticket of tickets) {
      const saved = await manager.save(ticket);
      await this.redis.set(
        `ticket:expiration:${ticket.id}`,
        'reserved',
        'EX',
        redisTicketExpirationTime,
      );
      createdTickets.push(saved);
    }
    return createdTickets;
  }

  private async updateTicketStatusAndSave(
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
}
