import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TicketResponseDto } from './ticket-response.dto';

export class TicketConfirmationResponseDto {
  @ApiProperty({
    description: 'List of tickets that were successfully confirmed',
    type: [TicketResponseDto],
  })
  @Expose()
  @Type(() => TicketResponseDto)
  confirmedTickets: TicketResponseDto[];

  @ApiProperty({
    description: 'List of tickets that could not be confirmed (e.g., invalid or expired)',
    type: [TicketResponseDto],
  })
  @Expose()
  @Type(() => TicketResponseDto)
  notConfirmedTickets: TicketResponseDto[];
}