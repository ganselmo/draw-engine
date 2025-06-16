import { Expose } from 'class-transformer';
import { TicketStatus } from '../enums/ticket-status.enum';

export class TicketResponseDto {
  @Expose()
  id: string;

  @Expose()
  number: number;

  @Expose()
  drawId: string;

  @Expose()
  status: TicketStatus;

  @Expose()
  reservedAt: Date;
}
