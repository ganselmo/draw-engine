import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DrawRelatedService } from '../services/draw.related.service';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { ApiErrorResponses } from '../../decorators/swagger.decorators';

@ApiTags('Draws')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('draws')
export class DrawRelatedController {
  constructor(private readonly drawRelatedService: DrawRelatedService) {}

  @Get(':id/tickets')
  @ApiOperation({ summary: 'Get all tickets associated with a draw' })
  @ApiResponse({
    status: 200,
    description: 'List of tickets for the specified draw',
    type: Ticket,
    isArray: true,
  })
  @ApiErrorResponses([401, 500])
  getDrawTickets(@Param('id') id: string): Promise<Ticket[]> {
    return this.drawRelatedService.getDrawTickets(id);
  }

  @Get(':id/tickets/:number')
  @ApiOperation({ summary: 'Check if a ticket number is available in a draw' })
  @ApiResponse({
    status: 200,
    description: 'Boolean indicating availability',
    schema: { type: 'boolean', example: true },
  })
  @ApiErrorResponses([400, 401, 500])
  checkIfNumberIsAvaliable(
    @Param('id') id: string,
    @Param('number') number: number,
  ): Promise<boolean> {
    return this.drawRelatedService.checkIfNumberIsAvailable(id, number);
  }
}
