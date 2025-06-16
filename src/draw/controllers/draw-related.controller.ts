import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DrawRelatedService } from '../services/draw.related.service';
import { Ticket } from '../../ticket/entities/ticket.entity';

@UseGuards(JwtAuthGuard)
@Controller('draws')
export class DrawRelatedController {
  constructor(private readonly drawRelatedService: DrawRelatedService) {}

  @Get(':id/tickets')
  getDrawTickets(@Param('id') id: string): Promise<Ticket[]> {
    return this.drawRelatedService.getDrawTickets(id);
  }

  @Get(':id/tickets/:number')
  checkIfNumberIsAvaliable(
    @Param('id') id: string,
    @Param('id') number: number,
  ): Promise<boolean> {
    return this.drawRelatedService.checkIfNumberIsAvailable(id, number);
  }
}
