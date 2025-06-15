import { Expose } from "class-transformer";
import { TicketStatus } from "../enums/ticket-status.enum";

export class TicketResponseDto {
  
  @Expose()
  number: number;

  @Expose()
  drawId: string;

  @Expose()
  status: TicketStatus;

  @Expose()
  reservedAt: Date;

}