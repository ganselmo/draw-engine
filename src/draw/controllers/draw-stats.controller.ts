import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DrawStatsService } from '../services/draw-stats.service';

@UseGuards(JwtAuthGuard)
@Controller('draws/:id/stats')
export class DrawStatsController {
  constructor(private readonly drawStatsService:DrawStatsService) {}
  @Get()
  showStats(@Param('id') id: string) {
    this.drawStatsService.showStats(id);
  }

  @Get('total')
  totalTicketsCount(@Param('id') id: string) {
    this.drawStatsService.totalTicketsCount(id);
  }

  @Get('available')
  availableTickets(@Param('id') id: string) {
    this.drawStatsService.availableTickets(id);
  }

  @Get('reserved')
  reservedTickets(@Param('id') id: string) {
    this.drawStatsService.reservedTickets(id)
  }

  @Get('confirmed')
  confirmedTickets(@Param('id') id: string) {
    this.drawStatsService.confirmedTickets(id)
  }

  @Get('percents')
  statsPercentage(@Param('id') id: string) {
    this.drawStatsService.statsPercentage(id)
  }

  @Get('remaining-time')
  remainingTime(@Param('id') id: string) {
    this.drawStatsService.remainingTime(id)
  }
}
