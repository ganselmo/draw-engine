import { Expose } from 'class-transformer';
import { Status } from '../enums/status.enum';
import { User } from '../../user/entities/user.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';

export class DrawResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  ticketPrice: number;

  @Expose()
  prize: string;

  @Expose()
  drawDate: Date;

  @Expose()
  ticketCount: number;

  @Expose()
  status: Status;

  @Expose()
  owner: User;

  @Expose()
  tickets: Ticket[];
}
