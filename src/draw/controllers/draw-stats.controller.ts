import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DrawStatsService } from '../services/draw-stats.service';
import { DrawStatsDto } from '../dtos/draw-stats.dto';

@UseGuards(JwtAuthGuard)
@Controller('draws/:id/stats')
export class DrawStatsController {
  constructor(private readonly drawStatsService: DrawStatsService) {}
  @Get()
  showStats(@Param('id') id: string): Promise<DrawStatsDto> {
    return this.drawStatsService.showStats(id);
  }

  @Get('total')
  totalTicketsCount(@Param('id') id: string) {
    return this.drawStatsService.totalTicketsCount(id);
  }

  @Get('available')
  availableTickets(@Param('id') id: string) {
    return this.drawStatsService.availableTickets(id);
  }

  @Get('reserved')
  reservedTickets(@Param('id') id: string) {
    return this.drawStatsService.reservedTickets(id);
  }

  @Get('confirmed')
  confirmedTickets(@Param('id') id: string) {
    return this.drawStatsService.confirmedTickets(id);
  }

  @Get('percents')
  statsPercentage(@Param('id') id: string) {
    return this.drawStatsService.statsPercentage(id);
  }

  @Get('remaining-time')
  remainingTime(@Param('id') id: string) {
    return this.drawStatsService.remainingTime(id);
  }
}
