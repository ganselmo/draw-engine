import { Expose } from 'class-transformer';
import { TicketResponseDto } from './ticket-response.dto';

export class TicketReservationResponseDto {
  @Expose()
  reservedTickets:TicketResponseDto[]
  
  @Expose()
  unavailableTickets: TicketResponseDto[];

}
