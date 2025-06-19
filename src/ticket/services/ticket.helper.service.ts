import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Ticket } from '../entities/ticket.entity';
import { TicketResponseDto } from '../dtos/ticket-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Draw } from '../../draw/entities/draw.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketHelperService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
  ) {}
  getExpirationDate(redisTicketExpirationTime: number | undefined) {
    return new Date(
      new Date().getTime() +
        10 * (redisTicketExpirationTime ? redisTicketExpirationTime : 300),
    );
  }

  serializeTickets(tickets: Ticket[]): TicketResponseDto[] {
    return tickets.map((ticket) =>
      plainToInstance(TicketResponseDto, ticket, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async verifyIfNumberIsInDrawRange(
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
}
