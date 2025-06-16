import { Expose } from 'class-transformer';
import { Status } from '../enums/status.enum';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { TicketResponseDto } from '../../ticket/dtos/ticket-response.dto';

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
  owner: UserResponseDto;

  @Expose()
  tickets: TicketResponseDto[];
}
