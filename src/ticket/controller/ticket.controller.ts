import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { ReserveTicketDto } from '../dtos/reserve-ticket.dto';
import { ConfirmTicketDto } from '../dtos/confirm-ticket.dto';
import { CancelReservedTicketDto } from '../dtos/cancel-reserved-ticket.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { TicketResponseDto } from '../dtos/ticket-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get(':id')
  getTicketById(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticketService.getTicketById(id);
  }

  @Post('reserve')
  reserveTicket(
    @Req() req: Request,
    @Body() reserveTicketDto: ReserveTicketDto,
  ): Promise<TicketResponseDto[]> {
    const userId = req['user'].sub;
    return this.ticketService.reserveTickets(userId, reserveTicketDto);
  }

  @Patch('cancel-expired')
  cancelReservedTicket(
    @Body() cancelReservedTicketDto: CancelReservedTicketDto,
  ): Promise<TicketResponseDto[]> {
    return this.ticketService.cancelReservedTickets(cancelReservedTicketDto);
  }

  @Patch('confirm')
  confirmTicket(
    @Body() confirmTicketDto: ConfirmTicketDto,
  ): Promise<TicketResponseDto[]> {
    return this.ticketService.confirmTickets(confirmTicketDto);
  }
}
