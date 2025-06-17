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
import { TicketResponseDto } from '../dtos/ticket-response.dto';

@Injectable()
export class TicketService {
  redisTicketExpirationTime: number | undefined;

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.redisTicketExpirationTime = this.configService.get<number>(
      'REDIS_TICKET_EXPIRATION_TIME',
    );
  }

  async getTicketById(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return plainToInstance(TicketResponseDto, ticket, {
      excludeExtraneousValues: true,
    });
  }

  async reserveTickets(
    userId: string,
    { drawId, numbers }: ReserveTicketDto,
  ): Promise<TicketResponseDto[]> {
    await this.verifyIfNumberIsInDrawRange(drawId, numbers);
    await this.verifyIfTicketsAreReserved(drawId, numbers);
    const expirationDate = this.getExpirationDate(
      this.redisTicketExpirationTime,
    );

    const ticketsCanceled = await this.ticketRepository.find({
      where: { drawId, number: In(numbers), status:TicketStatus.CANCELLED },
    });

    const ticketNumbersCanceled = ticketsCanceled.map(
      (ticket) => ticket.number,
    );
    const ticketNumbersToCreate = numbers.filter(
      (number) => !ticketNumbersCanceled.includes(number),
    );

    const ticketDataToCreate: Partial<Ticket>[] = ticketNumbersToCreate.map(
      (number) => ({
        drawId,
        number,
        expiresAt: expirationDate,
        reservedAt: new Date(),
        userId,
        status: TicketStatus.RESERVED,
      }),
    );
    const ticketsToCreate = this.ticketRepository.create(ticketDataToCreate);

    const ticketsToReuse = ticketsCanceled.map((ticketToReuse) =>
      this.ticketRepository.merge(ticketToReuse, {
        expiresAt: expirationDate,
        reservedAt: new Date(),
        userId,
        status: TicketStatus.RESERVED,
      }),
    );
    const ticketsToSave = [ticketsToCreate, ticketsToReuse].flat()
    console.log(ticketsToSave)
    try {
      const savedTickets = await runInTransaction(
        this.dataSource,
        async (manager) => {
          return this.reserveTicketsWithReuse(
            ticketsToSave,
            this.redisTicketExpirationTime
              ? this.redisTicketExpirationTime
              : 300,
            manager,
          );
        },
      );

      return savedTickets.map((savedTicket) =>
        plainToInstance(TicketResponseDto, savedTicket, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error reserving tickets ' + error,
      );
    }
  }
  private getExpirationDate(redisTicketExpirationTime: number | undefined) {
    return new Date(
      new Date().getTime() +
        10 * (redisTicketExpirationTime ? redisTicketExpirationTime : 300),
    );
  }

  async confirmTickets({
    drawId,
    numbers,
  }: ConfirmTicketDto): Promise<TicketResponseDto[]> {
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
      plainToInstance(TicketResponseDto, ticket, {
        excludeExtraneousValues: true,
      }),
    );
  }
  async cancelReservedTickets({
    drawId,
    numbers,
  }: CancelReservedTicketDto): Promise<TicketResponseDto[]> {
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
      plainToInstance(TicketResponseDto, ticket, {
        excludeExtraneousValues: true,
      }),
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

  private async reserveTicketsWithReuse(
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

  async markTicketAsCancelled(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket || ticket.status !== TicketStatus.RESERVED) return;

    ticket.status = TicketStatus.CANCELLED;
    await this.ticketRepository.save(ticket);
  }
}
