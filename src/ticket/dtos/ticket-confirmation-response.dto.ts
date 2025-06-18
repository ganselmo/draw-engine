import { Expose } from 'class-transformer';
import { TicketResponseDto } from './ticket-response.dto';

export class TicketConfirmationResponseDto {
  @Expose()
  confirmedTickets:TicketResponseDto[]
  
  @Expose()
  notConfirmedTickets: TicketResponseDto[];

}
