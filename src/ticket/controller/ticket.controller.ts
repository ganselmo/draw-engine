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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { TicketService } from '../services/ticket.service';
import { ReserveTicketDto } from '../dtos/reserve-ticket.dto';
import { ConfirmTicketDto } from '../dtos/confirm-ticket.dto';
import { CancelReservedTicketDto } from '../dtos/cancel-reserved-ticket.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { TicketResponseDto } from '../dtos/ticket-response.dto';
import { TicketConfirmationResponseDto } from '../dtos/ticket-confirmation-response.dto';
import { TicketReservationResponseDto } from '../dtos/ticket-reservation-response.dto';
import { ApiErrorResponses } from '../../decorators/swagger.decorators';

@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket found',
    type: TicketResponseDto,
  })
  @ApiErrorResponses([401, 500])
  getTicketById(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticketService.getTicketById(id);
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve one or more tickets for a draw' })
  @ApiResponse({
    status: 201,
    description: 'Tickets reserved',
    type: TicketReservationResponseDto,
  })
  @ApiErrorResponses([400, 401, 500])
  reserveTicket(
    @Req() req: Request,
    @Body() reserveTicketDto: ReserveTicketDto,
  ): Promise<TicketReservationResponseDto> {
    const userId = req['user'].sub;
    return this.ticketService.reserveTickets(userId, reserveTicketDto);
  }

  @Patch('cancel-expired')
  @ApiOperation({ summary: 'Cancel expired ticket reservations' })
  @ApiResponse({
    status: 200,
    description: 'List of cancelled reserved tickets',
    type: TicketResponseDto,
    isArray: true,
  })
  @ApiErrorResponses([400, 401, 500])
  cancelReservedTicket(
    @Body() cancelReservedTicketDto: CancelReservedTicketDto,
  ): Promise<TicketResponseDto[]> {
    return this.ticketService.cancelReservedTickets(cancelReservedTicketDto);
  }

  @Patch('confirm')
  @ApiOperation({ summary: 'Confirm one or more reserved tickets' })
  @ApiResponse({
    status: 200,
    description: 'Confirmed tickets summary',
    type: TicketConfirmationResponseDto,
  })
  @ApiErrorResponses([400, 401, 500])
  confirmTicket(
    @Body() confirmTicketDto: ConfirmTicketDto,
  ): Promise<TicketConfirmationResponseDto> {
    return this.ticketService.confirmTickets(confirmTicketDto);
  }
}