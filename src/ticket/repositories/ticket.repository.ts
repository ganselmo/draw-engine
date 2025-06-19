import { Ticket } from '../entities/ticket.entity';
import { TicketStatus } from '../enums/ticket-status.enum';
import { In, Repository } from 'typeorm';



export const TicketRepository = (baseRepository: Repository<Ticket>) =>
  baseRepository.extend({
    async findUnavailableTickets(drawId: string, numbers: number[]) {
      console.log(drawId)
      return this.find({
        where: {
          drawId,
          number: In(numbers),
          status: In([TicketStatus.PAID, TicketStatus.RESERVED]),
        },
      });
    },

    async findReservedTickets(drawId: string, numbers: number[]) {
      console.log(drawId)
      return this.find({
        where: {
          drawId,
          number: In(numbers),
          status: TicketStatus.RESERVED,
        },
      });
    },

    async findTicketsByNumbers(drawId: string, numbers: number[]) {
      return this.find({
        where: {
          drawId,
          number: In(numbers),
        },
      });
    },

    async fetchTicketsByNumbersAndStatus(
      drawId: string,
      numbers: number[],
      status: TicketStatus,
    ) {
      return this.find({
        where: {
          drawId,
          number: In(numbers),
          status,
        },
      });
    },
  });
