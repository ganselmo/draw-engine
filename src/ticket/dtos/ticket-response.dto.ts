import { Expose } from 'class-transformer';
import { TicketStatus } from '../enums/ticket-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TicketResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the ticket',
    example: 'a1b2c3d4',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Ticket number within the draw', example: 42 })
  @Expose()
  number: number;

  @ApiProperty({
    description: 'ID of the associated draw',
    example: 'z9y8x7w6',
  })
  @Expose()
  drawId: string;

  @ApiProperty({
    description: 'Current status of the ticket',
    enum: TicketStatus,
  })
  @Expose()
  status: TicketStatus;

  @ApiProperty({
    description: 'Timestamp when the ticket was reserved',
    example: '2025-06-22T19:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  reservedAt: Date;
}
