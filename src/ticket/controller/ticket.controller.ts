import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { ReserveTicketDto } from '../dtos/reserve-ticket.dto';
import { ConfirmTicketDto } from '../dtos/confirm-ticket.dto';
import { CancelReservedTicketDto } from '../dtos/cancel-reserved-ticket.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}


  @Get(':id')
  getTicketById(@Param('id') id: string){
    return this.ticketService.getTicketById(id );
  }

  @Post('reserve')
  reserveTicket(
    @Req() req: Request,
    @Body() reserveTicketDto: ReserveTicketDto,
  ) {
    const userId = req['user'].sub;
    return this.ticketService.reserveTickets(userId, reserveTicketDto);
  }

  @Post('cancel-expired')
  cancelReservedTicket(
    @Body() cancelReservedTicketDto: CancelReservedTicketDto,
  ) {
    return this.ticketService.cancelReservedTickets(cancelReservedTicketDto);
  }

  @Post('confirm')
  confirmTicket(@Body() confirmTicketDto: ConfirmTicketDto) {
    return this.ticketService.confirmTickets(confirmTicketDto);
  }
}
