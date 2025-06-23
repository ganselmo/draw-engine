import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TicketResponseDto } from './ticket-response.dto';

export class TicketReservationResponseDto {
  @ApiProperty({
    description: 'List of tickets that were successfully reserved',
    type: [TicketResponseDto],
  })
  @Expose()
  @Type(() => TicketResponseDto)
  reservedTickets: TicketResponseDto[];

  @ApiProperty({
    description: 'List of tickets that could not be reserved (already taken or invalid)',
    type: [TicketResponseDto],
  })
  @Expose()
  @Type(() => TicketResponseDto)
  unavailableTickets: TicketResponseDto[];
}