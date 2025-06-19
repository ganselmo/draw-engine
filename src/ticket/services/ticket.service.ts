import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReserveTicketDto } from '../dtos/reserve-ticket.dto';
import { ConfirmTicketDto } from '../dtos/confirm-ticket.dto';
import { CancelReservedTicketDto } from '../dtos/cancel-reserved-ticket.dto';
import { Ticket } from '../entities/ticket.entity';
import { DataSource, In } from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';
import { plainToInstance } from 'class-transformer';
import { runInTransaction } from '../../core/utils/transaction.util';
import { ConfigService } from '@nestjs/config';
import { TicketResponseDto } from '../dtos/ticket-response.dto';
import { TicketConfirmationResponseDto } from '../dtos/ticket-confirmation-response.dto';
import { TicketReservationResponseDto } from '../dtos/ticket-reservation-response.dto';
import { TicketHelperService } from './ticket.helper.service';
import { TicketPersistenceService } from './ticket-persistence.service';
import { TicketRepository } from '../repositories/ticket.repository';

type TicketRepositoryType = ReturnType<typeof TicketRepository>;

@Injectable()
export class TicketService {
  redisTicketExpirationTime: number | undefined;

  private readonly ticketRepository: TicketRepositoryType;
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly ticketHelperService: TicketHelperService,
    private readonly ticketPersistenceService: TicketPersistenceService,
  ) {
    this.redisTicketExpirationTime = this.configService.get<number>(
      'REDIS_TICKET_EXPIRATION_TIME',
    );
    this.ticketRepository = TicketRepository(
      this.dataSource.getRepository(Ticket),
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
  ): Promise<TicketReservationResponseDto> {
    await this.ticketHelperService.verifyIfNumberIsInDrawRange(drawId, numbers);
    const unavailableTickets: Ticket[] =
      await this.ticketRepository.findUnavailableTickets(drawId, numbers);

      
    const requestedUnavailableNumbers = unavailableTickets.map(
      (ticket) => ticket.number,
    );
    const availableNumbers = numbers.filter((number) =>
      !requestedUnavailableNumbers.includes(number),
    );

    const expirationDate = this.ticketHelperService.getExpirationDate(
      this.redisTicketExpirationTime,
    );

    const ticketsCanceled = await this.ticketRepository.find({
      where: {
        drawId,
        number: In(availableNumbers),
        status: TicketStatus.CANCELLED,
      },
    });

    const ticketNumbersCanceled = ticketsCanceled.map(
      (ticket) => ticket.number,
    );
    const ticketNumbersToCreate = availableNumbers.filter(
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

    const ticketsToSave = [...ticketsToCreate, ...ticketsToReuse];

    try {
      const savedTickets = await runInTransaction(
        this.dataSource,
        async (manager) => {
          return this.ticketPersistenceService.reserveTicketsWithReuse(
            ticketsToSave,
            this.redisTicketExpirationTime
              ? this.redisTicketExpirationTime
              : 300,
            manager,
          );
        },
      );

      return plainToInstance(
        TicketReservationResponseDto,
        {
          reservedTickets:
            savedTickets.length > 0
              ? this.ticketHelperService.serializeTickets(savedTickets)
              : undefined,
          unavailableTickets:
            unavailableTickets.length > 0
              ? this.ticketHelperService.serializeTickets(unavailableTickets)
              : undefined,
        },
        { excludeExtraneousValues: true },
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
  }: ConfirmTicketDto): Promise<TicketConfirmationResponseDto> {
    const tickets: Ticket[] = await this.ticketRepository.findTicketsByNumbers(
      drawId,
      numbers,
    );

    const reservedTickets = tickets.filter(
      (ticket) => ticket.status === TicketStatus.RESERVED,
    );
    const notConfirmedTickets = tickets.filter(
      (ticket) => ticket.status != TicketStatus.RESERVED,
    );
    await this.ticketPersistenceService.deleteRedisKeys(reservedTickets);

    const confirmedTickets = await runInTransaction(
      this.dataSource,
      async (manager) => {
        return this.ticketPersistenceService.updateTicketStatusAndSave(
          reservedTickets,
          TicketStatus.PAID,
          manager,
        );
      },
    );

    return plainToInstance(
      TicketConfirmationResponseDto,
      {
        confirmedTickets:
          confirmedTickets.length > 0
            ? this.ticketHelperService.serializeTickets(confirmedTickets)
            : undefined,

        notConfirmedTickets:
          notConfirmedTickets.length > 0
            ? this.ticketHelperService.serializeTickets(notConfirmedTickets)
            : undefined,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async cancelReservedTickets({
    drawId,
    numbers,
  }: CancelReservedTicketDto): Promise<TicketResponseDto[]> {
    const reservedTickets =
      await this.ticketRepository.fetchTicketsByNumbersAndStatus(
        drawId,
        numbers,
        TicketStatus.RESERVED,
      );

    const cancelledTickets = await runInTransaction(
      this.dataSource,
      async (manager) => {
        return this.ticketPersistenceService.updateTicketStatusAndSave(
          reservedTickets,
          TicketStatus.CANCELLED,
          manager,
        );
      },
    );
    return this.ticketHelperService.serializeTickets(cancelledTickets);
  }

  async markTicketAsCancelled(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket || ticket.status !== TicketStatus.RESERVED) return;
    ticket.status = TicketStatus.CANCELLED;
    await this.ticketRepository.save(ticket);
  }
}
